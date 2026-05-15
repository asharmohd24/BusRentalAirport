<?php
/**
 * Universal Form Handler for Multiple Websites
 * Accepts booking and contact submissions from React frontends.
 */

// Load .env file (if exists)
if (file_exists(__DIR__ . '/../.env.backend')) {
    $lines = file(__DIR__ . '/../.env.backend', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        putenv(trim($name) . '=' . trim($value));
    }
}

// Configuration from environment
$config = [
    'db_host'     => getenv('DB_HOST') ?: 'localhost',
    'db_name'     => getenv('DB_NAME'),
    'db_user'     => getenv('DB_USER'),
    'db_pass'     => getenv('DB_PASS'),
    'recaptcha'   => getenv('RECAPTCHA_SECRET'),
    'default_email' => getenv('DEFAULT_EMAIL') ?: 'info@globalbuscharters.com',
    'rate_limit_max' => (int)(getenv('RATE_LIMIT_MAX') ?: 5),
    'rate_limit_window' => (int)(getenv('RATE_LIMIT_WINDOW') ?: 600),
];

// Per‑site email routing – Add your 25 websites here
$site_emails = [
    'www.globalbuscharters.com'      => 'info@globalbuscharters.com',
    
    // Add all your other domains...
];

// -------------------------------------------------------------------
// CORS headers – allow all your sites
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed_domains = array_keys($site_emails); // you can also keep a separate list
if (in_array(parse_url($origin, PHP_URL_HOST), $allowed_domains, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Access-Control-Allow-Credentials: true');
}
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// -------------------------------------------------------------------
// Parse input
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (stripos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
} else {
    $data = $_POST;
}

// -------------------------------------------------------------------
// Detect source website
$origin_url = $_SERVER['HTTP_ORIGIN'] ?? $_SERVER['HTTP_REFERER'] ?? '';
$website = parse_url($origin_url, PHP_URL_HOST) ?: 'direct';
$website = preg_replace('/^www\./', '', $website); // strip www

// -------------------------------------------------------------------
// Database connection
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'], $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    error_log("DB connection failed: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error. Please try again later.']);
    exit;
}

// -------------------------------------------------------------------
// Honeypot (silent fail)
if (!empty($data['website'])) {
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
    exit;
}

// -------------------------------------------------------------------
// Rate limiting
$ip = getClientIP();
$form_type = $data['form_type'] ?? 'contact'; // 'booking', 'contact', or 'quote'

// Clean expired entries
$pdo->exec("DELETE FROM rate_limits WHERE expires_at < NOW()");

$stmt = $pdo->prepare("SELECT id, attempt_count FROM rate_limits WHERE ip_address = ? AND form_type = ? AND expires_at > NOW() LIMIT 1");
$stmt->execute([$ip, $form_type]);
$rl = $stmt->fetch();

if (!$rl) {
    $pdo->prepare("INSERT INTO rate_limits (ip_address, form_type, attempt_count, window_start, expires_at) VALUES (?, ?, 1, NOW(), DATE_ADD(NOW(), INTERVAL ? SECOND))")
        ->execute([$ip, $form_type, $config['rate_limit_window']]);
} elseif ($rl['attempt_count'] >= $config['rate_limit_max']) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
    exit;
} else {
    $pdo->prepare("UPDATE rate_limits SET attempt_count = attempt_count + 1 WHERE id = ?")->execute([$rl['id']]);
}

// -------------------------------------------------------------------
// reCAPTCHA v3 verification
$recaptcha_token = $data['recaptcha_token'] ?? '';
if (empty($recaptcha_token)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Security verification failed. Please try again.']);
    exit;
}

$recaptcha_response = @file_get_contents('https://www.google.com/recaptcha/api/siteverify?' . http_build_query([
    'secret'   => $config['recaptcha'],
    'response' => $recaptcha_token,
    'remoteip' => $ip,
]));

$recaptcha_data = $recaptcha_response ? json_decode($recaptcha_response, true) : null;
if (!$recaptcha_data || !($recaptcha_data['success'] ?? false) || ($recaptcha_data['score'] ?? 0) < 0.5) {
    error_log("reCAPTCHA failed for $ip from $website. Score: " . ($recaptcha_data['score'] ?? 'N/A'));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Security verification failed. Please try again.']);
    exit;
}

// -------------------------------------------------------------------
// Process based on form_type
switch ($form_type) {
    case 'booking':
        // Booking form (from Booking.jsx)
        $name     = s($data['name'] ?? '');
        $email    = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone    = s($data['fullPhone'] ?? $data['phone'] ?? ''); // combined country+number
        $pickup   = s($data['pickupLocation'] ?? '');
        $dropoff  = s($data['dropoffLocation'] ?? '');
        $pickup_date = $data['pickupDate'] ?? '';
        $pickup_time = $data['pickupTime'] ?? '';
        $return_date = $data['returnDate'] ?? null;
        $return_time = $data['returnTime'] ?? null;
        $passengers   = isset($data['passengers']) ? (int)$data['passengers'] : null;
        $trip_type    = in_array($data['tripType'] ?? $data['trip_type'] ?? '', ['one-way','round-trip']) ? $data['tripType'] : 'one-way';
        $notes        = s($data['notes'] ?? '');
        $has_return   = ($trip_type === 'round-trip') ? 1 : 0;

        // Validation
        if (empty($name) || empty($email) || empty($phone) || empty($pickup) || empty($dropoff) || empty($pickup_date) || empty($pickup_time)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
            exit;
        }

        // Insert
        $stmt = $pdo->prepare("INSERT INTO form_submissions
            (website, form_type, full_name, email, phone, pickup_location, destination, service_type, passengers,
             travel_date, pickup_time, return_date, return_time, has_return, message, ip_address, user_agent, submission_date)
            VALUES (?, 'booking', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $website, $name, $email, $phone, $pickup, $dropoff, $trip_type, $passengers,
            $pickup_date, $pickup_time, $return_date, $return_time, $has_return, $notes,
            $ip, $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
        $submission_id = $pdo->lastInsertId();

        // Email content
        $subject = "New Booking Request - " . ucfirst(str_replace('-', ' ', $trip_type));
        $return_info = $has_return ? "
            <div class='field'><span class='field-label'>Return Date:</span> " . formatDate($return_date) . "</div>
            <div class='field'><span class='field-label'>Return Time:</span> $return_time</div>" : "";
        $email_body = emailTemplate("🚌 New Booking Request", $website, "
            <div class='field'><span class='field-label'>Name:</span> $name</div>
            <div class='field'><span class='field-label'>Email:</span> $email</div>
            <div class='field'><span class='field-label'>Phone:</span> $phone</div>
            <div class='field'><span class='field-label'>Trip Type:</span> " . ucfirst(str_replace('-', ' ', $trip_type)) . "</div>
            <div class='field'><span class='field-label'>Pickup:</span> $pickup</div>
            <div class='field'><span class='field-label'>Dropoff:</span> $dropoff</div>
            <div class='field'><span class='field-label'>Pickup Date:</span> " . formatDate($pickup_date) . "</div>
            <div class='field'><span class='field-label'>Pickup Time:</span> $pickup_time</div>
            $return_info
            <div class='field'><span class='field-label'>Passengers:</span> " . ($passengers ?: 'Not specified') . "</div>
            " . (!empty($notes) ? "<div class='field'><span class='field-label'>Notes:</span><br>$notes</div>" : "")
        );
        break;

    case 'contact':
        // Contact form (from Contact.jsx)
        $name    = s($data['name'] ?? '');
        $email   = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone   = s($data['fullPhone'] ?? $data['phone'] ?? '');
        $subject = s($data['subject'] ?? '');
        $message = s($data['message'] ?? '');

        // Validation
        if (empty($name) || empty($email) || empty($message)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
            exit;
        }
        if (strlen($message) < 10) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Message must be at least 10 characters.']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
            exit;
        }

        // Insert
        $stmt = $pdo->prepare("INSERT INTO form_submissions
            (website, form_type, full_name, email, phone, message, service_type, ip_address, user_agent, submission_date)
            VALUES (?, 'contact', ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $website, $name, $email, $phone, $message, $subject,
            $ip, $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
        $submission_id = $pdo->lastInsertId();

        // Email
        $email_subject = "New Contact Message" . (!empty($subject) ? ": $subject" : "");
        $email_body = emailTemplate("✉️ New Contact Message", $website, "
            <div class='field'><span class='field-label'>Name:</span> $name</div>
            <div class='field'><span class='field-label'>Email:</span> $email</div>
            <div class='field'><span class='field-label'>Phone:</span> " . (!empty($phone) ? $phone : 'Not provided') . "</div>
            <div class='field'><span class='field-label'>Subject:</span> " . (!empty($subject) ? $subject : 'No subject') . "</div>
            <div class='field'><span class='field-label'>Message:</span><br>" . nl2br($message) . "</div>"
        );
        break;

    default:
        // Legacy quote form (backward compatibility)
        $firstname = s($data['firstname'] ?? '');
        $lastname  = s($data['lastname'] ?? '');
        $full_name = trim("$firstname $lastname");
        $email     = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
        $phone     = s($data['phone'] ?? '');
        $country_code = s($data['country_code'] ?? $data['countryCode'] ?? '');
        $company   = s($data['company'] ?? '');
        $reason    = s($data['reason_for_travel'] ?? '');
        $pickup    = s($data['pickup'] ?? '');
        $destination = s($data['destination'] ?? '');
        $date      = $data['date'] ?? null;
        $time      = s($data['time'] ?? '');
        $returnDate = $data['returnDate'] ?? null;
        $returnTime = s($data['returnTime'] ?? '');
        $hasReturn = filter_var($data['hasReturnDate'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $passengers = $data['passengers'] ?? null;
        $message   = s($data['message'] ?? '');

        if (empty($firstname) || empty($lastname) || empty($email) || empty($phone)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All required fields must be filled']);
            exit;
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid email address']);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO form_submissions
            (website, form_type, full_name, first_name, last_name, email, phone, country_code, company,
             reason_for_travel, pickup_location, destination, passengers, travel_date, pickup_time,
             return_date, return_time, has_return, message, ip_address, user_agent, submission_date)
            VALUES (?, 'quote', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $website, $full_name, $firstname, $lastname, $email, $phone, $country_code, $company,
            $reason, $pickup, $destination, $passengers, $date, $time, $returnDate, $returnTime,
            $hasReturn ? 1 : 0, $message, $ip, $_SERVER['HTTP_USER_AGENT'] ?? ''
        ]);
        $submission_id = $pdo->lastInsertId();

        $formatted_phone = !empty($country_code) ? "+$country_code $phone" : $phone;
        $email_subject = "New Quote Request";
        $return_info = $hasReturn ? "
            <div class='field'><span class='field-label'>Return Date:</span> " . formatDate($returnDate) . "</div>
            <div class='field'><span class='field-label'>Return Time:</span> $returnTime</div>" : "";
        $email_body = emailTemplate("📋 New Quote Request", $website, "
            <div class='field'><span class='field-label'>Reason:</span> $reason</div>
            <div class='field'><span class='field-label'>Name:</span> $full_name</div>
            <div class='field'><span class='field-label'>Email:</span> $email</div>
            <div class='field'><span class='field-label'>Phone:</span> $formatted_phone</div>
            <div class='field'><span class='field-label'>Company:</span> $company</div>
            <div class='field'><span class='field-label'>Pickup:</span> $pickup</div>
            <div class='field'><span class='field-label'>Destination:</span> $destination</div>
            <div class='field'><span class='field-label'>Travel Date:</span> " . formatDate($date) . "</div>
            <div class='field'><span class='field-label'>Time:</span> $time</div>
            $return_info
            <div class='field'><span class='field-label'>Passengers:</span> $passengers</div>
            " . (!empty($message) ? "<div class='field'><span class='field-label'>Message:</span><br>" . nl2br($message) . "</div>" : "")
        );
        break;
}

// -------------------------------------------------------------------
// Send email
$to = $site_emails[$website] ?? $config['default_email'];
$headers = "From: " . (getenv('EMAIL_FROM') ?: $config['default_email']) . "\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$email_sent = @mail($to, $email_subject . " | " . $website, $email_body, $headers);
if (!$email_sent) {
    error_log("Email failed: to=$to, type=$form_type, site=$website, id=$submission_id");
}

// -------------------------------------------------------------------
// Response
$response_message = [
    'booking' => 'Your booking request has been submitted successfully!',
    'contact' => 'Your message has been sent successfully!',
    'quote'   => 'Thank you! Your submission has been received. We will get back to you soon.',
][$form_type] ?? 'Form submitted successfully.';

echo json_encode([
    'success' => true,
    'message' => $response_message,
    'id'      => $submission_id
]);

// -------------------------------------------------------------------
// Helper functions
function s(string $input): string {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

function formatDate(?string $date): string {
    if (empty($date)) return '';
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d ? $d->format('d/m/Y') : $date;
}

function getClientIP(): string {
    foreach (['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'] as $h) {
        if (!empty($_SERVER[$h])) {
            $ip = ($h === 'HTTP_X_FORWARDED_FOR') ? explode(',', $_SERVER[$h])[0] : $_SERVER[$h];
            if (filter_var(trim($ip), FILTER_VALIDATE_IP)) return trim($ip);
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

function emailTemplate(string $title, string $website, string $content): string {
    $date = date('d-m-Y H:i:s');
    return "
    <html><head><style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #1B2A4A; color: white; padding: 20px 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 5px 0 0; color: #8899bb; font-size: 13px; }
        .content { background: #f9f9f9; padding: 20px 30px; border: 1px solid #e0e0e0; border-top: none; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: bold; color: #1B2A4A; }
        .footer { background: #1B2A4A; padding: 12px 30px; border-radius: 0 0 8px 8px; text-align: center; }
        .footer p { color: #8899bb; margin: 0; font-size: 12px; }
    </style></head><body>
    <div class='container'>
        <div class='header'><h1>$title</h1><p>$website — $date</p></div>
        <div class='content'>$content</div>
        <div class='footer'><p>Source: $website</p></div>
    </div>
    </body></html>";
}
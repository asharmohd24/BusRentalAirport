# Motorix - Car Rental & Repair React Template

A modern, responsive React template for car rental and repair businesses. Built with security best practices and easy customization in mind.

## 🚀 Features

- **Fully Responsive Design** - Works on all devices
- **Google reCAPTCHA v3 Integration** - Spam protection with 0.7 score threshold
- **Security Measures** - XSS protection, CSRF tokens, rate limiting, honeypot fields
- **Centralized Data Configuration** - All content managed from `data.js`
- **Environment Variables** - Sensitive keys stored in `.env`
- **Modern React Patterns** - Custom hooks, lazy loading, code splitting
- **Component-Based Architecture** - Reusable, maintainable code

## 📦 Installation

```bash
# Clone or download the project
cd motorix-react

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Add your reCAPTCHA keys to .env
# VITE_RECAPTCHA_SITE_KEY=your_site_key_here

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Configuration

### Site Data (`src/data/data.js`)

All configurable content is centralized in `data.js`:

```javascript
export const siteData = {
  siteName: "Your Company Name",
  contact: {
    phone: "+1 (555) 789-1234",
    email: "hello@example.com",
    address: {
      full: "123 Main Street, City, State, ZIP",
    },
  },
  social: {
    facebook: "https://facebook.com/yourcompany",
    instagram: "https://instagram.com/yourcompany",
  },
  // ... services, testimonials, cars, blog posts, etc.
};
```

### Environment Variables (`.env`)

```env
# Google reCAPTCHA v3 Keys
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
VITE_RECAPTCHA_SECRET_KEY=your_secret_key_here

# API Endpoints
VITE_API_URL=https://your-api-url.com
VITE_CONTACT_FORM_ENDPOINT=/api/contact
```

### Getting reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Register a new site with reCAPTCHA v3
3. Copy the Site Key and Secret Key
4. Add them to your `.env` file

## 🔒 Security Features

### 1. reCAPTCHA v3 Protection
- Score threshold of 0.7 (adjustable)
- Invisible verification
- Server-side validation recommended

### 2. Input Sanitization
- XSS prevention with DOMPurify
- HTML and script injection protection
- Safe form data handling

### 3. Rate Limiting
- 5 attempts per minute per client
- Prevents spam and abuse

### 4. Honeypot Fields
- Hidden fields to catch bots
- No CAPTCHA visible to users

### 5. CSRF Protection
- Token generation and validation
- Session-based security

### 6. Spam Pattern Detection
- Common spam keyword filtering
- Multiple URL detection

## 📁 Project Structure

```
motorix-react/
├── src/
│   ├── assets/css/app.css       # Main stylesheet
│   ├── components/
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Footer.jsx           # Site footer
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── ContactForm.jsx      # Contact form with reCAPTCHA
│   │   └── ...
│   ├── data/data.js             # All site content
│   ├── hooks/useForm.js         # Form handling hook
│   ├── pages/                   # Page components
│   ├── utils/security.js        # Security utilities
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── .env.example                 # Environment template
└── package.json
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `src/assets/css/app.css`:

```css
:root {
  --color-primary: #F59E0B;    /* Orange */
  --color-secondary: #1E293B;  /* Dark blue */
}
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in `data.js`

## 📄 License

This template is provided for commercial and personal use.

---

Built with React + Vite

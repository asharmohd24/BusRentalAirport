import { useState, useEffect, useRef } from 'react';
import { siteData } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';
import { getRecaptchaToken } from '../utils/recaptcha';

// Complete country list
const countries = [
  { code: 'AF', dial: '+93', name: 'Afghanistan' },
  { code: 'AX', dial: '+358', name: 'Åland Islands' },
  { code: 'AL', dial: '+355', name: 'Albania' },
  { code: 'DZ', dial: '+213', name: 'Algeria' },
  { code: 'AS', dial: '+1-684', name: 'American Samoa' },
  { code: 'AD', dial: '+376', name: 'Andorra' },
  { code: 'AO', dial: '+244', name: 'Angola' },
  { code: 'AI', dial: '+1-264', name: 'Anguilla' },
  { code: 'AQ', dial: '+672', name: 'Antarctica' },
  { code: 'AG', dial: '+1-268', name: 'Antigua and Barbuda' },
  { code: 'AR', dial: '+54', name: 'Argentina' },
  { code: 'AM', dial: '+374', name: 'Armenia' },
  { code: 'AW', dial: '+297', name: 'Aruba' },
  { code: 'AU', dial: '+61', name: 'Australia' },
  { code: 'AT', dial: '+43', name: 'Austria' },
  { code: 'AZ', dial: '+994', name: 'Azerbaijan' },
  { code: 'BS', dial: '+1-242', name: 'Bahamas' },
  { code: 'BH', dial: '+973', name: 'Bahrain' },
  { code: 'BD', dial: '+880', name: 'Bangladesh' },
  { code: 'BB', dial: '+1-246', name: 'Barbados' },
  { code: 'BY', dial: '+375', name: 'Belarus' },
  { code: 'BE', dial: '+32', name: 'Belgium' },
  { code: 'BZ', dial: '+501', name: 'Belize' },
  { code: 'BJ', dial: '+229', name: 'Benin' },
  { code: 'BM', dial: '+1-441', name: 'Bermuda' },
  { code: 'BT', dial: '+975', name: 'Bhutan' },
  { code: 'BO', dial: '+591', name: 'Bolivia' },
  { code: 'BQ', dial: '+599', name: 'Bonaire, Sint Eustatius and Saba' },
  { code: 'BA', dial: '+387', name: 'Bosnia and Herzegovina' },
  { code: 'BW', dial: '+267', name: 'Botswana' },
  { code: 'BV', dial: '+55', name: 'Bouvet Island' },
  { code: 'BR', dial: '+55', name: 'Brazil' },
  { code: 'IO', dial: '+246', name: 'British Indian Ocean Territory' },
  { code: 'BN', dial: '+673', name: 'Brunei Darussalam' },
  { code: 'BG', dial: '+359', name: 'Bulgaria' },
  { code: 'BF', dial: '+226', name: 'Burkina Faso' },
  { code: 'BI', dial: '+257', name: 'Burundi' },
  { code: 'CV', dial: '+238', name: 'Cabo Verde' },
  { code: 'KH', dial: '+855', name: 'Cambodia' },
  { code: 'CM', dial: '+237', name: 'Cameroon' },
  { code: 'CA', dial: '+1', name: 'Canada' },
  { code: 'KY', dial: '+1-345', name: 'Cayman Islands' },
  { code: 'CF', dial: '+236', name: 'Central African Republic' },
  { code: 'TD', dial: '+235', name: 'Chad' },
  { code: 'CL', dial: '+56', name: 'Chile' },
  { code: 'CN', dial: '+86', name: 'China' },
  { code: 'CX', dial: '+61', name: 'Christmas Island' },
  { code: 'CC', dial: '+61', name: 'Cocos (Keeling) Islands' },
  { code: 'CO', dial: '+57', name: 'Colombia' },
  { code: 'KM', dial: '+269', name: 'Comoros' },
  { code: 'CD', dial: '+243', name: 'Congo, Democratic Republic of the' },
  { code: 'CG', dial: '+242', name: 'Congo, Republic of the' },
  { code: 'CK', dial: '+682', name: 'Cook Islands' },
  { code: 'CR', dial: '+506', name: 'Costa Rica' },
  { code: 'CI', dial: '+225', name: "Côte d'Ivoire" },
  { code: 'HR', dial: '+385', name: 'Croatia' },
  { code: 'CU', dial: '+53', name: 'Cuba' },
  { code: 'CW', dial: '+599', name: 'Curaçao' },
  { code: 'CY', dial: '+357', name: 'Cyprus' },
  { code: 'CZ', dial: '+420', name: 'Czech Republic' },
  { code: 'DK', dial: '+45', name: 'Denmark' },
  { code: 'DJ', dial: '+253', name: 'Djibouti' },
  { code: 'DM', dial: '+1-767', name: 'Dominica' },
  { code: 'DO', dial: '+1-809', name: 'Dominican Republic' },
  { code: 'EC', dial: '+593', name: 'Ecuador' },
  { code: 'EG', dial: '+20', name: 'Egypt' },
  { code: 'SV', dial: '+503', name: 'El Salvador' },
  { code: 'GQ', dial: '+240', name: 'Equatorial Guinea' },
  { code: 'ER', dial: '+291', name: 'Eritrea' },
  { code: 'EE', dial: '+372', name: 'Estonia' },
  { code: 'SZ', dial: '+268', name: 'Eswatini' },
  { code: 'ET', dial: '+251', name: 'Ethiopia' },
  { code: 'FK', dial: '+500', name: 'Falkland Islands (Malvinas)' },
  { code: 'FO', dial: '+298', name: 'Faroe Islands' },
  { code: 'FJ', dial: '+679', name: 'Fiji' },
  { code: 'FI', dial: '+358', name: 'Finland' },
  { code: 'FR', dial: '+33', name: 'France' },
  { code: 'GF', dial: '+594', name: 'French Guiana' },
  { code: 'PF', dial: '+689', name: 'French Polynesia' },
  { code: 'TF', dial: '+262', name: 'French Southern Territories' },
  { code: 'GA', dial: '+241', name: 'Gabon' },
  { code: 'GM', dial: '+220', name: 'Gambia' },
  { code: 'GE', dial: '+995', name: 'Georgia' },
  { code: 'DE', dial: '+49', name: 'Germany' },
  { code: 'GH', dial: '+233', name: 'Ghana' },
  { code: 'GI', dial: '+350', name: 'Gibraltar' },
  { code: 'GR', dial: '+30', name: 'Greece' },
  { code: 'GL', dial: '+299', name: 'Greenland' },
  { code: 'GD', dial: '+1-473', name: 'Grenada' },
  { code: 'GP', dial: '+590', name: 'Guadeloupe' },
  { code: 'GU', dial: '+1-671', name: 'Guam' },
  { code: 'GT', dial: '+502', name: 'Guatemala' },
  { code: 'GG', dial: '+44', name: 'Guernsey' },
  { code: 'GN', dial: '+224', name: 'Guinea' },
  { code: 'GW', dial: '+245', name: 'Guinea-Bissau' },
  { code: 'GY', dial: '+592', name: 'Guyana' },
  { code: 'HT', dial: '+509', name: 'Haiti' },
  { code: 'HM', dial: '+672', name: 'Heard Island and McDonald Islands' },
  { code: 'VA', dial: '+379', name: 'Holy See (Vatican City State)' },
  { code: 'HN', dial: '+504', name: 'Honduras' },
  { code: 'HK', dial: '+852', name: 'Hong Kong' },
  { code: 'HU', dial: '+36', name: 'Hungary' },
  { code: 'IS', dial: '+354', name: 'Iceland' },
  { code: 'IN', dial: '+91', name: 'India' },
  { code: 'ID', dial: '+62', name: 'Indonesia' },
  { code: 'IR', dial: '+98', name: 'Iran, Islamic Republic of' },
  { code: 'IQ', dial: '+964', name: 'Iraq' },
  { code: 'IE', dial: '+353', name: 'Ireland' },
  { code: 'IM', dial: '+44', name: 'Isle of Man' },
  { code: 'IL', dial: '+972', name: 'Israel' },
  { code: 'IT', dial: '+39', name: 'Italy' },
  { code: 'JM', dial: '+1-876', name: 'Jamaica' },
  { code: 'JP', dial: '+81', name: 'Japan' },
  { code: 'JE', dial: '+44', name: 'Jersey' },
  { code: 'JO', dial: '+962', name: 'Jordan' },
  { code: 'KZ', dial: '+7', name: 'Kazakhstan' },
  { code: 'KE', dial: '+254', name: 'Kenya' },
  { code: 'KI', dial: '+686', name: 'Kiribati' },
  { code: 'KP', dial: '+850', name: "Korea, Democratic People's Republic of" },
  { code: 'KR', dial: '+82', name: 'Korea, Republic of' },
  { code: 'KW', dial: '+965', name: 'Kuwait' },
  { code: 'KG', dial: '+996', name: 'Kyrgyzstan' },
  { code: 'LA', dial: '+856', name: "Lao People's Democratic Republic" },
  { code: 'LV', dial: '+371', name: 'Latvia' },
  { code: 'LB', dial: '+961', name: 'Lebanon' },
  { code: 'LS', dial: '+266', name: 'Lesotho' },
  { code: 'LR', dial: '+231', name: 'Liberia' },
  { code: 'LY', dial: '+218', name: 'Libya' },
  { code: 'LI', dial: '+423', name: 'Liechtenstein' },
  { code: 'LT', dial: '+370', name: 'Lithuania' },
  { code: 'LU', dial: '+352', name: 'Luxembourg' },
  { code: 'MO', dial: '+853', name: 'Macao' },
  { code: 'MG', dial: '+261', name: 'Madagascar' },
  { code: 'MW', dial: '+265', name: 'Malawi' },
  { code: 'MY', dial: '+60', name: 'Malaysia' },
  { code: 'MV', dial: '+960', name: 'Maldives' },
  { code: 'ML', dial: '+223', name: 'Mali' },
  { code: 'MT', dial: '+356', name: 'Malta' },
  { code: 'MH', dial: '+692', name: 'Marshall Islands' },
  { code: 'MQ', dial: '+596', name: 'Martinique' },
  { code: 'MR', dial: '+222', name: 'Mauritania' },
  { code: 'MU', dial: '+230', name: 'Mauritius' },
  { code: 'YT', dial: '+262', name: 'Mayotte' },
  { code: 'MX', dial: '+52', name: 'Mexico' },
  { code: 'FM', dial: '+691', name: 'Micronesia, Federated States of' },
  { code: 'MD', dial: '+373', name: 'Moldova, Republic of' },
  { code: 'MC', dial: '+377', name: 'Monaco' },
  { code: 'MN', dial: '+976', name: 'Mongolia' },
  { code: 'ME', dial: '+382', name: 'Montenegro' },
  { code: 'MS', dial: '+1-664', name: 'Montserrat' },
  { code: 'MA', dial: '+212', name: 'Morocco' },
  { code: 'MZ', dial: '+258', name: 'Mozambique' },
  { code: 'MM', dial: '+95', name: 'Myanmar' },
  { code: 'NA', dial: '+264', name: 'Namibia' },
  { code: 'NR', dial: '+674', name: 'Nauru' },
  { code: 'NP', dial: '+977', name: 'Nepal' },
  { code: 'NL', dial: '+31', name: 'Netherlands' },
  { code: 'NC', dial: '+687', name: 'New Caledonia' },
  { code: 'NZ', dial: '+64', name: 'New Zealand' },
  { code: 'NI', dial: '+505', name: 'Nicaragua' },
  { code: 'NE', dial: '+227', name: 'Niger' },
  { code: 'NG', dial: '+234', name: 'Nigeria' },
  { code: 'NU', dial: '+683', name: 'Niue' },
  { code: 'NF', dial: '+672', name: 'Norfolk Island' },
  { code: 'MK', dial: '+389', name: 'North Macedonia' },
  { code: 'MP', dial: '+1-670', name: 'Northern Mariana Islands' },
  { code: 'NO', dial: '+47', name: 'Norway' },
  { code: 'OM', dial: '+968', name: 'Oman' },
  { code: 'PK', dial: '+92', name: 'Pakistan' },
  { code: 'PW', dial: '+680', name: 'Palau' },
  { code: 'PS', dial: '+970', name: 'Palestine, State of' },
  { code: 'PA', dial: '+507', name: 'Panama' },
  { code: 'PG', dial: '+675', name: 'Papua New Guinea' },
  { code: 'PY', dial: '+595', name: 'Paraguay' },
  { code: 'PE', dial: '+51', name: 'Peru' },
  { code: 'PH', dial: '+63', name: 'Philippines' },
  { code: 'PN', dial: '+64', name: 'Pitcairn' },
  { code: 'PL', dial: '+48', name: 'Poland' },
  { code: 'PT', dial: '+351', name: 'Portugal' },
  { code: 'PR', dial: '+1-787', name: 'Puerto Rico' },
  { code: 'QA', dial: '+974', name: 'Qatar' },
  { code: 'RE', dial: '+262', name: 'Réunion' },
  { code: 'RO', dial: '+40', name: 'Romania' },
  { code: 'RU', dial: '+7', name: 'Russian Federation' },
  { code: 'RW', dial: '+250', name: 'Rwanda' },
  { code: 'BL', dial: '+590', name: 'Saint Barthélemy' },
  { code: 'SH', dial: '+290', name: 'Saint Helena, Ascension and Tristan da Cunha' },
  { code: 'KN', dial: '+1-869', name: 'Saint Kitts and Nevis' },
  { code: 'LC', dial: '+1-758', name: 'Saint Lucia' },
  { code: 'MF', dial: '+590', name: 'Saint Martin (French part)' },
  { code: 'PM', dial: '+508', name: 'Saint Pierre and Miquelon' },
  { code: 'VC', dial: '+1-784', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', dial: '+685', name: 'Samoa' },
  { code: 'SM', dial: '+378', name: 'San Marino' },
  { code: 'ST', dial: '+239', name: 'Sao Tome and Principe' },
  { code: 'SA', dial: '+966', name: 'Saudi Arabia' },
  { code: 'SN', dial: '+221', name: 'Senegal' },
  { code: 'RS', dial: '+381', name: 'Serbia' },
  { code: 'SC', dial: '+248', name: 'Seychelles' },
  { code: 'SL', dial: '+232', name: 'Sierra Leone' },
  { code: 'SG', dial: '+65', name: 'Singapore' },
  { code: 'SX', dial: '+1-721', name: 'Sint Maarten (Dutch part)' },
  { code: 'SK', dial: '+421', name: 'Slovakia' },
  { code: 'SI', dial: '+386', name: 'Slovenia' },
  { code: 'SB', dial: '+677', name: 'Solomon Islands' },
  { code: 'SO', dial: '+252', name: 'Somalia' },
  { code: 'ZA', dial: '+27', name: 'South Africa' },
  { code: 'GS', dial: '+500', name: 'South Georgia and the South Sandwich Islands' },
  { code: 'SS', dial: '+211', name: 'South Sudan' },
  { code: 'ES', dial: '+34', name: 'Spain' },
  { code: 'LK', dial: '+94', name: 'Sri Lanka' },
  { code: 'SD', dial: '+249', name: 'Sudan' },
  { code: 'SR', dial: '+597', name: 'Suriname' },
  { code: 'SJ', dial: '+47', name: 'Svalbard and Jan Mayen' },
  { code: 'SE', dial: '+46', name: 'Sweden' },
  { code: 'CH', dial: '+41', name: 'Switzerland' },
  { code: 'SY', dial: '+963', name: 'Syrian Arab Republic' },
  { code: 'TW', dial: '+886', name: 'Taiwan, Province of China' },
  { code: 'TJ', dial: '+992', name: 'Tajikistan' },
  { code: 'TZ', dial: '+255', name: 'Tanzania, United Republic of' },
  { code: 'TH', dial: '+66', name: 'Thailand' },
  { code: 'TL', dial: '+670', name: 'Timor-Leste' },
  { code: 'TG', dial: '+228', name: 'Togo' },
  { code: 'TK', dial: '+690', name: 'Tokelau' },
  { code: 'TO', dial: '+676', name: 'Tonga' },
  { code: 'TT', dial: '+1-868', name: 'Trinidad and Tobago' },
  { code: 'TN', dial: '+216', name: 'Tunisia' },
  { code: 'TR', dial: '+90', name: 'Turkey' },
  { code: 'TM', dial: '+993', name: 'Turkmenistan' },
  { code: 'TC', dial: '+1-649', name: 'Turks and Caicos Islands' },
  { code: 'TV', dial: '+688', name: 'Tuvalu' },
  { code: 'UG', dial: '+256', name: 'Uganda' },
  { code: 'UA', dial: '+380', name: 'Ukraine' },
  { code: 'AE', dial: '+971', name: 'United Arab Emirates' },
  { code: 'GB', dial: '+44', name: 'United Kingdom' },
  { code: 'US', dial: '+1', name: 'United States' },
  { code: 'UM', dial: '+1', name: 'United States Minor Outlying Islands' },
  { code: 'UY', dial: '+598', name: 'Uruguay' },
  { code: 'UZ', dial: '+998', name: 'Uzbekistan' },
  { code: 'VU', dial: '+678', name: 'Vanuatu' },
  { code: 'VE', dial: '+58', name: 'Venezuela, Bolivarian Republic of' },
  { code: 'VN', dial: '+84', name: 'Viet Nam' },
  { code: 'VG', dial: '+1-284', name: 'Virgin Islands, British' },
  { code: 'VI', dial: '+1-340', name: 'Virgin Islands, U.S.' },
  { code: 'WF', dial: '+681', name: 'Wallis and Futuna' },
  { code: 'EH', dial: '+212', name: 'Western Sahara' },
  { code: 'YE', dial: '+967', name: 'Yemen' },
  { code: 'ZM', dial: '+260', name: 'Zambia' },
  { code: 'ZW', dial: '+263', name: 'Zimbabwe' }
];

// Searchable country code dropdown component
const CountryCodeSelect = ({ value, onChange, searchPlaceholder = 'Search country...', noCountriesText = 'No countries found' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = countries.find(c => c.code === value) || countries[0];

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.dial.includes(search) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="country-code-select" ref={dropdownRef} style={{ position: 'relative' }}>
      <div
        className="form-control country-select-trigger"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          paddingRight: '30px',
          background: 'var(--color-white)'
        }}
      >
        <span>
          <span style={{ marginRight: '8px' }}>{selectedCountry.dial}</span>
          <span style={{ color: 'var(--color-text-light)' }}>{selectedCountry.code}</span>
        </span>
        <i className="fa fa-chevron-down" style={{ fontSize: '12px', color: 'var(--color-text-light)' }} />
      </div>

      {isOpen && (
        <div
          className="country-dropdown"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
            marginTop: '4px',
            maxHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: '200px',
            width: 'auto'
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid var(--color-gray)' }}>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ padding: '8px 12px', fontSize: '14px' }}
              autoFocus
            />
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '250px' }}>
            {filteredCountries.map(country => (
              <div
                key={country.code}
                className={`country-option ${value === country.code ? 'active' : ''}`}
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                  setSearch('');
                }}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: value === country.code ? 'var(--color-light)' : 'transparent',
                  borderBottom: '1px solid var(--color-gray)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = value === country.code ? 'var(--color-light)' : 'transparent'}
              >
                <span>
                  <span style={{ marginRight: '8px' }}>{country.name}</span>
                  <span style={{ color: 'var(--color-text-light)' }}>{country.code}</span>
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{country.dial}</span>
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div style={{ padding: '12px', textAlign: 'center', color: 'var(--color-text-light)' }}>
                {noCountriesText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Booking = () => {
  const { seo, bannerTitle, formHeader, tabs, fields, submitText, submittingText, configErrorText, countrySearchPlaceholder, noCountriesText } = siteData.pages.booking;
  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
  const [activeTab, setActiveTab] = useState('one-way');
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    passengers: '',
    name: '',
    email: '',
    phoneCountry: 'US',
    phoneNumber: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState('US');
  const [countryDetected, setCountryDetected] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const autocompletePickup = useRef(null);
  const autocompleteDropoff = useRef(null);

  const today = new Date().toISOString().split('T')[0];

  // Detect user's country
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.country_code) {
          setDetectedCountry(data.country_code);
          setFormData(prev => ({ ...prev, phoneCountry: data.country_code }));
          setCountryDetected(true);
          return;
        }
      } catch (error) {
        console.log('ipapi failed, using fallback');
      }

      const lang = navigator.language || navigator.userLanguage;
      if (lang) {
        const parts = lang.split('-');
        if (parts.length > 1) {
          const countryCode = parts[1].toUpperCase();
          if (countries.some(c => c.code === countryCode)) {
            setDetectedCountry(countryCode);
            setFormData(prev => ({ ...prev, phoneCountry: countryCode }));
            setCountryDetected(true);
            return;
          }
        }
      }
      setDetectedCountry('US');
      setFormData(prev => ({ ...prev, phoneCountry: 'US' }));
      setCountryDetected(true);
    };

    detectCountry();
  }, []);

  // Load Google Maps and setup autocomplete
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is missing.');
      setApiKeyMissing(true);
      return;
    }

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initAutocomplete;
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setApiKeyMissing(true);
      };
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }

    function initAutocomplete() {
      const options = {
        types: ['geocode'],
        fields: ['formatted_address', 'geometry', 'name']
      };

      if (pickupRef.current && !autocompletePickup.current) {
        autocompletePickup.current = new window.google.maps.places.Autocomplete(pickupRef.current, options);
        autocompletePickup.current.addListener('place_changed', () => {
          const place = autocompletePickup.current.getPlace();
          if (place.formatted_address) {
            setFormData(prev => ({ ...prev, pickupLocation: place.formatted_address }));
          }
        });
      }

      if (dropoffRef.current && !autocompleteDropoff.current) {
        autocompleteDropoff.current = new window.google.maps.places.Autocomplete(dropoffRef.current, options);
        autocompleteDropoff.current.addListener('place_changed', () => {
          const place = autocompleteDropoff.current.getPlace();
          if (place.formatted_address) {
            setFormData(prev => ({ ...prev, dropoffLocation: place.formatted_address }));
          }
        });
      }
    }

    return () => {
      document.querySelectorAll('.pac-container').forEach(el => el.remove());

      if (autocompletePickup.current) {
        window.google.maps.event.clearInstanceListeners(autocompletePickup.current);
        autocompletePickup.current = null;
      }
      if (autocompleteDropoff.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteDropoff.current);
        autocompleteDropoff.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (formData.pickupDate && formData.returnDate && formData.returnDate < formData.pickupDate) {
      setFormData(prev => ({ ...prev, returnDate: '' }));
    }
  }, [formData.pickupDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pickupDate') {
      if (value && value < today) {
        setFormData(prev => ({ ...prev, pickupDate: today }));
        return;
      }
    }
    if (name === 'returnDate') {
      if (value && formData.pickupDate && value < formData.pickupDate) {
        setFormData(prev => ({ ...prev, returnDate: '' }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneNumberChange = (e) => {
    setFormData(prev => ({ ...prev, phoneNumber: e.target.value }));
  };

  const handleCountryChange = (code) => {
    setFormData(prev => ({ ...prev, phoneCountry: code }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    let token = '';
    try {
      token = await getRecaptchaToken('booking_form');
    } catch (error) {
      setSubmitStatus({ success: false, message: 'reCAPTCHA verification failed. Please refresh and try again.' });
      setIsSubmitting(false);
      return;
    }

    const selectedCountry = countries.find(c => c.code === formData.phoneCountry) || countries[0];
    const fullPhone = `${selectedCountry.dial} ${formData.phoneNumber}`;

    const payload = {
      form_type: 'booking',
      recaptcha_token: token,
      name: formData.name,
      email: formData.email,
      fullPhone,
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      returnDate: formData.returnDate,
      returnTime: formData.returnTime,
      passengers: formData.passengers,
      tripType: activeTab,
      notes: formData.notes,
      website: '', // honeypot
    };

    try {
      const response = await fetch(import.meta.env.VITE_FORM_HANDLER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      setSubmitStatus(result);
      if (result.success) {
        // Reset form
        setFormData({
          pickupLocation: '',
          dropoffLocation: '',
          pickupDate: '',
          pickupTime: '',
          returnDate: '',
          returnTime: '',
          passengers: '',
          name: '',
          email: '',
          phoneCountry: formData.phoneCountry,
          phoneNumber: '',
          notes: '',
        });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBanner title={bannerTitle} />

      <section className="booking-form-section pt-60 pb-60">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="booking-form-wrapper">
                <div className="booking-form-header">
                  <h3>{formHeader.title}</h3>
                  <p>{formHeader.subtitle}</p>
                </div>

                {apiKeyMissing && import.meta.env.DEV && (
                  <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    <strong>{configErrorText}</strong>
                  </div>
                )}

                <div className="booking-tabs">
                  <button
                    type="button"
                    className={`booking-tab ${activeTab === 'one-way' ? 'active' : ''}`}
                    onClick={() => setActiveTab('one-way')}
                  >
                    {tabs.oneWay}
                  </button>
                  <button
                    type="button"
                    className={`booking-tab ${activeTab === 'round-trip' ? 'active' : ''}`}
                    onClick={() => setActiveTab('round-trip')}
                  >
                    {tabs.roundTrip}
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="booking-form-grid">
                    {/* Pickup Location */}
                    <div className="form-group">
                      <label>{fields.pickupLocation.label}</label>
                      <div className="input-icon"><i className="fa fa-map-marker-alt"></i></div>
                      <input
                        type="text"
                        name="pickupLocation"
                        ref={pickupRef}
                        className="form-control"
                        placeholder={fields.pickupLocation.placeholder}
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </div>

                    {/* Dropoff Location */}
                    <div className="form-group">
                      <label>{fields.dropoffLocation.label}</label>
                      <div className="input-icon"><i className="fa fa-map-marker"></i></div>
                      <input
                        type="text"
                        name="dropoffLocation"
                        ref={dropoffRef}
                        className="form-control"
                        placeholder={fields.dropoffLocation.placeholder}
                        value={formData.dropoffLocation}
                        onChange={handleChange}
                        required
                        autoComplete="off"
                      />
                    </div>

                    {/* Pickup Date */}
                    <div className="form-group">
                      <label>{fields.pickupDate.label}</label>
                      <div className="date-time-wrapper">
                        <input
                          type="date"
                          name="pickupDate"
                          className="form-control"
                          value={formData.pickupDate}
                          onChange={handleChange}
                          min={today}
                          required
                        />
                        <span className="date-time-icon">
                          <i className="fa fa-calendar"></i>
                        </span>
                      </div>
                    </div>

                    {/* Pickup Time */}
                    <div className="form-group">
                      <label>{fields.pickupTime.label}</label>
                      <div className="date-time-wrapper">
                        <input
                          type="time"
                          name="pickupTime"
                          className="form-control"
                          value={formData.pickupTime}
                          onChange={handleChange}
                          required
                        />
                        <span className="date-time-icon">
                          <i className="fa fa-clock"></i>
                        </span>
                      </div>
                    </div>

                    {/* Return fields for round trip */}
                    {activeTab === 'round-trip' && (
                      <>
                        <div className="form-group">
                          <label>{fields.returnDate.label}</label>
                          <div className="date-time-wrapper">
                            <input
                              type="date"
                              name="returnDate"
                              className="form-control"
                              value={formData.returnDate}
                              onChange={handleChange}
                              min={formData.pickupDate || today}
                              required
                            />
                            <span className="date-time-icon">
                              <i className="fa fa-calendar"></i>
                            </span>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>{fields.returnTime.label}</label>
                          <div className="date-time-wrapper">
                            <input
                              type="time"
                              name="returnTime"
                              className="form-control"
                              value={formData.returnTime}
                              onChange={handleChange}
                              required
                            />
                            <span className="date-time-icon">
                              <i className="fa fa-clock"></i>
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Passengers */}
                    <div className="form-group full-width">
                      <label>{fields.passengers.label}</label>
                      <input
                        type="number"
                        name="passengers"
                        className="form-control"
                        placeholder={fields.passengers.placeholder}
                        value={formData.passengers}
                        onChange={handleChange}
                        min="1"
                      />
                    </div>

                    {/* Name */}
                    <div className="form-group">
                      <label>{fields.name.label}</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder={fields.name.placeholder}
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label>{fields.email.label}</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder={fields.email.placeholder}
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* Phone with country code dropdown */}
                    <div className="form-group full-width">
                      <label>{fields.phone.label}</label>
                      <div className="phone-input-row">
                        <div className="country-select-wrapper">
                          <CountryCodeSelect
                            value={formData.phoneCountry}
                            onChange={handleCountryChange}
                            searchPlaceholder={countrySearchPlaceholder}
                            noCountriesText={noCountriesText}
                          />
                        </div>
                        <div className="phone-number-wrapper">
                          <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="Phone number"
                            value={formData.phoneNumber}
                            onChange={handlePhoneNumberChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Special requests */}
                    <div className="form-group full-width">
                      <label>{fields.notes.label}</label>
                      <textarea
                        name="notes"
                        className="form-control"
                        placeholder={fields.notes.placeholder}
                        value={formData.notes}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>

                    {/* Submit button */}
                    <div className="full-width">
                      <button
                        type="submit"
                        className="cus-btn booking-submit-btn"
                        disabled={isSubmitting}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/>
                          <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/>
                          <path d="M4 12v5a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h10v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-5"/>
                          <circle cx="7.5" cy="18.5" r="1.5"/><circle cx="16.5" cy="18.5" r="1.5"/>
                        </svg>
                        {isSubmitting ? submittingText : submitText}
                      </button>
                    </div>
                  </div>

                  {submitStatus && (
                    <div className={`alert ${submitStatus.success ? 'alert-success' : 'alert-danger'}`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Booking;
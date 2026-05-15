/**
 * ServiceCard Component
 * ======================
 * Reusable service card for displaying services
 */

import { Link } from 'react-router-dom';

const ServiceCard = ({ service, variant = 'default' }) => {
  const { icon, title, description, link } = service;

  // Icon mapping for different service types
  const renderIcon = () => {
    switch (icon) {
      case 'car-rental':
        return (
          <svg className="carsvg" xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
            <g clipPath="url(#clip-rental)">
              <path d="M39.6666 41.6667H11.3333C10.4128 41.6667 9.66663 40.9205 9.66663 40.0001V35.8334H9.66663V29.1667C9.66663 28.7065 10.0397 28.3334 10.5 28.3334H40.5C40.9602 28.3334 41.3333 28.7065 41.3333 29.1667V35.8334V40.0001C41.3333 40.9205 40.5871 41.6667 39.6666 41.6667Z" fill="#1E293B"/>
              <path d="M15.5 37.5001C16.6506 37.5001 17.5833 36.5673 17.5833 35.4167C17.5833 34.2661 16.6506 33.3334 15.5 33.3334C14.3494 33.3334 13.4166 34.2661 13.4166 35.4167C13.4166 36.5673 14.3494 37.5001 15.5 37.5001Z" fill="#F59E0B"/>
              <path d="M35.5 37.5001C36.6506 37.5001 37.5833 36.5673 37.5833 35.4167C37.5833 34.2661 36.6506 33.3334 35.5 33.3334C34.3494 33.3334 33.4166 34.2661 33.4166 35.4167C33.4166 36.5673 34.3494 37.5001 35.5 37.5001Z" fill="#F59E0B"/>
              <path d="M41.3333 25.8334V25.0001C41.3333 24.0796 40.5871 23.3334 39.6666 23.3334H11.3333C10.4128 23.3334 9.66663 24.0796 9.66663 25.0001V25.8334H41.3333Z" fill="#1E293B"/>
              <path d="M12.1666 9.99999H13.8333C14.7538 9.99999 15.5 9.2538 15.5 8.33331V4.99994C15.5 4.07945 14.7538 3.33325 13.8333 3.33325H12.1666C11.2461 3.33325 10.4999 4.07945 10.4999 4.99994V8.33331C10.5 9.2538 11.2462 9.99999 12.1666 9.99999ZM12.1666 4.99994H13.8333V8.33331H12.1666V4.99994Z" fill="#F59E0B"/>
            </g>
            <defs>
              <clipPath id="clip-rental">
                <rect width="50" height="50" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'car-repair':
        return (
          <svg className="carsvg" xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
            <g clipPath="url(#clip-repair)">
              <path d="M34.5408 31.6666H16.4575C15.7031 31.6659 15.0292 32.1382 14.7725 32.8476C14.5158 33.557 14.7314 34.3512 15.3116 34.8333L18.0125 37.0833C18.3344 37.3524 18.7404 37.4998 19.16 37.5H31.8383C32.2576 37.4999 32.6634 37.3524 32.985 37.0833L35.6867 34.8333C36.2668 34.3512 36.4825 33.557 36.2258 32.8476C35.969 32.1382 35.2952 31.6659 34.5408 31.6666Z" fill="#1E293B"/>
              <path d="M40.5241 32.0834L37.8141 34.3334C37.2318 34.8146 37.0148 35.6099 37.2718 36.3202C37.5289 37.0305 38.2045 37.5027 38.9599 37.5H45.4999C46.4204 37.5 47.1666 36.7538 47.1666 35.8333V33.3333C47.1666 32.4128 46.4204 31.6666 45.4999 31.6666H41.6707C41.2517 31.6679 40.8462 31.8152 40.5241 32.0834Z" fill="#1E293B"/>
              <path d="M10.4759 32.0834C10.1551 31.8159 9.75107 31.6686 9.33335 31.6667H5.5C4.57951 31.6667 3.83331 32.4129 3.83331 33.3334V35.8334C3.83331 36.7539 4.57951 37.5001 5.5 37.5001H12.0383C12.7934 37.5022 13.4684 37.0301 13.7255 36.3201C13.9825 35.6102 13.7663 34.8153 13.185 34.3335L10.4759 32.0834Z" fill="#1E293B"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.3333 40H5.49999C5.03979 40 4.66669 40.3731 4.66669 40.8333C4.66669 41.2935 5.03979 41.6666 5.49999 41.6666H11.3333C11.7936 41.6666 12.1666 41.2935 12.1666 40.8333C12.1666 40.3731 11.7936 40 11.3333 40Z" fill="#1E293B"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M45.5 40H39.6667C39.2065 40 38.8334 40.3731 38.8334 40.8333C38.8334 41.2935 39.2065 41.6666 39.6667 41.6666H45.5C45.9602 41.6666 46.3333 41.2935 46.3333 40.8333C46.3333 40.3731 45.9602 40 45.5 40Z" fill="#1E293B"/>
              <path d="M25.5 1.66669C18.1362 1.66669 12.1666 7.63619 12.1666 15C12.1666 22.3638 18.1362 28.3333 25.5 28.3333C32.8638 28.3333 38.8333 22.3638 38.8333 15C38.8333 7.63619 32.8638 1.66669 25.5 1.66669Z" fill="#F59E0B"/>
            </g>
            <defs>
              <clipPath id="clip-repair">
                <rect width="50" height="50" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'maintenance':
        return (
          <svg className="carsvg" xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
            <g clipPath="url(#clip-maintenance)">
              <path d="M25.5 5C14.4543 5 5.5 13.9543 5.5 25C5.5 36.0457 14.4543 45 25.5 45C36.5457 45 45.5 36.0457 45.5 25C45.5 13.9543 36.5457 5 25.5 5ZM25.5 41.6667C16.2952 41.6667 8.83333 34.2048 8.83333 25C8.83333 15.7952 16.2952 8.33333 25.5 8.33333C34.7048 8.33333 42.1667 15.7952 42.1667 25C42.1667 34.2048 34.7048 41.6667 25.5 41.6667Z" fill="#1E293B"/>
              <path d="M25.5 15C19.9772 15 15.5 19.4772 15.5 25C15.5 30.5228 19.9772 35 25.5 35C31.0228 35 35.5 30.5228 35.5 25C35.5 19.4772 31.0228 15 25.5 15Z" fill="#F59E0B"/>
            </g>
            <defs>
              <clipPath id="clip-maintenance">
                <rect width="50" height="50" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        );
      case 'emergency':
        return (
          <svg className="carsvg" xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
            <g clipPath="url(#clip-emergency)">
              <path d="M25.5 3.33325C13.5406 3.33325 3.83331 13.0406 3.83331 24.9999C3.83331 36.9593 13.5406 46.6666 25.5 46.6666C37.4593 46.6666 47.1666 36.9593 47.1666 24.9999C47.1666 13.0406 37.4593 3.33325 25.5 3.33325Z" fill="#1E293B"/>
              <path d="M27.1666 33.3333H23.8333V26.6666H17.1666V23.3333H23.8333V16.6666H27.1666V23.3333H33.8333V26.6666H27.1666V33.3333Z" fill="#F59E0B"/>
            </g>
            <defs>
              <clipPath id="clip-emergency">
                <rect width="50" height="50" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
        );
      default:
        return null;
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="service-card-2">
        <div className="title-svg">{renderIcon()}</div>
        <h5 className="title">{title}</h5>
        <p className="desc">{description}</p>
        <Link to={link} className="read-more">
          Learn More <i className="fa fa-arrow-right"></i>
        </Link>
      </div>
    );
  }

  return (
    <div className="service-card mb-16">
      <Link to={link} className="title-bar">
        <span className="d-flex align-items-center gap-16">
          {renderIcon()}
          <span className="h5 fw-600">{title}</span>
        </span>
        <svg
          className="arrow-svg"
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="24"
          viewBox="0 0 25 24"
          fill="none"
        >
          <path
            d="M15.5002 15.0001V9.00005M15.5002 9.00005H9.50019M15.5002 9.00005L9.50019 14.9999M8.3 21H16.7C18.3802 21 19.2202 21 19.862 20.673C20.4265 20.3854 20.8854 19.9265 21.173 19.362C21.5 18.7202 21.5 17.8802 21.5 16.2V7.8C21.5 6.11984 21.5 5.27976 21.173 4.63803C20.8854 4.07354 20.4265 3.6146 19.862 3.32698C19.2202 3 18.3802 3 16.7 3H8.3C6.61984 3 5.77976 3 5.13803 3.32698C4.57354 3.6146 4.1146 4.07354 3.82698 4.63803C3.5 5.27976 3.5 6.11984 3.5 7.8V16.2C3.5 17.8802 3.5 18.7202 3.82698 19.362C4.1146 19.9265 4.57354 20.3854 5.13803 20.673C5.77976 21 6.61984 21 8.3 21Z"
            stroke="#F59E0B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <p className="service-text pe-1">{description}</p>
    </div>
  );
};

export default ServiceCard;

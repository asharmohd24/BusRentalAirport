import React from 'react';
import { siteData } from '../data/data';
import { FaWhatsapp } from 'react-icons/fa'; // WhatsApp icon from FontAwesome

const FloatingWhatsApp = () => {
  const rawPhone = siteData?.contact?.phoneFormatted || siteData?.contact?.phone;
  
  if (!rawPhone) {
    console.warn('FloatingWhatsApp: No phone number found in siteData');
    return null;
  }

  const phoneNumber = rawPhone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappUrl}
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default FloatingWhatsApp;
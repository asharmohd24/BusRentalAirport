/**
 * About Page
 * ===========
 * Company information, team, and history
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { siteData } from '../data/data';
import { useSEO } from '../hooks/useSEO';
import PageBanner from '../components/PageBanner';

const About = () => {
  const { seo, whoWeAreTag, aboutImage, aboutImageAlt, extraDescription, contactBtnText, contactBtnLink,
    howItWorksTag, howItWorksTitle, faqTag, faqTitle, ctaTitle, ctaText, ctaBtnText, ctaBtnLink } = siteData.pages.about;

  useSEO({
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
  });
  return (
    <>
      <PageBanner title="About Us" />

      {/* About Section */}
      <section className="about-section pt-80 pb-80">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-image wow fadeInLeft">
                <img src={aboutImage} alt={aboutImageAlt} />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="about-content">
                <span className="section-tag wow fadeInUp">{whoWeAreTag}</span>
                <h2 className="section-title wow fadeInUp" data-wow-delay="0.2s">
                  {siteData.about.subtitle}
                </h2>
                <p className="about-text wow fadeInUp" data-wow-delay="0.3s">
                  {siteData.about.description}
                </p>
                <p className="about-text wow fadeInUp" data-wow-delay="0.4s">
                  {extraDescription}
                </p>
                <Link to={contactBtnLink} className="cus-btn wow fadeInUp" data-wow-delay="0.5s">
                  {contactBtnText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section pt-80 pb-80 bg-dark">
        <div className="container-fluid">
          <div className="row">
            {siteData.about.stats.map((stat, index) => (
              <div key={index} className="col-lg-3 col-md-6">
                <div className="stat-block text-center wow fadeInUp" data-wow-delay={`${index * 0.1}s`}>
                  <span className="stat-number text-primary">{stat.number}</span>
                  <span className="stat-label text-white">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section pt-80 pb-80">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center mb-48">
              <span className="section-tag wow fadeInUp">{howItWorksTag}</span>
              <h2 className="section-title wow fadeInUp" data-wow-delay="0.2s">
                {howItWorksTitle}
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            {siteData.whyChooseUs.map((item, index) => (
              <div key={item.id} className="col-lg-4 col-md-6">
                <div className="whychoose-block wow fadeInUp" data-wow-delay={`${index * 0.2}s`}>
                  <div className="icon">
                    <span className="step-number">{index + 1}</span>
                  </div>
                  <div className="text-content">
                    <h5 className="title fw-600 mb-12">{item.title}</h5>
                    <p className="subtitle">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section pt-80 pb-80">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 text-center mb-48">
              <span className="section-tag wow fadeInUp">{faqTag}</span>
              <h2 className="section-title wow fadeInUp" data-wow-delay="0.2s">
                {faqTitle}
              </h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {siteData.faqs.map((faq, index) => (
                <FAQItem key={faq.id} faq={faq} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section as a box */}
<section className="pt-80 pb-80">
  <div className="container-fluid">
    <div 
      className="cta-box-wrapper bg-primary"
      style={{
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '66.666%',
        margin: '0 auto'
      }}
    >
      <div className="row align-items-center" style={{ margin: 0 }}>
        <div className="col-lg-8" style={{ padding: '0 12px 0 0' }}>
          <h2 className="cta-title text-white wow fadeInUp">
            {ctaTitle}
          </h2>
          <p className="cta-text text-white wow fadeInUp" data-wow-delay="0.2s">
            {ctaText}
          </p>
        </div>
        <div 
          className="col-lg-4 text-end" 
          style={{ padding: '0 0 0 12px' }}
        >
          <Link 
            to={ctaBtnLink} 
            className="cus-btn btn-dark-cta wow fadeInUp" 
            data-wow-delay="0.3s"
            style={{ marginRight: '0', display: 'inline-block' }}
          >
            {ctaBtnText}
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
    </>
  );
};

// FAQ Item Component with Accordion
const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-block wow fadeInUp ${isOpen ? 'active' : ''}`} data-wow-delay={`${index * 0.1}s`}>
      <div className="faq-title" onClick={() => setIsOpen(!isOpen)}>
        <h6>{faq.question}</h6>
        <span className="icon">
          <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
        </span>
      </div>
      <div className="faq-desc" style={{ display: isOpen ? 'block' : 'none' }}>
        <p>{faq.answer}</p>
      </div>
    </div>
  );
};

export default About;
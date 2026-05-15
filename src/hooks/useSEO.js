/**
 * useSEO Hook
 * ===========
 * Dynamically updates document title and meta tags on page navigation.
 * Supports title, description, keywords, and Open Graph / Twitter Card tags.
 */

import { useEffect } from 'react';
import { siteData } from '../data/data';

const SITE_NAME = siteData.siteName;
const DEFAULT_IMAGE = '/assets/images/og-image.jpg';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://www.globalbuscharters.com';

/**
 * Updates or creates a <meta> tag by name or property.
 */
function setMetaTag(attr, value, content) {
  let el = document.querySelector(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * useSEO – call inside any page component.
 *
 * @param {object} options
 * @param {string} options.title        – Page title (will be suffixed with site name)
 * @param {string} [options.description] – Meta description
 * @param {string} [options.keywords]    – Meta keywords
 * @param {string} [options.image]       – OG image URL
 * @param {string} [options.url]         – Canonical URL (defaults to current href)
 * @param {string} [options.type]        – OG type (default: "website")
 */
export function useSEO({
  title,
  description,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
} = {}) {
  useEffect(() => {
    const { seo } = siteData;

    // --- Title ---
    const fullTitle = title
      ? seo.titleTemplate.replace('%s', title)
      : seo.defaultTitle;
    document.title = fullTitle;

    // --- Basic Meta ---
    const desc = description || siteData.siteDescription;
    const kw = keywords || seo.keywords;
    const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : SITE_URL);
    const img = image.startsWith('http') ? image : `${SITE_URL}${image}`;

    setMetaTag('name', 'title', fullTitle);
    setMetaTag('name', 'description', desc);
    setMetaTag('name', 'keywords', kw);

    // --- Open Graph ---
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', desc);
    setMetaTag('property', 'og:image', img);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', SITE_NAME);

    // --- Twitter Card ---
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', desc);
    setMetaTag('name', 'twitter:image', img);

    // --- Canonical Link ---
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }, [title, description, keywords, image, url, type]);
}

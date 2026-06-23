import { useEffect } from 'react';

interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
}

const SITE_NAME = 'Museu Virtual da EDM';
const DEFAULT_DESC = 'Explore a história, o património e os artefactos da Electricidade de Moçambique — 48 anos a iluminar o país.';
const DEFAULT_IMAGE = '/logo.png';
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : '';

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function usePageMeta({ title, description, image }: PageMeta) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const desc = description || DEFAULT_DESC;
    const img = image
      ? (image.startsWith('http') ? image : `${BASE_URL}${image}`)
      : `${BASE_URL}${DEFAULT_IMAGE}`;

    document.title = fullTitle;

    setMeta('description', desc);
    setOg('og:title', fullTitle);
    setOg('og:description', desc);
    setOg('og:image', img);
    setOg('og:type', 'website');
    setOg('og:site_name', SITE_NAME);
    setOg('twitter:card', 'summary_large_image');
    setOg('twitter:title', fullTitle);
    setOg('twitter:description', desc);
    setOg('twitter:image', img);

    return () => {
      document.title = SITE_NAME;
    };
  }, [title, description, image]);
}

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import defaults from '../content/default-content.json';

const ContentContext = createContext(defaults);
export const defaultContent = defaults;
export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaults);
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/content', { signal: controller.signal, cache: 'no-store' })
      .then(response => { if (!response.ok) throw new Error('Content unavailable'); return response.json(); })
      .then(data => setContent(data.content || data))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => { document.title = content.site.brand; }, [content.site.brand]);
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
export const useContent = () => useContext(ContentContext);

// React escapes text. Links and media are restricted to passive URL protocols.
export function safeUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (/^(?:https?:|mailto:|tel:)/i.test(url) || /^(?:\/(?!\/)|#|\?)/.test(url)) return url;
  return '';
}

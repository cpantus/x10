import { useEffect } from 'react';

interface SEOMetaProps {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  schemas?: object[];
}

const SEOMeta: React.FC<SEOMetaProps> = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = 'https://x10.ro/og-image.jpg',
  schemas = [],
}) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', description);
    setMeta('og:title', ogTitle || title, true);
    setMeta('og:description', ogDescription || description, true);
    setMeta('og:url', canonical, true);
    setMeta('og:image', ogImage, true);
    setMeta('twitter:title', ogTitle || title);
    setMeta('twitter:description', ogDescription || description);

    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical;

    // Inject JSON-LD schemas
    const schemaIds: string[] = [];
    schemas.forEach((schema, i) => {
      const id = `seo-schema-${i}`;
      schemaIds.push(id);
      let script = document.getElementById(id) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    });

    return () => {
      schemaIds.forEach((id) => {
        document.getElementById(id)?.remove();
      });
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, schemas]);

  return null;
};

export default SEOMeta;

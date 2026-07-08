import { Helmet } from 'react-helmet-async';

// Per-page <title> + meta/OG tags (react-helmet-async). Public pages render one.
export default function Seo({ title, description, image, type = 'website' }) {
  const full = title ? `${title} · OBS Events` : 'OBS Events — Global event discovery & ticketing';
  const url = typeof window !== 'undefined' ? window.location.href : '';
  return (
    <Helmet>
      <title>{full}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:site_name" content="OBS Events" />
      <meta property="og:title" content={full} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}

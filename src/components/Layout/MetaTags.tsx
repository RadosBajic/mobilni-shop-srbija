
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  locale?: 'sr_RS' | 'en_US';
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  locale,
}) => {
  const { language } = useLanguage();
  
  const defaultTitle = language === 'sr' 
    ? 'MobiliSrbija - Mobilni dodaci i oprema' 
    : 'MobiliSrbija - Mobile Accessories and Equipment';
  
  const defaultDescription = language === 'sr'
    ? 'Kupite najnovije mobilne dodatke, maske za telefone, punjače, audio opremu i više. Brza dostava u celoj Srbiji.'
    : 'Shop the latest mobile accessories, phone cases, chargers, audio equipment and more. Fast delivery all over Serbia.';
    
  const defaultKeywords = language === 'sr'
    ? 'mobilni telefoni, maske za telefone, punjači, zaštitna stakla, mobilna oprema, srbija'
    : 'mobile phones, phone cases, chargers, screen protectors, mobile accessories, serbia';
  
  const defaultImage = '/logo.png';
  const defaultUrl = window.location.href;
  const defaultLocale = language === 'sr' ? 'sr_RS' : 'en_US';

  const siteTitle = title ? `${title} | MobiliSrbija` : defaultTitle;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:locale" content={locale || defaultLocale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || defaultUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url || defaultUrl} />
      
      {/* Mobile Specific */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
    </Helmet>
  );
};

export default MetaTags;

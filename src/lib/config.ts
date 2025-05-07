
interface SiteConfig {
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  keywords: {
    sr: string;
    en: string;
  };
  logo: string;
  themeColor: string;
  contact: {
    email: string;
    phone: string;
    address: {
      sr: string;
      en: string;
    };
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  delivery: {
    free: {
      threshold: number;
      currency: string;
    };
  };
}

export const siteConfig: SiteConfig = {
  title: {
    sr: 'MobiliSrbija - Mobilni dodaci i oprema',
    en: 'MobiliSrbija - Mobile Accessories and Equipment',
  },
  description: {
    sr: 'Kupite najnovije mobilne dodatke, maske za telefone, punjače, audio opremu i više. Brza dostava u celoj Srbiji.',
    en: 'Shop the latest mobile accessories, phone cases, chargers, audio equipment and more. Fast delivery all over Serbia.',
  },
  keywords: {
    sr: 'mobilni telefoni, maske za telefone, punjači, zaštitna stakla, mobilna oprema, srbija',
    en: 'mobile phones, phone cases, chargers, screen protectors, mobile accessories, serbia',
  },
  logo: '/logo.png',
  themeColor: '#3b82f6',
  contact: {
    email: 'info@mobilisrbija.rs',
    phone: '+381 64 123 4567',
    address: {
      sr: 'Bulevar Kralja Aleksandra 73, Beograd',
      en: '73 King Alexander Boulevard, Belgrade',
    },
  },
  social: {
    facebook: 'https://facebook.com/mobilisrbija',
    instagram: 'https://instagram.com/mobilisrbija',
  },
  delivery: {
    free: {
      threshold: 3000,
      currency: 'RSD',
    },
  },
};


import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import MainLayout from '@/components/Layout/MainLayout';
import { Separator } from '@/components/ui/separator';

const About: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    title: {
      sr: 'O nama',
      en: 'About Us'
    },
    introduction: {
      sr: 'MobShop je vodeća kompanija u prodaji mobilnih telefona i dodatne opreme. Naša strast je da vam pružimo najnovije i najkvalitetnije proizvode po konkurentnim cenama.',
      en: 'MobShop is a leading company in the sale of mobile phones and accessories. Our passion is to provide you with the latest and highest quality products at competitive prices.'
    },
    mission: {
      sr: 'Naša misija',
      en: 'Our Mission'
    },
    missionText: {
      sr: 'Naša misija je da pružimo izuzetno korisničko iskustvo, visok kvalitet proizvoda i brzu isporuku. Trudimo se da ostanemo u koraku sa najnovijim tehnološkim trendovima i da vam ponudimo najbolja mobilna rešenja.',
      en: 'Our mission is to provide an exceptional customer experience, high quality products, and fast delivery. We strive to stay up-to-date with the latest technology trends and offer you the best mobile solutions.'
    },
    history: {
      sr: 'Naša istorija',
      en: 'Our History'
    },
    historyText: {
      sr: 'Osnovani 2010. godine, brzo smo se razvili od male lokalne prodavnice do jednog od vodećih online prodavaca mobilnih uređaja i opreme. Tokom godina, izgradili smo snažne odnose sa dobavljačima i transportnim partnerima kako bismo vam obezbedili najbolju uslugu.',
      en: 'Founded in 2010, we quickly evolved from a small local store to one of the leading online retailers of mobile devices and equipment. Over the years, we have built strong relationships with suppliers and shipping partners to provide you with the best service.'
    },
    whyChooseUs: {
      sr: 'Zašto izabrati nas',
      en: 'Why Choose Us'
    },
    reasons: {
      sr: [
        'Širok asortiman proizvoda',
        'Konkurentne cene',
        'Brza isporuka',
        'Stručna korisnička podrška',
        'Garancija na sve proizvode'
      ],
      en: [
        'Wide range of products',
        'Competitive prices',
        'Fast delivery',
        'Expert customer support',
        'Warranty on all products'
      ]
    },
    contact: {
      sr: 'Kontaktirajte nas',
      en: 'Contact Us'
    },
    contactText: {
      sr: 'Želimo da čujemo vaše mišljenje. Kontaktirajte nas putem e-maila, telefona ili posetite našu prodavnicu.',
      en: 'We want to hear from you. Contact us via email, phone, or visit our store.'
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-8">{content.title[language]}</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-xl mb-8">{content.introduction[language]}</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">{content.mission[language]}</h2>
          <p>{content.missionText[language]}</p>
          
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold mb-4">{content.history[language]}</h2>
          <p>{content.historyText[language]}</p>
          
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold mb-4">{content.whyChooseUs[language]}</h2>
          <ul className="space-y-2 my-4">
            {content.reasons[language].map((reason, index) => (
              <li key={index} className="flex items-start">
                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5">
                  {index + 1}
                </span>
                {reason}
              </li>
            ))}
          </ul>
          
          <Separator className="my-8" />
          
          <h2 className="text-2xl font-bold mb-4">{content.contact[language]}</h2>
          <p>{content.contactText[language]}</p>
          
          <div className="bg-card border rounded-lg p-6 mt-6 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="font-medium">Email</div>
              <div className="text-muted-foreground">info@mobshop.com</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Telefon</div>
              <div className="text-muted-foreground">+381 11 123 4567</div>
            </div>
            <div className="text-center">
              <div className="font-medium">Adresa</div>
              <div className="text-muted-foreground">Knez Mihailova 10, Beograd</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;

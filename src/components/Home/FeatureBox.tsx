
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Feature {
  icon: LucideIcon;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
}

interface FeatureBoxProps {
  features: Feature[];
  className?: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ features, className = '' }) => {
  const { language } = useLanguage();
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {features.map((feature, index) => (
        <Card key={index} className="bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
          <CardContent className="p-6 flex items-start">
            <div className="rounded-full bg-primary/10 p-3 mr-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">{feature.title[language]}</h3>
              <p className="text-sm text-muted-foreground">{feature.description[language]}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeatureBox;

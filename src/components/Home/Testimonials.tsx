
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Testimonial {
  id: number;
  name: string;
  position?: string;
  avatar?: string;
  content: {
    sr: string;
    en: string;
  };
  rating: number;
}

interface TestimonialsProps {
  limit?: number;
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ limit = 3, className = '' }) => {
  const { language } = useLanguage();
  
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Marko P.',
      position: language === 'sr' ? 'Redovni kupac' : 'Regular Customer',
      avatar: 'https://i.pravatar.cc/100?img=11',
      content: {
        sr: 'Odlična usluga i brza dostava. Proizvod je upravo onakav kakav sam očekivao! Definitivno ću se vratiti ponovo.',
        en: 'Excellent service and fast delivery. The product is exactly what I expected! I will definitely come back again.'
      },
      rating: 5
    },
    {
      id: 2,
      name: 'Ana S.',
      position: language === 'sr' ? 'Zadovoljna mušterija' : 'Satisfied Customer',
      avatar: 'https://i.pravatar.cc/100?img=5',
      content: {
        sr: 'Veoma sam zadovoljna kvalitetom. Definitivno ću ponovo kupovati ovde. Brzo su odgovorili na sva moja pitanja.',
        en: 'I am very satisfied with the quality. I will definitely shop here again. They quickly answered all my questions.'
      },
      rating: 5
    },
    {
      id: 3,
      name: 'Nikola M.',
      position: language === 'sr' ? 'Tehnički entuzijasta' : 'Tech Enthusiast',
      avatar: 'https://i.pravatar.cc/100?img=12',
      content: {
        sr: 'Najpouzdanija online prodavnica mobilnih dodataka. Preporučujem svima koji traže kvalitetne proizvode!',
        en: 'The most reliable online store for mobile accessories. I recommend it to everyone looking for quality products!'
      },
      rating: 5
    },
    {
      id: 4,
      name: 'Jelena T.',
      position: language === 'sr' ? 'Profesionalac' : 'Professional',
      avatar: 'https://i.pravatar.cc/100?img=9',
      content: {
        sr: 'Uvek nađem ono što mi treba za moj posao. Sjajan izbor i profesionalno osoblje.',
        en: 'I always find what I need for my work. Great selection and professional staff.'
      },
      rating: 4
    }
  ];

  const displayedTestimonials = testimonials.slice(0, limit);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`py-16 ${className}`}>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          {language === 'sr' ? 'Šta naši kupci kažu' : 'What Our Customers Say'}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {language === 'sr' 
            ? 'Pogledajte iskustva naših zadovoljnih kupaca' 
            : 'See what our satisfied customers have to say'}
        </p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {displayedTestimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={item}>
            <Card className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start mb-4">
                  {testimonial.avatar && (
                    <div className="mr-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    {testimonial.position && (
                      <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <Quote className="absolute opacity-10 text-primary w-8 h-8 -left-1 -top-1" />
                  <p className="text-muted-foreground relative z-10 italic pl-2">
                    "{testimonial.content[language]}"
                  </p>
                </div>
                
                <div className="flex items-center mt-4 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'text-gray-300'}`} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonials;

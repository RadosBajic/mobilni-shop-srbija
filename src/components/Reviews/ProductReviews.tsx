
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Rating from './Rating';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

// Simulirani podaci za recenzije proizvoda
export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

interface ProductReviewsProps {
  productId: string;
  reviews?: Review[];
}

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Marko P.',
    rating: 5,
    date: '2023-10-15',
    comment: 'Odličan proizvod, veoma sam zadovoljan kvalitetom. Brza isporuka.',
    verified: true,
  },
  {
    id: '2',
    userName: 'Ana M.',
    rating: 4,
    date: '2023-09-22',
    comment: 'Dobar proizvod za tu cenu. Malo je stigao kasnije nego što sam očekivala.',
    verified: true,
  },
  {
    id: '3',
    userName: 'Jovan S.',
    rating: 5,
    date: '2023-08-30',
    comment: 'Sve pohvale za proizvod i prodavca. Preporučujem!',
    verified: false,
  }
];

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, reviews = mockReviews }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  
  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;
  
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      rating: 5,
      comment: '',
    },
  });
  
  const handleSubmitReview = (data: any) => {
    // Here you would normally submit the review to your backend
    console.log('Submitting review:', data);
    
    toast({
      title: language === 'sr' ? 'Recenzija poslata' : 'Review submitted',
      description: language === 'sr' 
        ? 'Vaša recenzija je uspešno poslata i biće objavljena nakon pregleda.' 
        : 'Your review has been submitted and will be published after review.',
    });
    
    setShowReviewDialog(false);
    form.reset();
  };

  const translations = {
    reviews: {
      sr: 'Recenzije',
      en: 'Reviews',
    },
    customerReviews: {
      sr: 'Recenzije kupaca',
      en: 'Customer Reviews',
    },
    outOf: {
      sr: 'od',
      en: 'out of',
    },
    basedOn: {
      sr: 'na osnovu',
      en: 'based on',
    },
    verified: {
      sr: 'Verifikovana kupovina',
      en: 'Verified Purchase',
    },
    writeReview: {
      sr: 'Napišite recenziju',
      en: 'Write a Review',
    },
    yourReview: {
      sr: 'Vaša recenzija',
      en: 'Your Review',
    },
    yourName: {
      sr: 'Vaše ime',
      en: 'Your Name',
    },
    yourEmail: {
      sr: 'Vaš email',
      en: 'Your Email',
    },
    yourRating: {
      sr: 'Vaša ocena',
      en: 'Your Rating',
    },
    yourComment: {
      sr: 'Vaš komentar',
      en: 'Your Comment',
    },
    submit: {
      sr: 'Pošalji',
      en: 'Submit',
    },
    cancel: {
      sr: 'Odustani',
      en: 'Cancel',
    },
    reviewsCount: {
      sr: (count: number) => `${count} ${count === 1 ? 'recenzija' : count > 1 && count < 5 ? 'recenzije' : 'recenzija'}`,
      en: (count: number) => `${count} ${count === 1 ? 'review' : 'reviews'}`,
    },
  };

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">{translations.reviews[language]}</h2>
      
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold">{avgRating.toFixed(1)}</div>
            <Rating value={avgRating} size="lg" className="justify-center my-2" />
            <div className="text-sm text-muted-foreground">
              {avgRating.toFixed(1)} {translations.outOf[language]} 5
            </div>
            <div className="text-sm text-muted-foreground">
              {translations.basedOn[language]} {translations.reviewsCount[language](reviews.length)}
            </div>
          </div>
          
          <Separator className="hidden md:block h-20 w-px bg-border" orientation="vertical" />
          
          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                
                return (
                  <div key={star} className="flex items-center gap-2">
                    <div className="text-sm w-3">{star}</div>
                    <Rating value={star} size="sm" className="min-w-20" />
                    <div className="flex-1 h-2 bg-muted rounded overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm w-8 text-right">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
              <DialogTrigger asChild>
                <Button>{translations.writeReview[language]}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{translations.yourReview[language]}</DialogTitle>
                  <DialogDescription>
                    {language === 'sr' 
                      ? 'Podelite vaše iskustvo sa ovim proizvodom' 
                      : 'Share your experience with this product'
                    }
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.yourName[language]}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.yourEmail[language]}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.yourRating[language]}</FormLabel>
                          <FormControl>
                            <Rating 
                              value={field.value} 
                              onChange={(value) => field.onChange(value)}
                              readOnly={false}
                              size="lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="comment"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{translations.yourComment[language]}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={language === 'sr' 
                                ? 'Opišite vaše iskustvo sa ovim proizvodom...' 
                                : 'Describe your experience with this product...'
                              }
                              className="min-h-28"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowReviewDialog(false)}
                      >
                        {translations.cancel[language]}
                      </Button>
                      <Button type="submit">
                        {translations.submit[language]}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{review.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(review.date)}
                </div>
              </div>
              <Rating value={review.rating} size="sm" />
            </div>
            
            {review.verified && (
              <div className="mt-1 inline-flex items-center text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3 h-3 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                {translations.verified[language]}
              </div>
            )}
            
            <p className="mt-3 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
      
      {reviews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          {language === 'sr' 
            ? 'Još uvek nema recenzija za ovaj proizvod.' 
            : 'There are no reviews yet for this product.'
          }
        </div>
      )}
    </div>
  );
};

export default ProductReviews;

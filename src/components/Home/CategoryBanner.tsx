
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface CategoryType {
  id: string;
  name_sr: string;
  name_en: string;
  slug: string;
  description_sr: string | null;
  description_en: string | null;
  image: string | null;
  is_active: boolean;
  display_order: number;
}

const CategoryBanner: React.FC = () => {
  const { language } = useLanguage();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Only fetch active categories
        const data = await api.getCategories(true);
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted/20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return null; // Don't show anything if there are no categories
  }

  return (
    <div className="py-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/kategorija/${category.slug}`}
              className="overflow-hidden rounded-lg relative group hover-lift"
            >
              <div 
                className="h-64 bg-cover bg-center transform transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {language === 'sr' ? category.name_sr : category.name_en}
                  </h3>
                  <p className="text-white/80 line-clamp-2">
                    {language === 'sr' ? category.description_sr : category.description_en}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;

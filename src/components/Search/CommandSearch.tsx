
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  Command 
} from '@/components/ui/command';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchResult {
  id: string;
  type: 'product' | 'category' | 'page';
  title: {
    sr: string;
    en: string;
  };
  url: string;
  image?: string;
}

// Mock search results - in a real app these would come from an API
const mockSearchResults: SearchResult[] = [
  {
    id: 'p1',
    type: 'product',
    title: {
      sr: 'iPhone 14 Pro silikonska maska - crna',
      en: 'iPhone 14 Pro Silicone Case - Black',
    },
    url: '/product/iphone-14-pro-case-black',
    image: 'https://images.unsplash.com/photo-1613588718956-c2e80305bf61?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'p2',
    type: 'product',
    title: {
      sr: 'Samsung Galaxy S23 Ultra staklena zaštita ekrana',
      en: 'Samsung Galaxy S23 Ultra Glass Screen Protector',
    },
    url: '/product/samsung-s23-ultra-screen-protector',
    image: 'https://images.unsplash.com/photo-1600541519467-937869997e34?q=80&w=100&auto=format&fit=crop',
  },
  {
    id: 'c1',
    type: 'category',
    title: {
      sr: 'Maske za telefone',
      en: 'Phone Cases',
    },
    url: '/category/phone-cases',
  },
  {
    id: 'c2',
    type: 'category',
    title: {
      sr: 'Slušalice',
      en: 'Headphones',
    },
    url: '/category/headphones',
  },
  {
    id: 'pg1',
    type: 'page',
    title: {
      sr: 'O nama',
      en: 'About Us',
    },
    url: '/about',
  },
];

export const CommandSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const isMobile = useIsMobile();

  const filteredResults = query 
    ? mockSearchResults.filter((result) => 
        result.title[language].toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    setOpen(false);
    setQuery('');
  };

  // Add keyboard shortcut to open search
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <Button 
        variant="outline" 
        className={`relative ${
          isMobile ? 'w-full' : 'w-64 lg:w-80'
        } justify-start text-sm text-muted-foreground bg-background/80 border-secondary`}
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="flex-1 text-left">{t('search')}...</span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="bg-popover/90 backdrop-blur-md rounded-t-lg border-b">
          <div className="flex items-center px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder={t('search')}
              value={query}
              onValueChange={setQuery}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-base outline-none placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {query && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <Command className="rounded-b-lg">
          <CommandList>
            <CommandEmpty>
              <div className="py-6 text-center text-sm">
                {t('noResults')}
              </div>
            </CommandEmpty>

            {filteredResults.length > 0 && (
              <>
                {/* Products section */}
                {filteredResults.filter(r => r.type === 'product').length > 0 && (
                  <CommandGroup heading={t('products')}>
                    {filteredResults
                      .filter(result => result.type === 'product')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                          className="flex items-center py-2"
                        >
                          {result.image && (
                            <div className="mr-3 h-10 w-10 overflow-hidden rounded-md bg-secondary flex-shrink-0">
                              <img
                                src={result.image}
                                alt={result.title[language]}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span>{result.title[language]}</span>
                            <span className="text-xs text-muted-foreground">
                              {t('product')}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {/* Categories section */}
                {filteredResults.filter(r => r.type === 'category').length > 0 && (
                  <CommandGroup heading={t('categories')}>
                    {filteredResults
                      .filter(result => result.type === 'category')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                        >
                          {result.title[language]}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {t('category')}
                          </span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}

                {/* Pages section */}
                {filteredResults.filter(r => r.type === 'page').length > 0 && (
                  <CommandGroup heading={t('pages')}>
                    {filteredResults
                      .filter(result => result.type === 'page')
                      .map(result => (
                        <CommandItem
                          key={result.id}
                          onSelect={() => handleSelect(result)}
                        >
                          {result.title[language]}
                          <span className="ml-2 text-xs text-muted-foreground">
                            {t('page')}
                          </span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default CommandSearch;

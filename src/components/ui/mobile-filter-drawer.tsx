
import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileFilterDrawerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function MobileFilterDrawer({ 
  title, 
  description, 
  children,
  footer
}: MobileFilterDrawerProps) {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  
  // If not mobile, render the children directly
  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {language === 'sr' ? 'Filteri' : 'Filters'}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] max-h-[85vh]">
        <DrawerHeader className="border-b sticky top-0 bg-background z-10">
          <DrawerTitle>{title || (language === 'sr' ? 'Filteri' : 'Filters')}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
          <DrawerClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 overflow-y-auto flex-1 pb-24">
          {children}
        </div>
        {footer && (
          <DrawerFooter className="border-t sticky bottom-0 bg-background">
            {footer}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

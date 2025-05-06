
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  homeIcon?: boolean;
  homeHref?: string;
  homeLabel?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/70" />,
  homeIcon = true,
  homeHref = '/',
  homeLabel = 'Home'
}) => {
  return (
    <nav className={cn('flex flex-wrap items-center text-sm text-muted-foreground', className)}>
      <ol className="flex items-center flex-wrap">
        {homeIcon && (
          <li className="flex items-center">
            <Link 
              to={homeHref} 
              className="flex items-center hover:text-primary transition-colors"
              aria-label={homeLabel}
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">{homeLabel}</span>
            </Link>
            <span className="mx-1">{separator}</span>
          </li>
        )}
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <>
                <Link 
                  to={item.href} 
                  className="hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
                {index < items.length - 1 && <span className="mx-1">{separator}</span>}
              </>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export { Breadcrumb };

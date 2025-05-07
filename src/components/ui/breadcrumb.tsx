
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
  homeIcon?: boolean;
  homeHref?: string;
  homeLabel?: string;
  children?: React.ReactNode;
}

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex items-center flex-wrap", className)}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    asChild?: boolean;
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "a";
  return (
    <Comp
      ref={ref}
      className={cn("hover:text-primary transition-colors", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("mx-1 text-muted-foreground", className)}
    {...props}
  >
    {children || <ChevronRight className="h-4 w-4" />}
  </span>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground/70" />,
  homeIcon = true,
  homeHref = '/',
  homeLabel = 'Home',
  children
}) => {
  if (children) {
    return (
      <nav className={cn('flex flex-wrap items-center text-sm text-muted-foreground', className)}>
        {children}
      </nav>
    );
  }

  return (
    <nav className={cn('flex flex-wrap items-center text-sm text-muted-foreground', className)}>
      <BreadcrumbList>
        {homeIcon && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link 
                to={homeHref} 
                className="flex items-center hover:text-primary transition-colors"
                aria-label={homeLabel}
              >
                <Home className="h-4 w-4" />
                <span className="sr-only">{homeLabel}</span>
              </Link>
            </BreadcrumbLink>
            <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
          </BreadcrumbItem>
        )}
        
        {items?.map((item, index) => (
          <BreadcrumbItem key={index}>
            {item.href ? (
              <>
                <BreadcrumbLink asChild>
                  <Link to={item.href}>{item.label}</Link>
                </BreadcrumbLink>
                {index < items.length - 1 && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              </>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </nav>
  );
};

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
};

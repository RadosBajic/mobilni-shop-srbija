
import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number;
  showCount?: boolean;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxLength, showCount = false, error, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(props.value?.toString().length || 0);
    
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };
    
    // Calculate percentage of characters used
    const percentUsed = maxLength ? (charCount / maxLength) * 100 : 0;
    const isNearLimit = percentUsed > 80;
    const isAtLimit = percentUsed >= 100;
    
    return (
      <div className="relative">
        <textarea
          className={cn(
            "flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={ref}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        
        {error && (
          <div className="text-destructive text-sm mt-1">{error}</div>
        )}
        
        {showCount && maxLength && (
          <div 
            className={cn(
              "text-xs mt-1 text-right",
              isNearLimit && !isAtLimit && "text-amber-500",
              isAtLimit && "text-destructive font-medium"
            )}
          >
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

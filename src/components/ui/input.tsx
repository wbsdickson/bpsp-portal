import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  floatingLabel?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, floatingLabel = false, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          type={type}
          data-slot="input"
          placeholder=" "
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input shadow-xs peer h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
          )}
          {...props}
        />
        {label && floatingLabel ? (
          <label className="text-muted-foreground peer-focus:text-primary pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs font-bold transition-colors">
            {label}
          </label>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };

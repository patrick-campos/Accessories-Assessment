import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-ink text-mist hover:bg-clay",
        outline: "border border-ink text-ink hover:bg-ink hover:text-mist",
        ghost: "text-ink hover:bg-dune",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

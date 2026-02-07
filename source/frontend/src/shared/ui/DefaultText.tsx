import { cn } from "@/shared/lib/cn";
import { cva, VariantProps } from "class-variance-authority";

const DefaultTextVariants = cva(
    "leading-[1.375rem]", 
    {
    variants: {
        variant: {
            default: "font-body text-default"
        }
    },
    defaultVariants: { variant: "default" },
})

type DefaultText = React.ComponentProps<"p"> & VariantProps<typeof DefaultTextVariants>;

export function DefaultText({ className, variant, ...props }: DefaultText): JSX.Element {
    return <p className={cn(className)} {...props} />
}
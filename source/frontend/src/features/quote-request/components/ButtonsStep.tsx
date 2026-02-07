import { Button, cn } from "@/shared";

type ButtonStepProps = React.ComponentProps<"button"> & {
    shouldRender:boolean,
    variant?: 'primary' | 'outline' | 'ghost'
};

export function ButtonStep({shouldRender, variant, className ,...props}:ButtonStepProps):JSX.Element{

    if(!shouldRender)
        return <></>

    return (
        <Button className={cn('max-sm:h-[4.4rem] max-sm:py-[1rem] max-sm:text-subtitle', className)} variant={variant} {...props}/>
    )
}
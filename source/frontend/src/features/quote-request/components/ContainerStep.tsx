import { cn } from "@/shared";
import { ReactElement } from "react";

export function ContainerStep({className, ...props}:React.ComponentProps<"div">):ReactElement{
    return (
        <div className={cn("xl:w-[66.2rem] w-full lg:pt-[2.4rem] lg:pb-[7.2rem] lg:pl-[3.6rem] max-lg:py-[2.4rem]",className)}>
            {props.children}
        </div>
    )
}
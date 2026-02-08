import { cn } from "@/shared/lib"
import { Button } from "@/shared/ui";
import { Trash2 } from "lucide-react";
import React from "react";

type IMGSelectorProps = React.ComponentProps<"div"> & {
    IsMissing?: boolean;
    Label?:string;
    IMGRef?: string | null; 
    RemoveAction?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
    OnSelect?: (file: File | null) => void;
    MiddleLabel?:string;
}

export function IMGSelector({ IsMissing, Label, MiddleLabel, className, IMGRef, OnSelect, RemoveAction, ...props }: IMGSelectorProps): JSX.Element {

    const transitionClasses = IsMissing ? 'border-rose' : '';

    const inputRef = React.useRef<HTMLInputElement | null>(null);

    function isLocalPreviewUrl(value: string) {
        return value.startsWith("blob:") || value.startsWith("data:");
    }

    function RenderRemoveButton(shouldShow: boolean, removFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void): JSX.Element {
        if(!shouldShow)
            return <></>

        return (
            <Button className="absolute right-0 px-[1rem]" variant={"icon"} onClick={removFunction}>
                <Trash2 className="h-[1.5rem] w-[1.5rem]"/>
            </Button>
        )
    }

    function RenderPreviewImage(ref:string | null, removFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void): JSX.Element{
        if(ref == null)
            return <></>

        const showRemove = Boolean(removFunction) && isLocalPreviewUrl(ref);

        return (
            <div className="relative w-full h-full">
                {RenderRemoveButton(showRemove, removFunction)}
                <img src={ref} className="h-full w-full rounded-sm" referrerPolicy="no-referrer" />
            </div>
        )
    }

    function RenderSelectableInput(label?:string, onSelect?: (file: File | null) => void):JSX.Element{

        const AdditionalStyle = label != undefined ? 'flex align-center justify-center text-center font-normal text-subtitle px-[1rem]': ''

        return (
            <label className={cn("w-full h-full", AdditionalStyle)}>
                <span className="m-auto">{label}</span>
                <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={inputRef}
                onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) 
                        return;
                    if(onSelect)
                        onSelect(file);
                    if (inputRef.current) {
                        inputRef.current.value = "";
                    }
                }}
                />
            </label>
        )
    }

    function RenderPreviewErrorSection(isMissing:boolean | undefined){
        if(!isMissing)
            return <></>

        return (
            <div>
                <span className="text-rose mt-[0.6rem]">Required</span>
            </div>
        )
    }

    function RenderPreviewFooter(label:string | undefined, isMissing:boolean | undefined){

        if(label == null || label == undefined)
            return (<div>{RenderPreviewErrorSection(isMissing)}</div>)
        
        return (
            <div>
                {RenderPreviewErrorSection(isMissing)}
                <span className="mt-[0.6rem]">{label}</span>
            </div>
        )
    }

    function RenderFieldContent(imgRef:string | null | undefined, middlelabel?:string, onSelect?: (file: File | null) => void, removFunction?: (event: React.MouseEvent<HTMLButtonElement>) => void):JSX.Element{
        if(imgRef)
            return RenderPreviewImage(imgRef, removFunction);

        return RenderSelectableInput(middlelabel,onSelect);
    }

    return (
        <div className="h-full m-auto">
            <div {...props} className={cn("flex h-[15.5rem] w-[15.5rem] flex-col items-center justify-center gap-3 border-default rounded-sm border-[0.1rem] border-dashed cursor-pointer", className ,transitionClasses)}>
                {RenderFieldContent(IMGRef, MiddleLabel ,OnSelect, RemoveAction)}
            </div>
            {RenderPreviewFooter(Label, IsMissing)}
        </div>
    )
}

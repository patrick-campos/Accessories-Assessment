import { IMGSelector } from "@/shared/ui/ImgSelector";
import React, { useState } from "react";

type DynamicImagesState = {
    uri: string,
    file: File
}

export function DynamicImagesSelect(): JSX.Element {

    const [Images, setImages] = useState<Array<DynamicImagesState>>([]);

    function AddNewImage(file: File | null): void {
        console.log("entrou no add new image")
        if(file == null)
            return;

        const newImage: DynamicImagesState = { uri: URL.createObjectURL(file), file: file};

        setImages((prev) => [...prev, newImage]);
    }
    function RemoveImage(index:number): void{
        setImages(prev => prev.filter((_, i) => i !== index));
    }

    function RenderImagesSelected(image: DynamicImagesState | null, index: number): JSX.Element {
        if (image == null || image == undefined)
            return <></>

        return (
            <IMGSelector key={`DynamicImagesSelector-${index}`} IMGRef={image?.uri} RemoveAction={(event) => RemoveImage(index)} />
        )
    }

    return (
        <div className="grid flex-col w-full h-full max-sm:grid-cols-2 max-lg:grid-cols-3 lg:grid-cols-4 gap-3 max-lg:justify-between">
            {Images != null && Images.length > 0 && Images?.map((image, index) => {
                return RenderImagesSelected(image, index);
            })}
            <IMGSelector OnSelect={AddNewImage} MiddleLabel={"Drag and drop or click to upload"} />

        </div>
    )
}
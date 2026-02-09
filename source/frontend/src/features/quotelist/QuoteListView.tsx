import type { ReactNode } from "react";
import { Button, MasterHeader } from "@/shared";
import { ContentContainer } from "@/shared/ui/ContentContainer";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "@/shared/ui/ImgSelector";
import { TitleText } from "@/shared/ui/Title";
import { TwoGridContainer } from "@/shared/ui/TwoGridContainer";

export type QuoteListItem = {
    id: string;
    reference: string;
    createdAtLabel: string;
    status: string;
    brandName: string;
    model: string;
    imageUrl: string;
};

type QuoteListViewProps = {
    items: ReactNode;
};

export function QuoteListView({ items }: QuoteListViewProps) {
    return (
        <section className="min-h-screen w-screen flex flex-col">
            <div>
                <MasterHeader />
                <div className="w-full mt-[1.8rem] text-center">
                    <TitleText className="text-[4.6rem] font-extrabold text-normal mb-lg">MY QUOTES</TitleText>
                </div>
                <div className="px-[5%] mb-[1.2rem] max-lg:text-center">
                    <DefaultText>New Quotes</DefaultText>
                </div>
            </div>
            <ContentContainer>{items}</ContentContainer>
        </section>
    );
}

export function QuoteListItemCard({
    reference,
    createdAtLabel,
    status,
    brandName,
    model,
    imageUrl,
}: QuoteListItem) {
    return (
        <section className="w-full min-h-[50rem] pb-lg [&:not(:last-child)]:border-b mb-lg max-lg:px-[5%]">
            <TwoGridContainer className="max-lg:flex-row">
                <div className="w-[30%] max-lg:w-full">
                    <IMGSelector IMGRef={imageUrl} className="border-none w-[35vw] h-[35vw] flex flex-start max-lg:w-full max-lg:h-[46vh]" />
                </div>
                <aside className="w-[calc(50%_-_0.05px_-_2rem);] py-[1.2rem] max-lg:mt-md max-lg:w-full max-lg:pb-md">
                    <div className="flex justify-end max-lg:justify-center ">
                        <DefaultText>ID #{reference}</DefaultText>
                    </div>
                    <div className="mt-sm max-lg:text-center">
                        <DefaultText>Submitted {createdAtLabel}</DefaultText>
                    </div>
                    <div className="mt-sm">
                        <TitleText as="h2" className="text-emphasis font-normal max-lg:text-center">{brandName}</TitleText>
                        <TitleText as="h3" className="text-emphasis font-normal max-lg:text-center">{model}</TitleText>
                    </div>
                    <div className="mt-[4rem]">
                        <DefaultText className="font-normal max-lg:text-center">Status</DefaultText>
                        <DefaultText className="font-normal text-subtitle max-lg:text-center">{status}</DefaultText>
                    </div>
                    <div className="mt-[1.6rem] max-lg:text-center">
                        <Button variant={"ghost"} className="text-subtitle">Cancel</Button>
                    </div>
                </aside>
            </TwoGridContainer>
        </section>
    );
}

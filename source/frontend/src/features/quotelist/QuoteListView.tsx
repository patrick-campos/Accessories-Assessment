import { Button, MasterHeader } from "@/shared";
import { ContentContainer } from "@/shared/ui/ContentContainer";
import { DefaultText } from "@/shared/ui/DefaultText";
import { IMGSelector } from "@/shared/ui/ImgSelector";
import { TitleText } from "@/shared/ui/Title";
import { TwoGridContainer } from "@/shared/ui/TwoGridContainer";

type QuoteListItem = {
  id: string;
  createdAt: string;
  status: string;
  reference: string;
  countryOfOrigin: string;
  items: Array<{
    id: string;
    model: string;
    brand: { id: string; name: string };
    files: Array<{ id: string; location: string; metadata: { photoSubtype: string } }>;
  }>;
};

type QuoteListViewProps = {
  items: QuoteListItem[];
  isLoading: boolean;
  error: string | null;
};

export function QuoteListView({ items, isLoading, error }: QuoteListViewProps) {
    let content: React.ReactNode = null;
    if (isLoading) {
        content = <DefaultText>Loading quotes...</DefaultText>;
    } else if (error) {
        content = <DefaultText>{error}</DefaultText>;
    } else if (!items.length) {
        content = <DefaultText>No quotes yet.</DefaultText>;
    } else {
        const quote = items[0];
        const firstItem = quote.items[0];
        let imageUrl = "";
        if (firstItem?.files?.length) {
            const front = firstItem.files.find((file) => file.metadata.photoSubtype === "Front");
            if (front?.location) {
                imageUrl = front.location;
            } else {
                imageUrl = firstItem.files[0]?.location ?? "";
            }
        }

        content = (
            <TwoGridContainer className="max-lg:flex-row">
                <div className="w-[calc(41.66%_-_2rem)] flex flex-end flex-col">
                    <DefaultText>New Quotes</DefaultText>
                    <IMGSelector IMGRef={imageUrl} className="border-none w-[80%]" />
                </div>
                <aside className="w-[calc(50%_-_0.05px_-_2rem);] bg-red-50 py-[1.2rem]">
                    <div className="flex justify-end">
                        <DefaultText>ID #{quote.reference}</DefaultText>
                    </div>
                    <div className="mt-[2.4rem]">
                        <DefaultText>Submitted {new Date(quote.createdAt).toLocaleDateString()}</DefaultText>
                    </div>
                    <div className="mt-[2.4rem]">
                        <TitleText as="h2">{firstItem?.brand?.name ?? ""}</TitleText>
                        <TitleText as="h3">{firstItem?.model ?? ""}</TitleText>
                    </div>
                    <div className="mt-[4rem]">
                        <DefaultText>Status</DefaultText>
                        <DefaultText>{quote.status}</DefaultText>
                    </div>
                    <div className="mt-[1.6rem]">
                        <Button variant={"ghost"}>Cancel</Button>
                    </div>
                </aside>
            </TwoGridContainer>
        );
    }

    return (
        <section className="h-screen w-screen">
            <div>
                <MasterHeader className="border-none" />
                <div className="w-full mt-[1.8rem] text-center">
                    <TitleText className="text-[4.6rem] font-extrabold text-normal">MY QUOTES</TitleText>
                </div>
            </div>
            <ContentContainer>
                {content}
            </ContentContainer>
        </section>
    )
}

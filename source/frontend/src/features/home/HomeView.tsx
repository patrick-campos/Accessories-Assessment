import { Button, MasterHeader } from "@/shared/ui";
import { ContentContainer } from "@/shared/ui/ContentContainer";
import { DefaultText } from "@/shared/ui/DefaultText";
import { TitleText } from "@/shared/ui/Title";
import { routes } from "@/features/pages/routes";
import { useRouter } from "next/router";

export function HomeView(): JSX.Element {

    const router = useRouter();

    function NavigateToQuote() {
        void router.push(routes.quote);
    }

    return (
        <section className="h-screen w-screen">
            <div>
                <MasterHeader className="border-none" />
                <div className="w-full bg-[#f4f4f4] px-[3.6rem] py-[1.2rem]">
                    <p className="text-subtitle text-center">Free pick-up & fast payment | <a href="/quote">Start selling</a></p>
                </div>
            </div>
            <ContentContainer>
                <div className="pt-[2.6rem] px-[4.8rem] relative max-lg:px-0 max-lg:pt-0">
                    <img className="w-full h-full object-cover" src="/images/home_brand.jpeg" />
                    <div className="absolute inset-0 flex items-center justify-center text-title max-lg:hidden w-[15%] m-auto lg:w-[40rem]">
                        <TitleText className="font-body text-white font-bold text-center max-lg:text-[3rem] text-[4.8rem]">SELL YOUR DESIGNER BAGS</TitleText>
                    </div>
                    <div className="hidden max-lg:flex max-lg:items-center max-lg:justify-center max-lg:mt-[4rem] w-[60%] mx-auto">
                        <TitleText className="font-body text-black font-bold text-center max-lg:text-[3rem] leading-[100%]">SELL YOUR DESIGNER BAGS</TitleText>
                    </div>
                </div>
                <div className="w-[50%] mx-auto py-[7.2rem] flex flex-col gap-[4.8rem] max-sm:w-[95%] max-lg:w-[80%] max-lg:py-[2.4rem] bold">
                    <DefaultText className="w-full text-center text-emphasis max-lg:text-subtitle leading-[1.275]">Clear space in your wardrobe and earn Farfetch credit by selling you designer bags through our Second Life service.*</DefaultText>
                    <Button onClick={NavigateToQuote} className="rounded-[0.4rem] h-[4.4rem] w-[14%] mx-auto text-subtitle p-[1.1rem] max-sm:w-[30%]" variant={'outline'}> Start selling</Button>
                </div>
            </ContentContainer>
        </section>
    )
}

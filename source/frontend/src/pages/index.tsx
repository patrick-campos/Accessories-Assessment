import Head from "next/head";
import { QuoteRequestController } from "@/features/quote-request/QuoteRequestController";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Luxclusif - Request Quote</title>
        <meta name="description" content="Request a quote for your luxury items." />
      </Head>
      <QuoteRequestController />
    </>
  );
}

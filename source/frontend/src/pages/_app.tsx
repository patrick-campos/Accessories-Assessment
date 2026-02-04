import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/styles/globals.css";
import { bodyFont, displayFont } from "@/shared/styles/fonts";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={`${displayFont.variable} ${bodyFont.variable}`}>
        <Component {...pageProps} />
      </div>
    </QueryClientProvider>
  );
}

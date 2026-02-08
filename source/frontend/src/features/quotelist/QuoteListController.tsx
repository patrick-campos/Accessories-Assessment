import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RestClient } from "@/shared/api";
import { LoadingOverlay } from "@/shared";
import { QuoteListItemCard, QuoteListView } from "./QuoteListView";

type QuoteListResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  items: QuoteSummary[];
};

type QuoteSummary = {
  id: string;
  createdAt: string;
  status: string;
  reference: string;
  items: QuoteItem[];
};

type QuoteItem = {
  model: string;
  brand: { name: string };
  files: Array<{ location: string; metadata: { photoSubtype: string } }>;
};

type QuoteCard = {
  id: string;
  reference: string;
  createdAtLabel: string;
  status: string;
  brandName: string;
  model: string;
  imageUrl: string;
};

export function QuoteListController() {
  const apiOrigin = React.useMemo(() => process.env.NEXT_PUBLIC_API_ORIGIN ?? null, []);
  const restClient = React.useMemo(() => (apiOrigin ? new RestClient(apiOrigin) : null), [apiOrigin]);

  const { data, isLoading } = useQuery({
    queryKey: ["quote-list", apiOrigin],
    queryFn: async () => {
      if (!restClient) {
        return null;
      }
      return restClient.get<QuoteListResponse>("/quote?pageNumber=1");
    },
    enabled: Boolean(restClient),
  });

  if (isLoading) {
    return <LoadingOverlay isVisible />;
  }

  const items = data?.items ?? [];
  const cards = items.map((quote) => {
    const firstItem = quote.items[0];
    let imageUrl = "";
    if (firstItem && firstItem.files && firstItem.files.length) {
      const front = firstItem.files.find((file) => file.metadata.photoSubtype === "Front");
      if (front && front.location) {
        imageUrl = front.location;
      } else if (firstItem.files[0] && firstItem.files[0].location) {
        imageUrl = firstItem.files[0].location;
      }
    }

    return {
      id: quote.id,
      reference: quote.reference,
      createdAtLabel: new Date(quote.createdAt).toLocaleDateString(),
      status: quote.status,
      brandName: firstItem?.brand?.name ?? "",
      model: firstItem?.model ?? "",
      imageUrl
    };
  });

  const content = cards.map((card) => (
    <QuoteListItemCard key={card.id} {...card} />
  ));

  return <QuoteListView items={content} />;
}

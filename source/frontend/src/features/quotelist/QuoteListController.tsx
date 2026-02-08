import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RestClient } from "@/shared/api";
import { QuoteListView } from "./QuoteListView";

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
  countryOfOrigin: string;
  items: QuoteItem[];
};

type QuoteItem = {
  id: string;
  model: string;
  brand: { id: string; name: string };
  files: Array<{ id: string; location: string; metadata: { photoSubtype: string } }>;
};

export function QuoteListController() {
  const apiOrigin = React.useMemo(() => process.env.NEXT_PUBLIC_API_ORIGIN ?? null, []);
  const restClient = React.useMemo(() => (apiOrigin ? new RestClient(apiOrigin) : null), [apiOrigin]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["quote-list", apiOrigin],
    queryFn: async () => {
      if (!restClient) {
        return null;
      }
      return restClient.get<QuoteListResponse>("/quote?pageNumber=1");
    },
    enabled: Boolean(restClient),
  });

  const items = data?.items ?? [];

  return (
    <QuoteListView
      items={items}
      isLoading={isLoading}
      error={error ? "Falha ao carregar as quotes" : null}
    />
  );
}

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { RestClient } from "@/shared/api";
import { defaultSchema, type FormSchema } from "../schema";
import type { DynamicQuestion, ItemDetails } from "../types/quoteRequestTypes";
import { normalizeSchema } from "./quoteRequestUtils";

type ListResponse<T> = { items: T[] };
type EntriesResponse<T> = { entries: T[] };

type CountryDto = { isoCode: string; name: string };
type CategoryDto = { id: string; name: string };
type BrandDto = { id: string; name: string };
type AttributeOptionDto = {
  id: string;
  name: string;
  key: string;
  displayOrder: number;
  outputLabel: string;
};
type AttributeDto = {
  id: string;
  name: string;
  key: string;
  displayOrder: number;
  type: string;
  options: AttributeOptionDto[];
  isRequired: boolean;
  businessModel: string;
};

export function useQuoteRequestQueries(draftItem: ItemDetails) {
  const apiOrigin = React.useMemo(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_API_ORIGIN;
    if (configuredOrigin) {
      return configuredOrigin;
    }
    const fallbackEndpoint = process.env.NEXT_PUBLIC_REQUEST_QUOTE_URL;
    if (fallbackEndpoint) {
      return new URL(fallbackEndpoint).origin;
    }
    return null;
  }, []);

  const restClient = React.useMemo(() => (apiOrigin ? new RestClient(apiOrigin) : null), [apiOrigin]);
  const hasAvailableBuyer = true;

  const countriesQuery = useQuery({
    queryKey: ["countries", apiOrigin],
    queryFn: async () => {
      if (!restClient) {
        return { items: [] } satisfies ListResponse<CountryDto>;
      }
      return restClient.get<ListResponse<CountryDto>>("/countries");
    },
    enabled: Boolean(restClient),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories", apiOrigin, draftItem.country, hasAvailableBuyer],
    queryFn: async () => {
      if (!restClient || !draftItem.country) {
        return { items: [] } satisfies ListResponse<CategoryDto>;
      }
      const params = new URLSearchParams({
        countryISOCode: draftItem.country,
        hasAvailableBuyer: String(hasAvailableBuyer),
      });
      return restClient.get<ListResponse<CategoryDto>>(`/categories?${params.toString()}`);
    },
    enabled: Boolean(restClient && draftItem.country),
  });

  const brandsQuery = useQuery({
    queryKey: ["brands", apiOrigin, draftItem.category, draftItem.country, hasAvailableBuyer],
    queryFn: async () => {
      if (!restClient || !draftItem.category || !draftItem.country) {
        return { entries: [] } satisfies EntriesResponse<BrandDto>;
      }
      const params = new URLSearchParams({
        categoryId: draftItem.category,
        countryIsoCode: draftItem.country,
        hasAvailableBuyer: String(hasAvailableBuyer),
      });
      return restClient.get<EntriesResponse<BrandDto>>(`/brands?${params.toString()}`);
    },
    enabled: Boolean(restClient && draftItem.category && draftItem.country),
  });

  const attributesQuery = useQuery({
    queryKey: ["attributes", apiOrigin, draftItem.category],
    queryFn: async () => {
      if (!restClient || !draftItem.category) {
        return { items: [] } satisfies ListResponse<AttributeDto>;
      }
      return restClient.get<ListResponse<AttributeDto>>(
        `/categories/${encodeURIComponent(draftItem.category)}/attributes`
      );
    },
    enabled: Boolean(restClient && draftItem.category),
  });

  const parsedAttributes = React.useMemo<DynamicQuestion[]>(() => {
    const attributes = attributesQuery.data?.items ?? [];
    type ParsedStage = DynamicQuestion["stage"];

    function parseKey(value: string): { stage: ParsedStage; field: string; title: string } {
      const parts = value.split(":");
      if (parts.length < 2) {
        return { stage: "unknown", field: "", title: "" };
      }
      const stageAndRest = parts.slice(1).join(":");
      const marker = ".attributes.";
      const index = stageAndRest.indexOf(marker);
      if (index < 0) {
        return { stage: "unknown", field: "", title: "" };
      }
      const stage = stageAndRest.slice(0, index);
      const remainder = stageAndRest.slice(index + marker.length);
      const segments = remainder.split(".");
      const field = segments[0] ?? "";
      const title = segments.slice(1).join(".") || "";
      const normalizedStage: ParsedStage =
        stage === "item-details" || stage === "item-photos" ? stage : "unknown";
      return { stage: normalizedStage, field, title };
    }

    return attributes.map((attribute) => {
      const { stage, field, title } = parseKey(attribute.key);
      return {
        id: attribute.id,
        name: attribute.name,
        key: attribute.key,
        stage,
        field,
        type: attribute.type,
        isRequired: attribute.isRequired,
        displayOrder: attribute.displayOrder,
        options: attribute.options.map((option) => ({
          id: option.id,
          label: option.outputLabel || option.name,
        })),
      };
    });
  }, [attributesQuery.data?.items]);

  const detailAttributes = React.useMemo(
    () =>
      parsedAttributes
        .filter((attribute) => attribute.stage === "item-details")
        .sort((left, right) => left.displayOrder - right.displayOrder),
    [parsedAttributes]
  );

  const photoAttributes = React.useMemo(
    () =>
      parsedAttributes
        .filter((attribute) => attribute.stage === "item-photos")
        .sort((left, right) => left.displayOrder - right.displayOrder),
    [parsedAttributes]
  );

  const schema = React.useMemo<FormSchema>(() => {
    const countries =
      countriesQuery.data?.items.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })) ?? [];
    const categories =
      categoriesQuery.data?.items.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? [];
    const brands =
      brandsQuery.data?.entries.map((brand) => ({
        value: brand.id,
        label: brand.name,
      })) ?? [];

    return normalizeSchema({
      steps: defaultSchema.steps,
      options: {
        countries,
        categories,
        brands,
      },
    });
  }, [
    brandsQuery.data?.entries,
    categoriesQuery.data?.items,
    countriesQuery.data?.items,
  ]);

  const isLoading =
    countriesQuery.isLoading ||
    categoriesQuery.isLoading ||
    brandsQuery.isLoading ||
    attributesQuery.isLoading;
  const error =
    countriesQuery.error ?? categoriesQuery.error ?? brandsQuery.error ?? attributesQuery.error;

  return {
    apiOrigin,
    restClient,
    schema,
    detailAttributes,
    photoAttributes,
    isLoading,
    error,
  };
}

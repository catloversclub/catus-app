import { apiClient } from "@/api/client";
import {
  AutocompleteResult,
  SearchAutocompleteParams,
  SearchParams,
  SearchResult,
} from "./types";

const BASE_URL = "/search";

const SEARCH_ENDPOINTS = {
  BASE: BASE_URL,
  AUTOCOMPLETE: `${BASE_URL}/autocomplete`,
} as const;

export const search = async (params: SearchParams): Promise<SearchResult> => {
  const { data } = await apiClient.get<SearchResult>(SEARCH_ENDPOINTS.BASE, {
    params,
  });
  return data;
};

export const searchAutocomplete = async (
  params: SearchAutocompleteParams,
): Promise<AutocompleteResult> => {
  const { data } = await apiClient.get<AutocompleteResult>(
    SEARCH_ENDPOINTS.AUTOCOMPLETE,
    { params },
  );
  return data;
};

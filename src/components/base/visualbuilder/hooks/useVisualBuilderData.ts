import { useEffect, useMemo, useState } from "react";
import { useDecision } from "@optimizely/react-sdk";
import { useQuery } from "@apollo/client";
import { VisualBuilder } from "../queries/VisualBuilderQuery";
import { Preview } from "../queries/PreviewQuery";
import { SearchResultsCitiesDocument } from "@/graphql/graphql";
import { getFirstItem, isSearchResultsQuery } from "../VisualBuilderUtils";
import { onContentSaved } from "@/helpers/onContentSaved";

// Extract the path from a URL, matching /en/ and everything after
function extractPath(url: string) {
  const decodedUrl = decodeURIComponent(url);
  const match = decodedUrl.match(/\/en\/.*/);
  return match ? match[0] : null;
}

// Get the orderBy object for the search query, using a feature flag if available
function getOrderByFromFeatureFlag() {
  const [searchRanking] = useDecision("search_algorithm");
  const ranking = searchRanking?.variables?.search_algorithm;
  // Return feature flag variable if it exists, otherwise return default ranking
  return ranking ? ranking : { _ranking: "SEMANTIC", _semanticWeight: 0.9 };
}

// Determine which query mode to use: search, preview, or default
function getQueryMode({ contentKey, searchQuery }: { contentKey?: string; searchQuery?: string }) {
  if (searchQuery) return "search";
  if (contentKey) return "preview";
  return "default";
}

// Select the correct query document and variables based on mode
function getQueryAndVariables({ version, contentKey, url, searchQuery }: any, orderBy: any) {
  const mode = getQueryMode({ contentKey, searchQuery });
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const urlPath = isInIframe && url ? extractPath(url) : url;

  const variables = {
    version,
    key: contentKey,
    url: urlPath,
    searchQuery,
  };

  switch (mode) {
    case "search":
      // Use the search results query and include orderBy
      return {
        queryDocument: SearchResultsCitiesDocument,
        queryVariables: { ...variables, orderBy },
        mode,
      };
    case "preview":
      // Use the preview query
      return {
        queryDocument: Preview,
        queryVariables: variables,
        mode,
      };
    default:
      // Use the default visual builder query
      return {
        queryDocument: VisualBuilder,
        queryVariables: variables,
        mode,
      };
  }
}

// Main hook for fetching and processing visual builder data
export function useVisualBuilderData(props: any) {
  const { version, contentKey, url, searchQuery } = props;
  const [hasLoaded, setHasLoaded] = useState(false);

  // Get orderBy from feature flag or default
  const orderBy = getOrderByFromFeatureFlag();

  // Select query and variables based on mode
  const { queryDocument, queryVariables, mode } = useMemo(
    () => getQueryAndVariables({ version, contentKey, url, searchQuery }, orderBy),
    [version, contentKey, url, searchQuery, orderBy]
  );
  const isSearchMode = mode === "search";
  const isPreview = mode === "preview";

  // Fetch data using Apollo useQuery
  const { data, refetch, error, loading } = useQuery(queryDocument, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: () => setHasLoaded(true),
  });

  // Listen for content save events and refetch data if needed
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;

    function refetchOnContentSaved(event: any) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const newVersion = event.contentLink?.split("_")?.at(-1);
        if (newVersion) {
          logQueryVariables(queryVariables);
          refetch(isPreview ? { ...queryVariables, version: newVersion } : queryVariables);
        }
      }, 1000);
    }

    const unsubscribe = onContentSaved(refetchOnContentSaved);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, queryVariables, isPreview]);

  // Log query variables whenever they change
  function logQueryVariables(vars: any) {
    console.log("Apollo useQuery variables:", vars);
  }

  // Process the returned data into a consistent structure
  const processedData = useMemo(() => {
    if (isSearchMode) {
      // Only access _Component for search results
      const searchResults = isSearchResultsQuery(data) ? data?._Component?.items ?? [] : [];
      return {
        experience: undefined,
        page: undefined,
        searchResult: getFirstItem(searchResults),
      };
    }
    // For non-search mode, safely access _Experience and CityPage if they exist
    const experiences = (data && (data as any)._Experience?.items) || [];
    const pages = (data && (data as any).CityPage?.items) || [];
    return {
      experience: getFirstItem(experiences),
      page: getFirstItem(pages),
      searchResult: undefined,
    };
  }, [data, isSearchMode]);

  return { loading, hasLoaded, processedData };
}

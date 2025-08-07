import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { getFirstItem, isSearchResultsQuery } from "../utils/VisualBuilderUtils";
import { onContentSaved } from "../lib/cms";
import { useSearchRanking } from "./useSearchRanking";
import { selectQuery } from "../utils/querySelector";

interface PageParams {
  version?: string;
  contentKey?: string;
  url?: string;
  searchQuery?: string;
}

/**
 * Main hook for fetching and processing Optimizely CMS content
 * Handles 3 scenarios: regular pages, search results, and preview mode
 */
export function useVisualBuilderData(params: PageParams, initialData?: any) {
  const [hasLoaded, setHasLoaded] = useState(!!initialData);
  const [data, setData] = useState(initialData);

  // Get search ranking from Optimizely Feature Experimentation
  const searchOrderBy = useSearchRanking();

  // Select the appropriate GraphQL query
  const { queryDocument, queryVariables, mode } = useMemo(
    () => selectQuery(params, searchOrderBy),
    [params.version, params.contentKey, params.url, params.searchQuery, searchOrderBy]
  );

  // Fetch data from Optimizely Graph (skip if initialData is present)
  const { data: clientData, refetch, loading } = useQuery(queryDocument, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: () => setHasLoaded(true),
    skip: !!initialData,
  });

  useEffect(() => {
    if (!initialData && clientData) {
      setData(clientData);
    }
  }, [clientData, initialData]);

  // Listen for CMS content changes (Visual Builder integration)
  useContentSavedListener(refetch, queryVariables, mode === "preview");

  // Process the GraphQL response into a consistent format
  const processedData = useMemo(() => {
    return processGraphQLData(data, mode);
  }, [data, mode]);

  return { loading: !hasLoaded && loading, hasLoaded, processedData };
}

/**
 * Listen for content save events from Optimizely CMS Visual Builder
 */
function useContentSavedListener(refetch: any, queryVariables: any, isPreview: boolean) {
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const handleContentSaved = (event: any) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      
      debounceTimer = setTimeout(() => {
        const contentIdArray = event.contentLink.split("_");
        if (contentIdArray.length > 1) {
          const newVersion = contentIdArray.at(-1);
          console.log("Content saved, refetching with version:", newVersion);

          refetch(isPreview ? { ...queryVariables, version: newVersion } : queryVariables);
        }
      }, 1000);
    };

    const unsubscribe = onContentSaved(handleContentSaved);
    
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, queryVariables, isPreview]);
}

/**
 * Process GraphQL response data into a consistent structure
 */
function processGraphQLData(data: any, mode: string) {
  if (mode === "search") {
    const searchResults = isSearchResultsQuery(data) ? data?._Component?.items ?? [] : [];
    return {
      experience: undefined,
      page: undefined,
      searchResult: getFirstItem(searchResults),
    };
  }

  // For regular pages and preview mode
  const experiences = (data && data._Experience?.items) || [];
  const pages = (data && data.CityPage?.items) || [];
  
  return {
    experience: getFirstItem(experiences),
    page: getFirstItem(pages),
    searchResult: undefined,
  };
}

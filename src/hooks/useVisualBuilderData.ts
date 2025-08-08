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
 * 
 * Handles 3 distinct scenarios:
 * 1. Regular Pages: Standard CMS content delivery
 * 2. Preview Mode: Live editing with Visual Builder integration
 * 3. Search Mode: Content search with feature flag-based ranking
 */
export function useVisualBuilderData(params: PageParams, initialData?: any) {
  const [hasLoaded, setHasLoaded] = useState(!!initialData);
  const [data, setData] = useState(initialData);

  // Get search ranking from Optimizely Feature Experimentation (search mode only)
  const searchOrderBy = useSearchRanking();

  // Determine query mode and select appropriate GraphQL query
  const { queryDocument, queryVariables, mode } = useMemo(
    () => selectQuery(params, searchOrderBy),
    [params.version, params.contentKey, params.url, params.searchQuery, searchOrderBy]
  );

  // Fetch data from Optimizely Graph (skip if SSR data is present)
  const { data: clientData, refetch, loading } = useQuery(queryDocument, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: () => setHasLoaded(true),
    skip: !!initialData,
  });

  // Update client data when available
  useEffect(() => {
    if (!initialData && clientData) {
      setData(clientData);
    }
  }, [clientData, initialData]);

  // PREVIEW MODE ONLY: Listen for Visual Builder content changes
  if (mode === "preview") {
    usePreviewModeListener(refetch, queryVariables);
  }

  // Process GraphQL response based on mode
  const processedData = useMemo(() => {
    return processDataByMode(data, mode);
  }, [data, mode]);

  return { loading: !hasLoaded && loading, hasLoaded, processedData };
}

/**
 * Preview Mode: Handle Visual Builder integration
 * Sets up content save listener with debouncing for live editing
 */
function usePreviewModeListener(refetch: any, queryVariables: any) {
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const handleContentSaved = (event: any) => {
      // Clear previous timer to reset debounce window
      if (debounceTimer) clearTimeout(debounceTimer);
      
      // Debounce refetch calls to prevent API spam during rapid edits
      debounceTimer = setTimeout(() => {
        try {
          const contentIdArray = event?.contentLink?.split("_");
          if (contentIdArray && contentIdArray.length > 1) {
            const newVersion = contentIdArray.at(-1);
            console.log("Preview content saved, refetching with version:", newVersion);

            // Update variables with new version for preview
            const updatedVariables = { ...queryVariables, version: newVersion };
            refetch(updatedVariables);
          }
        } catch (error) {
          console.warn("Failed to handle content save event:", error);
          // Fallback: refetch with original variables
          refetch(queryVariables);
        }
      }, 500); // 500ms debounce
    };

    const unsubscribe = onContentSaved(handleContentSaved);
    
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, queryVariables]);
}

/**
 * Process GraphQL data based on the current mode
 * 
 * Search Mode: Returns search results from _Component query
 * Regular/Preview Mode: Returns experiences and pages from standard queries
 */
function processDataByMode(data: any, mode: string) {
  switch (mode) {
    case "search":
      return processSearchData(data);
    case "preview":
    case "default":
      return processStandardData(data);
    default:
      return processStandardData(data);
  }
}

/**
 * Search Mode: Process search results
 */
function processSearchData(data: any) {
  const searchResults = isSearchResultsQuery(data) ? data?._Component?.items ?? [] : [];
  return {
    experience: undefined,
    page: undefined,
    searchResult: getFirstItem(searchResults),
  };
}

/**
 * Regular/Preview Mode: Process standard CMS content
 */
function processStandardData(data: any) {
  const experiences = (data && data._Experience?.items) || [];
  const pages = (data && data.CityPage?.items) || [];
  
  return {
    experience: getFirstItem(experiences),
    page: getFirstItem(pages),
    searchResult: undefined,
  };
}

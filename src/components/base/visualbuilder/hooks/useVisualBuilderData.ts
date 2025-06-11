import { useEffect, useMemo, useState } from "react";
import { useDecision } from "@optimizely/react-sdk";
import { useQuery } from "@apollo/client";
import { VisualBuilder } from "../queries/VisualBuilderQuery";
import { Preview } from "../queries/PreviewQuery";
import { SearchResultsCitiesDocument } from "@/graphql/graphql";
import { getFirstItem, isSearchResultsQuery } from "../VisualBuilderUtils";
import { onContentSaved } from "@/helpers/onContentSaved";

function extractPath(url: string) {
  const decodedUrl = decodeURIComponent(url);
  const match = decodedUrl.match(/\/en\/.*/);
  return match ? match[0] : null;
}

function getOrderByFromFeatureFlag() {
  const [searchRanking] = useDecision("search_algorithm");
  return searchRanking.enabled
    ? { _ranking: "SEMANTIC", _semanticWeight: 0.9 }
    : { _ranking: "RELEVANCE" };
}

function getQueryMode({ contentKey, searchQuery }: { contentKey?: string; searchQuery?: string }) {
  if (searchQuery) return "search";
  if (contentKey) return "preview";
  return "default";
}

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
      return {
        queryDocument: SearchResultsCitiesDocument,
        queryVariables: { ...variables, orderBy },
        mode,
      };
    case "preview":
      return {
        queryDocument: Preview,
        queryVariables: variables,
        mode,
      };
    default:
      return {
        queryDocument: VisualBuilder,
        queryVariables: variables,
        mode,
      };
  }
}

export function useVisualBuilderData(props: any) {
  const { version, contentKey, url, searchQuery } = props;
  const [hasLoaded, setHasLoaded] = useState(false);

  const orderBy = getOrderByFromFeatureFlag();

  const { queryDocument, queryVariables, mode } = useMemo(
    () => getQueryAndVariables({ version, contentKey, url, searchQuery }, orderBy),
    [version, contentKey, url, searchQuery, orderBy]
  );
  const isSearchMode = mode === "search";
  const isPreview = mode === "preview";

  const { data, refetch, error, loading } = useQuery(queryDocument, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    onCompleted: () => setHasLoaded(true),
  });

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
    const handleContentSaved = (event: any) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const contentIdArray = event.contentLink.split("_");
        if (contentIdArray.length > 1) {
          const newVersion = contentIdArray.at(-1);
          refetch(isPreview ? { ...queryVariables, version: newVersion } : queryVariables);
        }
      }, 1000);
    };
    const unsubscribe: any = onContentSaved(handleContentSaved);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, queryVariables, isPreview]);

  const processedData = useMemo(() => {
    const experiences = !isSearchMode ? data?._Experience?.items ?? [] : [];
    const pages = !isSearchMode ? data?.CityPage?.items ?? [] : [];
    const searchResults = isSearchMode && isSearchResultsQuery(data) ? data._Component?.items ?? [] : [];
    return {
      experience: getFirstItem(experiences),
      page: getFirstItem(pages),
      searchResult: getFirstItem(searchResults),
    };
  }, [data, isSearchMode]);

  return { loading, hasLoaded, processedData };
}

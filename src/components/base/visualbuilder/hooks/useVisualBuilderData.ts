import { useEffect, useMemo, useState } from "react";
import { useDecision } from "@optimizely/react-sdk";
import { useQuery } from "@apollo/client";
import { VisualBuilder } from "../queries/VisualBuilderQuery";
import { Preview } from "../queries/PreviewQuery";
import { SearchResultsCitiesDocument } from "@/graphql/graphql";
import { getFirstItem, isSearchResultsQuery } from "../VisualBuilderUtils";
import { onContentSaved } from "@/helpers/onContentSaved";

export function useVisualBuilderData(props: any) {
  const { version, contentKey, url, searchQuery } = props;
  const [hasLoaded, setHasLoaded] = useState(false);

  function extractPath(url: string) {
    const decodedUrl = decodeURIComponent(url);
    const match = decodedUrl.match(/\/en\/.*/);
    return match ? match[0] : null;
  }

  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const urlPath = isInIframe && url ? extractPath(url) : url;

  const variables = useMemo(
    () => ({
      version,
      key: contentKey,
      url: urlPath,
      searchQuery,
    }),
    [version, contentKey, url, searchQuery]
  );

  const isSearchMode = Boolean(searchQuery);
  const isPreview = Boolean(contentKey && !isSearchMode);

  const [searchRanking] = useDecision("search_algorithm");
  console.log(searchRanking)
  const orderBy = searchRanking.enabled
    ? { _ranking: "SEMANTIC", _semanticWeight: 0.9 }
    : { _ranking: "RELEVANCE" };

    console.log("Order By:", orderBy);
  const queryDocument: any = isSearchMode
    ? SearchResultsCitiesDocument
    : isPreview
      ? Preview
      : VisualBuilder;

  const queryVariables = isSearchMode
    ? { ...variables, orderBy }
    : variables;

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
          refetch(isPreview ? { ...variables, version: newVersion } : variables);
        }
      }, 1000);
    };
    const unsubscribe: any = onContentSaved(handleContentSaved);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, variables, isPreview]);

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

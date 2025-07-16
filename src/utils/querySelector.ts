import { VisualBuilder } from "../queries/VisualBuilderQuery";
import { Preview } from "../queries/PreviewQuery";
import { SearchResultsCitiesDocument } from "@/graphql/graphql";

/**
 * Utility to select the correct GraphQL query based on page type
 * Makes it easy to understand what query is used when
 */

export type QueryMode = "search" | "preview" | "default";

interface QueryConfig {
  queryDocument: any;
  queryVariables: any;
  mode: QueryMode;
}

interface PageParams {
  version?: string;
  contentKey?: string;
  url?: string;
  searchQuery?: string;
}

/**
 * Determine which type of query to use based on the page parameters
 */
export function getQueryMode(params: PageParams): QueryMode {
  if (params.searchQuery) return "search";
  if (params.contentKey) return "preview";
  return "default";
}

/**
 * Get the appropriate GraphQL query and variables for the current page
 */
export function selectQuery(params: PageParams, searchOrderBy: any): QueryConfig {
  const mode = getQueryMode(params);
  const urlPath = getCleanUrl(params.url);

  const baseVariables = {
    version: params.version,
    key: params.contentKey,
    url: urlPath,
    searchQuery: params.searchQuery,
  };

  switch (mode) {
    case "search":
      return {
        queryDocument: SearchResultsCitiesDocument,
        queryVariables: { ...baseVariables, orderBy: searchOrderBy },
        mode,
      };
    case "preview":
      return {
        queryDocument: Preview,
        queryVariables: baseVariables,
        mode,
      };
    default:
      return {
        queryDocument: VisualBuilder,
        queryVariables: baseVariables,
        mode,
      };
  }
}

/**
 * Clean URL for iframe context (Visual Builder)
 */
function getCleanUrl(url?: string): string | undefined {
  if (!url) return url;
  
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  if (!isInIframe) return url;
  
  // Extract path from URL when in iframe
  const decodedUrl = decodeURIComponent(url);
  const match = decodedUrl.match(/\/en\/.*/);
  return match ? match[0] : url;
}
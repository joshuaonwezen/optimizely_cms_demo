/**
 * Optimizely CMS Demo - Type Definitions
 * Centralized type definitions for better type safety and demo clarity
 */

import type { NormalizedCacheObject } from '@apollo/client';
import type { GetServerSidePropsResult } from 'next';

/**
 * Page parameters that determine how content is fetched and displayed
 */
export interface PageParams {
  /** Search query for content search functionality */
  searchQuery?: string;
  /** Content key for direct content access */
  contentKey?: string;
  /** Content version for versioned content access */
  version?: string;
  /** URL path for URL-based content routing */
  url?: string;
}

/**
 * Server-side rendered data structure
 */
export interface SSRData {
  /** Experience composition data from Optimizely CMS */
  _Experience?: any; // TODO: Type with generated GraphQL types
  /** City page data */
  CityPage?: any; // TODO: Type with generated GraphQL types
  /** Search results from Optimizely Graph */
  _Component?: any; // TODO: Type with generated GraphQL types
}

/**
 * Props for the main page component
 */
export interface HomePageProps {
  /** Apollo Client cache state for hydration */
  initialApolloState: NormalizedCacheObject;
  /** Pre-fetched data from server-side rendering (null if fetch failed) */
  ssrData: SSRData | null;
  /** Page parameters that determine content routing */
  pageParams: PageParams;
}

/**
 * Search order configuration for Optimizely Graph queries
 */
export interface SearchOrderBy {
  _ranking: "SEMANTIC" | "RELEVANCE";
  _semanticWeight?: number;
}

/**
 * Feature flag configuration for search ranking
 */
export interface SearchRankingFeatureFlag {
  enabled: boolean;
  variables?: {
    search_algorithm?: SearchOrderBy;
  };
}

/**
 * Query mode types for content fetching
 */
export type QueryMode = "search" | "preview" | "default";

/**
 * Apollo Client configuration
 */
export interface ApolloClientConfig {
  graphUrl: string;
  cmsUrl: string;
  previewToken?: string;
  singleGraphKey?: string;
}

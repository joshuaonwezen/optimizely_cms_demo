import { useDecision } from "@optimizely/react-sdk";

/**
 * Hook to get search ranking configuration from Optimizely Feature Experimentation
 * Controls how search results are ranked and weighted
 */
export function useSearchRanking() {
  const [searchRanking] = useDecision("search_algorithm");
  const ranking = searchRanking?.variables?.search_algorithm;

  // Return experiment value or default
  return ranking || {
    _ranking: "SEMANTIC",
    _semanticWeight: 0.9
  };
}
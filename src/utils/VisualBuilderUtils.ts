/**
 * Utility functions for Visual Builder data processing
 */

/**
 * Get the first item from an array, or null if empty
 */
export const getFirstItem = (items: any[]) => items?.[0] ?? null;

/**
 * Type guard to check if data is a search results query response
 */
export function isSearchResultsQuery(data: any): data is { _Component: { items: any[] } } {
    return !!data?._Component;
}
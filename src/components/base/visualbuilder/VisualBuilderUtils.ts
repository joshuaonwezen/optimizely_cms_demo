export const getFirstItem = (items: any[]) => items?.[0] ?? null;

export function isSearchResultsQuery(data: any): data is { _Component: { items: any[] } } {
  return !!data?._Component;
}

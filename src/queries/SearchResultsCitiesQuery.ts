import { graphql } from "@/graphql";

export const SearchResultsCities = graphql(/* GraphQL */ `
  query SearchResultsCities($searchQuery: String, $orderBy: _ComponentOrderByInput) {
    _Component(
      orderBy: $orderBy
      where: {
        _fulltext: { match: $searchQuery }
      }
    ) {
      items {
        ... on CityBlock {
          Title
          Image {
            key
            url {
              default
            }
          }
          Description {
            html
          }
          _metadata {
            key
          }
        }
      }
    }
  }
`);

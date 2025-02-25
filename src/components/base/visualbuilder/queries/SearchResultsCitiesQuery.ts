import { graphql } from "@/graphql";

export const SearchResultsCities = graphql(/* GraphQL */ `
  query SearchResultsCities($searchQuery: String) {
    _Component(
      orderBy: { _ranking: SEMANTIC, _semanticWeight: 0.9 }
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

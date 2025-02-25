import { graphql } from "@/graphql";

export const Preview = graphql(/* GraphQL */ `
  query Preview($key: String, $version: String) {
    _Experience(
      where: {
        _and: [
          { _metadata: { key: { eq: $key } } }
          { _metadata: { version: { eq: $version } } }
        ]
      }
    ) {
      items {
        composition {
          grids: nodes {
            ... on CompositionStructureNode {
              key
              displaySettings {
                key
                value
              }
              rows: nodes {
                ... on CompositionStructureNode {
                  key
                  columns: nodes {
                    ... on CompositionStructureNode {
                      key
                      elements: nodes {
                        ...compositionComponentNode
                      }
                    }
                  }
                }
              }
            }
          }
        }
        _metadata {
          key
          version
        }
      }
    }
    CityPage(
      where: {
        _and: [
          { _metadata: { key: { eq: $key } } }
          { _metadata: { version: { eq: $version } } }
        ]
      }
    ) {
      items {
        CityReference {
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
  }
`);

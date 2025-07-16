import { graphql } from "@/graphql";

export const VisualBuilder = graphql(/* GraphQL */ `
  query VisualBuilder($url: String) {
    _Experience(where: { _metadata: { url: { default: { eq: $url } } } }) {
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
    CityPage(where: { _metadata: { url: { default: { eq: $url } } } }) {
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

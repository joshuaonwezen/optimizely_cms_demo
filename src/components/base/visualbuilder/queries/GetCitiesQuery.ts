import { graphql } from "@/graphql";

export const GetCities = graphql(/* GraphQL */ `
  query GetCities {
    _Content {
      items {
        ... on CityBlock {
          Title
          _metadata {
            key
          }
        }
      }
    }
  }
`);

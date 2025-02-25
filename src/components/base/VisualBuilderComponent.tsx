import React, { FC, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";

import { graphql } from "@/graphql";
import CompositionNodeComponent from "./CompositionNodeComponent";
import { onContentSaved } from "@/helpers/onContentSaved";
import HeaderElementComponent from "../elements/HeaderElementComponent";
import NoSearchResults from "../elements/NoSearchResults";

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

export const PreviewBuilder = graphql(/* GraphQL */ `
  query PreviewBuilder($key: String, $version: String) {
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

export const SearchResults = graphql(/* GraphQL */ `
  query SearchResults($searchQuery: String) {
    _Component(
      orderBy: { _ranking: SEMANTIC, _semanticWeight: 0.5 }
      where: { _fulltext: { match: $searchQuery } }
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

interface VisualBuilderProps {
  contentKey?: string;
  version?: string;
  url?: string;
  searchQuery?: string;
}

const VisualBuilderComponent: FC<VisualBuilderProps> = ({
  version,
  contentKey,
  url,
  searchQuery,
}) => {
  const variables = useMemo(() => {
    return {
      ...(version && { version }),
      ...(contentKey && { key: contentKey }),
      ...(url && { url }),
      ...(searchQuery && { searchQuery }),
    };
  }, [version, contentKey, url, searchQuery]);

  const isSearchMode = !!searchQuery;
  const isPreview = !!contentKey && !isSearchMode;

  const { data, refetch, error } = useQuery(
    isSearchMode ? SearchResults : isPreview ? PreviewBuilder : VisualBuilder,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    if (data) console.log("GraphQL response data:", data);
  }, [data]);

  if(isPreview){
    useEffect(() => {
      onContentSaved((_) => {
        const contentIdArray = _.contentLink.split("_");
        if (contentIdArray.length > 1) {
          const newVersion = contentIdArray[contentIdArray.length - 1];
          refetch({ ...variables, version: newVersion });
        }
      });
    }, [refetch, variables]);
  }

  const getFirstItem = (items: any[]) => items?.[0] ?? null;

  const experiences = useMemo(() => (!isSearchMode ? data?._Experience?.items ?? [] : []), [data, isSearchMode]);
  const pages = useMemo(() => (!isSearchMode ? data?.CityPage?.items ?? [] : []), [data, isSearchMode]);
  const searchResults = useMemo(() => (isSearchMode ? data?._Component?.items ?? [] : []), [data, isSearchMode]);

  const experience = getFirstItem(experiences);
  const page = getFirstItem(pages);
  const searchResult = getFirstItem(searchResults);

  if (!experience && !page && !searchResult) {
    console.log("No results");
    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <NoSearchResults />
      </div>
    );
  }

  const renderExperienceGrids = (experience: any) => (
    <div className="relative w-full flex-1 vb:outline">
      <HeaderElementComponent />
      {experience?.composition?.grids?.map((grid: any) => {
        const flexDirection =
          grid.displaySettings?.find((setting: any) => setting.key === "defaultBlogStyles")?.value === "Row"
            ? "flex-row"
            : "flex-col";

        return (
          <div
            key={grid.key}
            className={`relative w-full flex ${flexDirection} flex-colflex-nowrap justify-start vb:grid`}
            data-epi-block-id={grid.key}
          >
            {grid.rows?.map((row: any) => (
              <div key={row.key} className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
                {row.columns?.map((column: any) => (
                  <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col" key={column.key}>
                    {column.elements?.map((element: any) => (
                      <div data-epi-block-id={element?.key} key={element?.key}>
                        <CompositionNodeComponent compositionComponentNode={element} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderCityPage = (cityBlock: any) => {
    if (!cityBlock?._metadata) return null;

    const compositionComponentNode: any = { component: { ...cityBlock } };

    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <div
          key={cityBlock._metadata.key}
          className="relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid"
          data-epi-block-id={cityBlock._metadata.key}
        >
          <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
            <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col">
              <div data-epi-block-id={cityBlock._metadata.key}>
                <CompositionNodeComponent compositionComponentNode={compositionComponentNode} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (experience) return renderExperienceGrids(experience);

  if (
    (page && page?.CityReference?.__typename === "CityBlock") ||
    (searchResult && searchResult?.__typename === "CityBlock")
  ) {
    return renderCityPage(page?.CityReference ?? searchResult);
  }

  return null;
};

export default VisualBuilderComponent;

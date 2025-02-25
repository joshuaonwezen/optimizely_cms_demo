import React, { FC, useEffect } from "react";
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
    _Experience(
      orderBy: { _ranking: SEMANTIC, _semanticWeight: 0.5 }
      where: { _fulltext: { match: $searchQuery } }
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
          orderBy: { _ranking: SEMANTIC, _semanticWeight: 0.5 }
          where: { _fulltext: { match: $searchQuery } }
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
    searchQuery
}) => {
    const variables: Record<string, unknown> = {};
    if (version) {
        variables.version = version;
    }

    if (contentKey) {
        variables.key = contentKey;
    }

    if (url) {
        variables.url = url;
    }
    
    if (searchQuery) {
      variables.searchQuery = searchQuery;
  }

    // Check conditions for selecting the correct query
    const isSearchMode = variables.searchQuery !== undefined;
    const isPreview = variables.key !== undefined && !isSearchMode;

    // Select the correct query based on the mode
    const { data, refetch, error } = useQuery(
        isSearchMode ? SearchResults : isPreview ? PreviewBuilder : VisualBuilder,
        {
            variables: variables,
            notifyOnNetworkStatusChange: true,
        }
    );

    if (error) {
        console.error("GraphQL Error:", error.message);
    }

    useEffect(() => {
        if (data) {
            console.log("GraphQL response data:", data);
        }
    }, [data]);

    if (error) {
        console.error("GraphQL Error:", error.message);
    }

    useEffect(() => {
        onContentSaved((_) => {
            const contentIdArray = _.contentLink.split("_");
            if (contentIdArray.length > 1) {
                version = contentIdArray[contentIdArray.length - 1];
                variables.version = version;
            }
            console.log(variables, isPreview);
            refetch(variables);
        });
    }, []);

    const experiences = data?._Experience?.items ?? [];
    const pages = data?.CityPage?.items ?? [];


    const getLastItem = (items: any) => (items.length > 0 ? items[items.length - 1] : null);

    const experience = getLastItem(experiences);
    const page = getLastItem(pages);

    if (!experience && !page) {
      return (
        <div className="relative w-full flex-1 vb:outline">
            <HeaderElementComponent />
            <NoSearchResults/>
        </div>
      )
    }

       // Render grids for an experience
       const renderExperienceGrids = (experience: any) => (
        <div className="relative w-full flex-1 vb:outline">
            <HeaderElementComponent />
            {experience?.composition?.grids?.map((grid: any) => {
                const displaySetting = grid.displaySettings?.find(
                    (setting: any) => setting.key === "defaultBlogStyles"
                );
                const flexDirection = displaySetting?.value === "Row" ? "flex-row" : "flex-col";

                return (
                    <div
                        key={grid.key}
                        className={`relative w-full flex ${flexDirection} flex-colflex-nowrap justify-start vb:grid`}
                        data-epi-block-id={grid.key}
                    >
                        {grid.rows?.map((row: any) => (
                            <div
                                key={row.key}
                                className="flex-1 flex flex-row flex-nowrap justify-start vb:row"
                            >
                                {row.columns?.map((column: any) => (
                                    <div
                                        className="flex-1 flex flex-col flex-nowrap justify-start vb:col"
                                        key={column.key}
                                    >
                                        {column.elements?.map((element: any) => (
                                            <div
                                                data-epi-block-id={element?.key}
                                                key={element?.key}
                                            >
                                                <CompositionNodeComponent
                                                    compositionComponentNode={element}
                                                />
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

    // Render a page with a city reference
    const renderCityPage = (cityBlock: any) => {
        const compositionComponentNode: any = { component: { ...cityBlock } };
        const { _metadata } = cityBlock;

        if (!_metadata) return null;

        return (
            <div className="relative w-full flex-1 vb:outline">
                <HeaderElementComponent />
                <div
                    key={_metadata.key}
                    className="relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid"
                    data-epi-block-id={_metadata.key}
                >
                    <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
                        <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col">
                            <div data-epi-block-id={_metadata.key} key={_metadata.key}>
                                <CompositionNodeComponent
                                    compositionComponentNode={compositionComponentNode}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Main render logic
    if (experience) return renderExperienceGrids(experience);

    if (
        page?.CityReference &&
        page.CityReference.__typename === "CityBlock"
    ) {
        return renderCityPage(page.CityReference);
    }

    return null;
};

export default VisualBuilderComponent;

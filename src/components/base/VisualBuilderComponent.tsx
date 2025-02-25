import React, { FC, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { graphql } from "@/graphql";
import CompositionNodeComponent from "./CompositionNodeComponent";
import { onContentSaved } from "@/helpers/onContentSaved";
import HeaderElementComponent from "../elements/HeaderElementComponent";

export const VisualBuilderQuery = graphql(/* GraphQL */ `
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

export const PreviewBuilderQuery = graphql(/* GraphQL */ `
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

interface VisualBuilderProps {
    contentKey?: string;
    version?: string;
    url?: string;
}

const VisualBuilderComponent: FC<VisualBuilderProps> = ({ version, contentKey, url }) => {
    const variables: Record<string, unknown> = {
        ...(version && { version }),
        ...(contentKey && { key: contentKey }),
        ...(url && { url }),
    };

    const isPreview = !!variables.key;
    const { data, refetch, error } = useQuery(isPreview ? PreviewBuilderQuery : VisualBuilderQuery, {
        variables,
        notifyOnNetworkStatusChange: true,
    });

    useEffect(() => {
        if (data) console.log("GraphQL response data:", data);
    }, [data]);

    useEffect(() => {
        onContentSaved((event) => {
            const contentIdArray = event.contentLink.split("_");
            if (contentIdArray.length > 1) {
                const newVersion = contentIdArray[contentIdArray.length - 1];
                refetch({ ...variables, version: newVersion });
            }
        });
    }, [refetch]);

    if (error) {
        console.error("GraphQL Error:", error.message);
        return null;
    }

    const experiences = data?._Experience?.items || [];
    const pages = data?.CityPage?.items || [];

    if (experiences.length === 0 && pages.length === 0) return null;

    const experience = experiences[experiences.length - 1] || null;
    const page = pages[pages.length - 1] || null;

    if (!experience && !page) return null;

    if (!page) {
        return (
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
                            className={`relative w-full flex ${flexDirection} flex-nowrap justify-start vb:grid`}
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
    } else if (page.CityReference?.__typename === "CityBlock") {
        const cityBlock = page.CityReference;
        const compositionComponentNode: any = {
            component: { ...cityBlock },
        };

        if (!cityBlock._metadata) return null;

        return (
            <div className="relative w-full flex-1 vb:outline">
                <HeaderElementComponent />
                <div
                    key={cityBlock._metadata.key}
                    className="relative w-full flex flex-row flex-nowrap justify-start vb:grid"
                    data-epi-block-id={cityBlock._metadata.key}
                >
                    <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
                        <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col">
                            <div data-epi-block-id={cityBlock._metadata.key} key={cityBlock._metadata.key}>
                                <CompositionNodeComponent compositionComponentNode={compositionComponentNode} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default VisualBuilderComponent;

import React, { FC, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { graphql } from "@/graphql";
import CompositionNodeComponent from "./CompositionNodeComponent";
import { onContentSaved } from "@/helpers/onContentSaved";
import HeaderElementComponent from "../elements/HeaderElementComponent";

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

interface VisualBuilderProps {
    contentKey?: string;
    version?: string;
    url?: string;
}

const VisualBuilderComponent: FC<VisualBuilderProps> = ({
    version,
    contentKey,
    url,
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

    // Check if variables.key is defined
    const isPreview = variables.key !== undefined;

    // Select the correct query based on preview mode
    const { data, refetch, error } = useQuery(
        isPreview ? PreviewBuilder : VisualBuilder,
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

    const experiences = data?._Experience?.items;
    const pages = data?.CityPage?.items;
    
    // Check if at least one array exists and has items
    if ((!experiences || experiences.length === 0) && (!pages || pages.length === 0)) {
      return null;
    }
    
    const experience = experiences && experiences.length > 0 ? experiences[experiences.length - 1] : null;
    const page = pages && pages.length > 0 ? pages[pages.length - 1] : null;
    
    if (!experience && !page) {
      return null;
    }
    

    if (!page) {
        return (
            <div className="relative w-full flex-1 vb:outline">
                <HeaderElementComponent></HeaderElementComponent>
                {experience?.composition?.grids?.map((grid: any) => {
                    const displaySetting = grid.displaySettings?.find(
                        (setting: any) => setting.key === "defaultBlogStyles"
                    );

                    // Determine the class based on the display setting's value
                    const flexDirection =
                        displaySetting?.value === "Row"
                            ? "flex-row"
                            : "flex-col";
                    return (
                        <div
                            key={grid.key}
                            className={`relative w-full flex ${flexDirection} flex-colflex-nowrap justify-start vb:grid`}
                            data-epi-block-id={grid.key}>
                            {grid.rows?.map((row: any) => (
                                <div
                                    key={row.key}
                                    className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
                                    {row.columns?.map((column: any) => (
                                        <div
                                            className="flex-1 flex flex-col flex-nowrap justify-start vb:col"
                                            key={column.key}>
                                            {column.elements?.map(
                                                (element: any) => (
                                                    <div
                                                        data-epi-block-id={
                                                            element?.key
                                                        }
                                                        key={element?.key}>
                                                        <CompositionNodeComponent
                                                            compositionComponentNode={
                                                                element
                                                            }
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        );
    } else if(page?.CityReference) {
        return (
            <div className="relative w-full flex-1 vb:outline">
                <HeaderElementComponent></HeaderElementComponent>
                <div
                    key={page?.CityReference._metadata.key}
                    className={`relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid`}
                    data-epi-block-id={page?.CityReference._metadata.key}>
                    <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
                        <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col">
                            <div
                                data-epi-block-id={
                                    page?.CityReference._metadata.key
                                }
                                key={page?.CityReference._metadata.key}>
                                <CompositionNodeComponent
                                    compositionComponentNode={
                                        page?.CityReference
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default VisualBuilderComponent;

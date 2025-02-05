import React, { FC, useEffect } from "react";
import { useQuery } from "@apollo/client";

import { graphql } from "@/graphql";
import CompositionNodeComponent from "./CompositionNodeComponent";
import { onContentSaved } from "@/helpers/onContentSaved";

export const VisualBuilder = graphql(/* GraphQL */ `
  query VisualBuilder($url: String) {
    _Experience(
      where: { _metadata: { url: { default: { eq: $url } } } }
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
  }
`);


export const PreviewBuilder = graphql(/* GraphQL */ `
  query PreviewBuilder($url: String, $key: String, $version: String) {
    _Experience(
      where: {
        _and: [
          { _metadata: { key: { eq: $key } } },
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

    console.log(variables?.version, variables?.key, variables?.url);
    const { data, refetch, error } = useQuery(VisualBuilder, {
        variables: variables,
        notifyOnNetworkStatusChange: true,
    });
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
            refetch(variables);
        });
    }, []);

    const experiences = data?._Experience?.items;
    if (!experiences) {
        return null;
    }

    const experience: any = experiences[experiences.length - 1];

    if (!experience) {
        return null;
    }

    return (
        <div className="relative w-full flex-1 vb:outline">
            <div className="relative w-full flex-1 vb:outline">
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
        </div>
    );
};

export default VisualBuilderComponent;

import React, { FC, useEffect, useMemo } from "react";
import { useQuery } from "@apollo/client";

import { VisualBuilder } from "../visualbuilder/queries/VisualBuilderQuery";
import { Preview } from "../visualbuilder/queries/PreviewQuery";
import { SearchResultsCities } from "./queries/SearchResultsCitiesQuery";
import { getFirstItem, isSearchResultsQuery } from "./VisualBuilderUtils";
import CompositionNodeComponent from "../CompositionNodeComponent";
import { onContentSaved } from "@/helpers/onContentSaved";
import HeaderElementComponent from "../../elements/HeaderElementComponent";
import NoSearchResults from "../../elements/NoSearchResultsComponent";
import LoadingComponent from "../../elements/LoadingComponent";

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
  const variables = useMemo(
    () => ({
      ...(version && { version }),
      ...(contentKey && { key: contentKey }),
      ...(url && { url }),
      ...(searchQuery && { searchQuery }),
    }),
    [version, contentKey, url, searchQuery]
  );

  const isSearchMode = !!searchQuery;
  const isPreview = !!contentKey && !isSearchMode;

  const { data, refetch, error, loading } = useQuery(
    isSearchMode ? SearchResultsCities : isPreview ? Preview : VisualBuilder,
    {
      variables,
      notifyOnNetworkStatusChange: true,
    }
  );

  useEffect(() => {
    onContentSaved((_) => {
      const contentIdArray = _.contentLink.split("_");
      if (contentIdArray.length > 1) {
        const newVersion = contentIdArray[contentIdArray.length - 1];
        refetch(isPreview ? { ...variables, version: newVersion } : variables);
      }
    });
  }, [refetch, variables, isPreview]);

  const experiences = useMemo(() => (!isSearchMode ? data?._Experience?.items ?? [] : []), [data, isSearchMode]);
  const pages = useMemo(() => (!isSearchMode ? data?.CityPage?.items ?? [] : []), [data, isSearchMode]);

  const searchResults = useMemo(
    () => (isSearchMode && isSearchResultsQuery(data) ? data._Component?.items ?? [] : []),
    [data, isSearchMode]
  );

  const experience = getFirstItem(experiences);
  const page = getFirstItem(pages);
  const searchResult = getFirstItem(searchResults);

  if (loading) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <LoadingComponent />
      </div>
    );
  }

  if (!experience && !page && !searchResult) {
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
      {experience?.composition?.grids?.map((grid: any) => (
        <div
          key={grid.key}
          className={`relative w-full flex ${
            grid.displaySettings?.find((setting: any) => setting.key === "defaultBlogStyles")?.value === "Row"
              ? "flex-row"
              : "flex-col"
          } flex-colflex-nowrap justify-start vb:grid`}
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
      ))}
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

import React, { FC, useEffect, useMemo, useCallback, useState } from "react";
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
  const [hasLoaded, setHasLoaded] = useState(false);

  const variables = useMemo(
    () => ({ version, key: contentKey, url, searchQuery }),
    [version, contentKey, url, searchQuery]
  );

  const isSearchMode = Boolean(searchQuery);
  const isPreview = Boolean(contentKey && !isSearchMode);
  const isInIframe = window.self !== window.top;

  const { data, refetch, error, loading } = useQuery(
    isSearchMode ? SearchResultsCities : isPreview ? Preview : VisualBuilder,
    {
      variables,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      onCompleted: () => setHasLoaded(true), // Mark as loaded when data arrives
    }
  );

  useEffect(() => {
    if (isInIframe) {
      window.addEventListener("load", () => {
        refetch(variables);
      });
    }
  }, [isInIframe, refetch, variables]);  

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null;
  
    const handleContentSaved = (event: any) => {
      if (debounceTimer) clearTimeout(debounceTimer);
  
      debounceTimer = setTimeout(() => {
        const contentIdArray = event.contentLink.split("_");
        if (contentIdArray.length > 1) {
          const newVersion = contentIdArray.at(-1);
          refetch(isPreview ? { ...variables, version: newVersion } : variables);
        }
      }, 1000);
    };
  
    const unsubscribe: any = onContentSaved(handleContentSaved);
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [refetch, variables, isPreview]);
  

  const processedData = useMemo(() => {
    const experiences = !isSearchMode ? data?._Experience?.items ?? [] : [];
    const pages = !isSearchMode ? data?.CityPage?.items ?? [] : [];
    const searchResults = isSearchMode && isSearchResultsQuery(data) ? data._Component?.items ?? [] : [];

    return {
      experience: getFirstItem(experiences),
      page: getFirstItem(pages),
      searchResult: getFirstItem(searchResults),
    };
  }, [data, isSearchMode]);

  const renderExperienceGrids = useCallback(
    (experience: any) => (
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
    ),
    []
  );

  const renderCityPage = useCallback(
    (cityBlock: any) =>
      cityBlock?._metadata && (
        <div className="relative w-full flex-1 vb:outline">
          <HeaderElementComponent />
          <div
            key={cityBlock._metadata.key}
            className="relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid"
            data-epi-block-id={cityBlock._metadata.key}
          >
            <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row">
              <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col">
                <CompositionNodeComponent compositionComponentNode={cityBlock} />
              </div>
            </div>
          </div>
        </div>
      ),
    []
  );

  if (loading && !hasLoaded) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <LoadingComponent />
      </div>
    );
  }

  if (!processedData.experience && !processedData.page && !processedData.searchResult) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <NoSearchResults />
      </div>
    );
  }

  if (processedData.experience) return renderExperienceGrids(processedData.experience);

  if (
    (processedData.page && processedData.page?.CityReference?.__typename === "CityBlock") ||
    (processedData.searchResult && processedData.searchResult?.__typename === "CityBlock")
  ) {
    return renderCityPage(processedData.page?.CityReference ?? processedData.searchResult);
  }

  return null;
};

export default React.memo(VisualBuilderComponent);

import React, { FC } from "react";
import HeaderElementComponent from "../../elements/HeaderElementComponent";
import NoSearchResults from "../../elements/NoSearchResultsComponent";
import SkeletonLoader from "../../elements/SkeletonLoader";
import { useVisualBuilderData } from "./hooks/useVisualBuilderData";
import ExperienceGrids from "./ExperienceGrids";
import CityPage from "./CityPage";

interface VisualBuilderProps {
  contentKey?: string;
  version?: string;
  url?: string;
  searchQuery?: string;
}

const VisualBuilderComponent: FC<VisualBuilderProps> = (props) => {
  const { loading, hasLoaded, processedData } = useVisualBuilderData(props);

  // Determine skeleton type based on query mode and expected content
  const getSkeletonType = () => {
    if (props.searchQuery) return 'search';
    if (processedData.experience) return 'experience';
    if (processedData.page?.CityReference || processedData.searchResult) return 'city';
    return 'default';
  };

  if (loading) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <HeaderElementComponent />
        <SkeletonLoader type={getSkeletonType()} />
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

  if (processedData.experience) return <ExperienceGrids experience={processedData.experience} />;
  if (
    (processedData.page && processedData.page?.CityReference?.__typename === "CityBlock") ||
    (processedData.searchResult && processedData.searchResult?.__typename === "CityBlock")
  ) {
    return <CityPage cityBlock={processedData.page?.CityReference ?? processedData.searchResult} />;
  }

  return null;
};

export default React.memo(VisualBuilderComponent);

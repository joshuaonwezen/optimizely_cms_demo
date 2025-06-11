import React, { FC } from "react";
import HeaderElementComponent from "../../elements/HeaderElementComponent";
import NoSearchResults from "../../elements/NoSearchResultsComponent";
import LoadingComponent from "../../elements/LoadingComponent";
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

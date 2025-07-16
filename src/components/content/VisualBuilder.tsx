import React, { FC } from "react";
import Header from "../layout/Header";
import NoResults from "../ui/NoResults";
import Skeleton from "../ui/Skeleton";
import { useVisualBuilderData } from "../../hooks/useVisualBuilderData";
import Experience from "./Experience";
import CityPage from "./CityPage";

interface VisualBuilderProps {
  contentKey?: string;
  version?: string;
  url?: string;
  searchQuery?: string;
}

const VisualBuilder: FC<VisualBuilderProps> = (props) => {
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
        <Header />
        <Skeleton type={getSkeletonType()} />
      </div>
    );
  }

  if (!processedData.experience && !processedData.page && !processedData.searchResult) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <Header />
        <NoResults />
      </div>
    );
  }

  if (processedData.experience) return <Experience experience={processedData.experience} />;
  if (
    (processedData.page && processedData.page?.CityReference?.__typename === "CityBlock") ||
    (processedData.searchResult && processedData.searchResult?.__typename === "CityBlock")
  ) {
    return <CityPage cityBlock={processedData.page?.CityReference ?? processedData.searchResult} />;
  }

  return null;
};

export default React.memo(VisualBuilder);

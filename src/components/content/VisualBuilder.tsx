import React, { FC, useState, useEffect } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  // Ensure consistent server/client rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Determine skeleton type once and use consistently
  const getSkeletonType = () => {
    if (props.searchQuery) return 'search';
    if (props.contentKey) return 'city';
    return 'experience';
  };

  // Show loading state - use same skeleton type throughout
  if (!isMounted || (loading && !hasLoaded)) {
    return (
      <div className="relative w-full flex-1 vb:outline">
        <Header />
        <Skeleton type={getSkeletonType()} />
      </div>
    );
  }

  // Handle search results first
  if (props.searchQuery) {
    if (processedData.searchResult) {
      return <CityPage cityBlock={processedData.searchResult} />;
    } else if (loading || !hasLoaded) {
      // Still loading search results - show skeleton
      return (
        <div className="relative w-full flex-1 vb:outline">
          <Header />
          <Skeleton type="search" />
        </div>
      );
    } else {
      // Finished loading but no search results found
      return (
        <div className="relative w-full flex-1 vb:outline">
          <Header />
          <NoResults />
        </div>
      );
    }
  }

  // Handle regular content
  if (processedData.experience) return <Experience experience={processedData.experience} />;
  if (processedData.page && processedData.page?.CityReference?.__typename === "CityBlock") {
    return <CityPage cityBlock={processedData.page?.CityReference} />;
  }

  // Show no results only if we have no data at all
  return (
    <div className="relative w-full flex-1 vb:outline">
      <Header />
      <NoResults />
    </div>
  );

  return null;
};

export default React.memo(VisualBuilder);

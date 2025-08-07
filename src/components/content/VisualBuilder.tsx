import React, { FC, useState, useEffect } from "react";
import Header from "../layout/Header";
import NoResults from "../ui/NoResults";
import Skeleton from "../ui/Skeleton";
import { useVisualBuilderData } from "../../hooks/useVisualBuilderData";
import Experience from "./Experience";
import CityPage from "./CityPage";
import { PageParams, SSRData } from "../../types";

/**
 * VisualBuilder Component - Main Content Router
 * 
 * Demonstrates Optimizely SaaS CMS capabilities:
 * - Unified content delivery for experiences, pages, and search
 * - Server-side rendering with client-side hydration
 * - Content type-specific rendering logic
 * - Loading states and error handling
 */

interface VisualBuilderProps extends PageParams {
  /** Pre-fetched server-side data for initial render */
  ssrData?: SSRData | null;
}

const VisualBuilder: FC<VisualBuilderProps> = (props) => {
  // Server-side rendering optimization
  const [ssrUsed, setSsrUsed] = useState(!!props.ssrData);
  const [ssrData, setSsrData] = useState(props.ssrData);
  
  // Custom hook handles all data fetching logic with feature flag support
  const { loading, hasLoaded, processedData } = useVisualBuilderData(
    props, 
    ssrUsed ? ssrData : undefined
  );

  // Ensure SSR data is only used on initial render
  useEffect(() => {
    if (ssrUsed) {
      setSsrUsed(false);
    }
  }, [ssrUsed]);

  // Hydration consistency - prevent server/client mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Determine appropriate skeleton type based on content request
   * Provides visual feedback matching expected content structure
   */
  const getSkeletonType = (): 'search' | 'city' | 'experience' => {
    if (props.searchQuery) return 'search';
    if (props.contentKey) return 'city';
    return 'experience';
  };

  // Initial loading state - show skeleton until mounted and data loads
  if (!isMounted || (loading && !hasLoaded)) {
    return (
      <div 
        className="relative w-full flex-1 vb:outline"
        data-component="visual-builder-loading"
      >
        <Header />
        <Skeleton type={getSkeletonType()} />
      </div>
    );
  }

  // Search Results Flow - Optimizely Graph search demonstration
  if (props.searchQuery) {
    if (processedData.searchResult) {
      return <CityPage cityBlock={processedData.searchResult} />;
    } else if (loading || !hasLoaded) {
      return (
        <div 
          className="relative w-full flex-1 vb:outline"
          data-component="search-loading"
        >
          <Header />
          <Skeleton type="search" />
        </div>
      );
    } else {
      return (
        <div 
          className="relative w-full flex-1 vb:outline"
          data-component="no-search-results"
        >
          <Header />
          <NoResults />
        </div>
      );
    }
  }

  // Content Delivery Flow - Regular CMS content
  if (processedData.experience) {
    return <Experience experience={processedData.experience} />;
  }
  
  if (processedData.page?.CityReference?.__typename === "CityBlock") {
    return <CityPage cityBlock={processedData.page.CityReference} />;
  }

  // Fallback - No content found
  return (
    <div 
      className="relative w-full flex-1 vb:outline"
      data-component="no-content-found"
    >
      <Header />
      <NoResults />
    </div>
  );
};

export default React.memo(VisualBuilder);

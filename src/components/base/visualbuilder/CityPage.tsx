import React from "react";
import HeaderElementComponent from "../../elements/HeaderElementComponent";
import CompositionNodeComponent from "../CompositionNodeComponent";

const CityPage = ({ cityBlock }: { cityBlock: any }) =>
  cityBlock?._metadata && (
    <div className="relative w-full flex-1 vb:outline" data-component="city-page-root">
      <HeaderElementComponent />
      <div
        key={cityBlock._metadata.key}
        className="relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid"
        data-epi-block-id={cityBlock._metadata.key}
        data-component="city-page-grid"
      >
        <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row" data-component="city-page-row">
          <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col" data-component="city-page-col">
            <CompositionNodeComponent compositionComponentNode={cityBlock} />
          </div>
        </div>
      </div>
    </div>
  );

export default CityPage;

import React from "react";
import Header from "../layout/Header";
import Composition from "./Composition";

const CityPage = ({ cityBlock }: { cityBlock: any }) =>
  cityBlock?._metadata && (
    <div className="relative w-full flex-1 vb:outline" data-component="city-page-root">
      <Header />
      <div
        key={cityBlock._metadata.key}
        className="relative w-full flex flex-row flex-colflex-nowrap justify-start vb:grid"
        data-epi-block-id={cityBlock._metadata.key}
        data-component="city-page-grid"
      >
        <div className="flex-1 flex flex-row flex-nowrap justify-start vb:row" data-component="city-page-row">
          <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col" data-component="city-page-col">
            <Composition compositionComponentNode={cityBlock} />
          </div>
        </div>
      </div>
    </div>
  );

export default CityPage;

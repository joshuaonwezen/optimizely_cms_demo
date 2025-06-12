import React from "react";
import HeaderElementComponent from "../../elements/HeaderElementComponent";
import CompositionNodeComponent from "../CompositionNodeComponent";

const ExperienceGrids = ({ experience }: { experience: any }) => (
  <div className="relative w-full flex-1 vb:outline" data-component="experience-grids-root">
    <HeaderElementComponent />
    {experience?.composition?.grids?.map((grid: any, gridIdx: number) => (
      <div
        key={grid.key ?? `grid-${gridIdx}`}
        className={`relative w-full flex ${
          grid.displaySettings?.find((setting: any) => setting.key === "defaultBlogStyles")?.value === "Row"
            ? "flex-row"
            : "flex-col"
        } flex-nowrap justify-start vb:grid`}
        data-epi-block-id={grid.key}
        data-component="experience-grids-grid"
      >
        {grid.rows?.map((row: any, rowIdx: number) => (
          <div key={row.key ?? `row-${rowIdx}`} className="flex-1 flex flex-row flex-nowrap justify-start vb:row" data-component="experience-grids-row">
            {row.columns?.map((column: any, colIdx: number) => (
              <div className="flex-1 flex flex-col flex-nowrap justify-start vb:col" key={column.key ?? `col-${colIdx}`} data-component="experience-grids-col">
                {column.elements?.map((element: any, elIdx: number) => (
                  <div data-epi-block-id={element?.key} key={element?.key ?? `element-${elIdx}`} data-component="experience-grids-element">
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

export default ExperienceGrids;

import React from "react";
import { FragmentType, useFragment } from "../../graphql/fragment-masking";
import { graphql } from "@/graphql";

// Define the fragment for HeroBannerBlock
export const HeroBannerFragment = graphql(/* GraphQL */ `
  fragment heroBanner on HeroBanner {
    Title
    Subtitle
    BackgroundImage {
      default
    }
  }
`);

interface HeroBannerProps {
  heroBanner: FragmentType<typeof HeroBannerFragment>;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ heroBanner }) => {
  const data = useFragment(HeroBannerFragment, heroBanner);

  if (!data) return null;

  return (
    <section
      className="relative w-full rounded-lg overflow-hidden bg-gray-100"
      style={{
        backgroundImage: data.BackgroundImage?.default
          ? `url(${data.BackgroundImage.default})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
    <div className="bg-black/50 p-8 sm:p-12 lg:p-16 text-white text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">{data.Title}</h1>
          {data.Subtitle && (
            <p className="text-lg mb-6">{data.Subtitle}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

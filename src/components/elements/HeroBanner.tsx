import React from "react";
import { FragmentType, useFragment } from "../../graphql/fragment-masking";
import { graphql } from "@/graphql";
import { useDecision } from '@optimizely/react-sdk';

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

  // Use feature flag to decide visibility and optionally override content
  const [decision] = useDecision('banner');
    
  console.log('HeroBanner enabled:', decision);
  // Hide the banner if the feature flag is disabled
  if (!decision?.enabled) return null;

  // Use Optimizely variables if available, fallback to CMS content
  const title = decision.variables?.title || data.Title;
  const subtitle = decision.variables?.subtitle || data.Subtitle;
  const backgroundImage = decision.variables?.backgroundImage || data.BackgroundImage?.default;

  const textShadowStyle = {
    textShadow: '0 2px 6px rgba(0,0,0,0.8)',
  };

  console.log('hello')
  return (
    <section
      className="relative w-full rounded-lg overflow-hidden bg-gray-100"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-black/40 p-8 sm:p-12 lg:p-16 text-white text-left">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4" style={textShadowStyle}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg mb-6" style={textShadowStyle}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

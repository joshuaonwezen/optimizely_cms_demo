import { FragmentType, useFragment } from "../../graphql/fragment-masking";
import { graphql } from "@/graphql";

export const CityElementFragment = graphql(/* GraphQL */ `
  fragment cityElement on CityBlock {
    Image {
        url {
            default
        }
    }
    Description {
      html
    }
    Title
  }
`);

const CityElementComponent = (props: {
    cityElement: FragmentType<typeof CityElementFragment>
}) => {
    const cityElement = useFragment(CityElementFragment, props.cityElement);

    return (
        <article className="max-w-3xl mx-2 my-8 p-8 bg-[#1a1736] rounded-lg shadow-lg border border-[#3a2c98] text-[#e4e2f5]">
            <h1 className="text-3xl font-bold mb-3">{cityElement.Title}</h1>
            
            {cityElement.Image?.default && (
                <div className="w-full mb-6">
                    <img
                        src={cityElement.Image.url.default}
                        alt={cityElement.Title || "City image"}
                        className="w-full h-auto rounded-lg object-cover shadow-md border border-[#3a2c98]"
                    />
                </div>
            )}
            
            {cityElement.Description?.html && (
                <div
                    className="prose prose-lg text-[#e4e2f5] prose-headings:text-[#a899ff] prose-a:text-[#b3a7ff] prose-strong:text-[#d0c6ff]"
                    dangerouslySetInnerHTML={{ __html: cityElement.Description.html }}
                />
            )}
        </article>
    );
};


export default CityElementComponent;

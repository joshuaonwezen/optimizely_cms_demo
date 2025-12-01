import { FragmentType, useFragment } from "../../graphql/fragment-masking";
import { graphql } from "@/graphql";
import { useDecision, useTrackEvent } from "@optimizely/react-sdk";

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
    
    // Optimizely feature flag for book trip button with different variations
    const [decision] = useDecision('city_book_trip_variations');
    const [track] = useTrackEvent();
    
    // Get the variation key (will be one of: 'hidden', 'simple_button', 'premium_button', 'cta_with_price')
    const bookTripVariation = decision?.variationKey || 'hidden';
    
    console.log('Book trip decision:', decision, 'Variation:', bookTripVariation);
    
    const handleBookTrip = (buttonType: string) => {
        // Track the booking action with variation info
        track('city_book_trip_clicked');
        alert(`Booking trip to ${cityElement.Title}! (${buttonType})`);
    };

    return (
        <article className="max-w-3xl mx-2 my-8 p-8 bg-[#1a1736] rounded-lg shadow-lg border border-[#3a2c98] text-[#e4e2f5]" data-component="city-article">
            <h1 className="text-3xl font-bold mb-3" data-component="city-title">
                <a href={"/en/" + cityElement.Title?.toLowerCase()} data-component="city-title-link">{cityElement.Title}</a>
            </h1>
            {cityElement.Image?.url?.default && (
                <div className="w-full mb-6" data-component="city-image-wrapper">
                    <img
                        src={cityElement.Image.url.default}
                        alt={cityElement.Title || "City image"}
                        className="w-full h-auto rounded-lg object-cover shadow-md border border-[#3a2c98]"
                        data-component="city-image"
                    />
                </div>
            )}
            {cityElement.Description?.html && (
                <div
                    className="prose prose-lg text-[#e4e2f5] prose-headings:text-[#a899ff] prose-a:text-[#b3a7ff] prose-strong:text-[#d0c6ff]"
                    dangerouslySetInnerHTML={{ __html: cityElement.Description.html }}
                    data-component="city-description"
                />
            )}
            
            {/* Feature flag: Book trip button with variations */}
            {bookTripVariation === 'simple_button' && (
                <div className="mt-6 pt-4 border-t border-[#3a2c98]" data-component="book-trip-section">
                    <button
                        onClick={() => handleBookTrip('Simple Button')}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                        data-component="book-trip-button"
                        data-variation="simple"
                    >
                        Book Trip
                    </button>
                </div>
            )}
            
            {bookTripVariation === 'premium_button' && (
                <div className="mt-6 pt-4 border-t border-[#3a2c98]" data-component="book-trip-section">
                    <button
                        onClick={() => handleBookTrip('Premium Button')}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                        data-component="book-trip-button"
                        data-variation="premium"
                    >
                        Book Trip to {cityElement.Title}
                    </button>
                </div>
            )}
            
            {bookTripVariation === 'cta_with_price' && (
                <div className="mt-6 pt-4 border-t border-[#3a2c98]" data-component="book-trip-section">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">Special Offer</p>
                        <button
                            onClick={() => handleBookTrip('CTA with Price')}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md w-full"
                            data-component="book-trip-button"
                            data-variation="cta_price"
                        >
                            Book Now - From $299
                        </button>
                    </div>
                </div>
            )}
            
            {/* Show variation info for demo purposes */}
            <div className="mt-2 text-xs text-gray-400" data-component="variation-info">
                Active variation: {bookTripVariation}
            </div>
        </article>
    );
};


export default CityElementComponent;

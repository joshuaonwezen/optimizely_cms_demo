const NoSearchResults = () => {
    return (
        <div
            className="relative w-full flex justify-center pt-12"
            data-epi-block-id="no-results-block">
            <div className="flex-1 flex flex-col items-center">
                <div data-epi-block-id="no-results-block">
                    <article className="max-w-3xl mx-2 my-8 p-8 bg-[#1a1736] rounded-lg shadow-lg border border-[#3a2c98] text-[#e4e2f5] text-center">
                        <h1 className="text-3xl font-bold mb-3">
                            No Search Results Found
                        </h1>
                        <div className="w-full mb-6"></div>
                        <div className="prose prose-lg text-[#e4e2f5] prose-headings:text-[#a899ff] prose-a:text-[#b3a7ff] prose-strong:text-[#d0c6ff]">
                            <p>We couldn’t find any results for your search.</p>
                            <p>
                                Try adjusting your search terms or check out
                                some of our popular pages.
                            </p>
                            <a href="/en/">
                                <button className="inline-block mt-4 px-6 py-3 bg-[#3a2c98] text-white rounded-lg shadow hover:bg-[#4f3bd9] transition">
                                    Go to Homepage
                                </button>
                            </a>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default NoSearchResults;

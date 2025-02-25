const LoadingComponent = () => {
    return (
      <div
        className="relative w-full flex justify-center pt-12"
        data-epi-block-id="loading-block"
      >
        <div className="flex-1 flex flex-col items-center">
          <div data-epi-block-id="loading-block">
            <article className="max-w-3xl mx-2 my-8 p-8 bg-[#1a1736] rounded-lg shadow-lg border border-[#3a2c98] text-[#e4e2f5] text-center">
              <h1 className="text-3xl font-bold mb-3 animate-pulse">
                Loading...
              </h1>
              <div className="w-full mb-6 flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#3a2c98]"></div>
              </div>
              <div className="prose prose-lg text-[#e4e2f5] prose-headings:text-[#a899ff] prose-a:text-[#b3a7ff] prose-strong:text-[#d0c6ff]">
                <p>Please wait while we load the content.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  };
  
  export default LoadingComponent;
  
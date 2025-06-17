import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { useEffect, useState } from "react";

function OptimizelyScript() {
  const [strategy, setStrategy] = useState<"beforeInteractive" | "afterInteractive">("beforeInteractive");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hostname === "localhost") {
      setStrategy("afterInteractive");
    }
  }, []);

  return (
    <Script
      src="//cdn.optimizely.com/js/23338860169.js"
      strategy={strategy}
    />
  );
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" href="//cdn.optimizely.com/js/23338860169.js" as="script" />
        <link rel="preconnect" href="//logx.optimizely.com" />
        <link rel="icon" href="https://app-ocstjoshuac8je4ft001.cms.optimizely.com/Util/images/favicon.ico" />

        {/* Add other meta information here */}
        {/* Add stylesheets here */}
        
        {/* Conditionally load script based on hostname */}
        <OptimizelyScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

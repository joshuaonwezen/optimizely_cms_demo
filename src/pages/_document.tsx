import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" href="//cdn.optimizely.com/js/23338860169.js" as="script" />
        <link rel="preconnect" href="//logx.optimizely.com" />
        {/* Add other meta information here */}
        {/* Add stylesheets here */}
        
        {/* Ensure script loads in head */}
        <Script
          src="//cdn.optimizely.com/js/23338860169.js"
          strategy="beforeInteractive"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

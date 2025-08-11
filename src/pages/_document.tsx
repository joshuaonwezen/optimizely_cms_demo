import { Html, Head, Main, NextScript } from "next/document";

const isLocal = process.env.NODE_ENV === "development";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" href="//cdn.optimizely.com/js/23338860169.js" as="script" />
        <link rel="preconnect" href="//logx.optimizely.com" />
        <link rel="icon" href="https://app-ocstjoshuac8je4ft001.cms.optimizely.com/Util/images/favicon.ico" />

        {/* Add other meta information here */}
        {/* Add stylesheets here */}
        
        {/* Ensure script loads in head without defer */}
        {!isLocal && (
          <script src="//cdn.optimizely.com/js/23338860169.js" />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

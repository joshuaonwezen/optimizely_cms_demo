import { Html, Head, Main, NextScript } from "next/document";

const isLocal = process.env.NODE_ENV === "development";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" href="//cdn.optimizely.com/js/23338860169.js" as="script" />
        <link rel="preconnect" href="//logx.optimizely.com" />
        <link rel="icon" href="https://app-ocstjoshuac8je4ft001.cms.optimizely.com/Util/images/favicon.ico" />


        {/* Ensure script loads in head without defer */}
        {!isLocal && (
          <script src="//cdn.optimizely.com/js/23338860169.js" />
        )}
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5SVM6NH');`
          }}
        />
        
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-4ZGPVVCD46" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4ZGPVVCD46');
            `
          }}
        />
      </Head>
      <body>
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5SVM6NH"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

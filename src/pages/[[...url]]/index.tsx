import VisualBuilder from "@/components/content/VisualBuilder";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useMemo } from "react";
import { initializeApollo } from "../../lib/apollo-ssr";
import { selectQuery } from "../../utils/querySelector";
import { ApolloProvider } from "@apollo/client";
import { GetServerSideProps } from "next";
import { HomePageProps, PageParams, SSRData } from "../../types";

const inter = Inter({ subsets: ["latin"] });

/**
 * Optimizely CMS Demo - Main Page Component
 * 
 * This component demonstrates key Optimizely SaaS CMS capabilities:
 * - Content delivery via GraphQL (Optimizely Graph)
 * - Server-side rendering for SEO and performance
 * - Feature experimentation with search ranking algorithms
 * - Unified content management across experiences and pages
 * 
 * URL Patterns Supported:
 * - Search: ?query=searchterm
 * - Direct content: ?key=contentkey&ver=version  
 * - URL routing: /path/to/content
 */
export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const { query, resolvedUrl } = context;
  let pageParams: PageParams = {};
  
  // Only check for specific keys that the application cares about
  // This ignores Optimizely editor parameters (optimizely_*, etc.)
  if (query.query) {
    pageParams = { searchQuery: query.query as string };
  } else if (query.key) {
    pageParams = { 
      contentKey: query.key as string, 
      version: query.ver as string | undefined 
    };
  } else {
    // Clean the URL by removing query parameters for URL-based routing
    const cleanUrl = resolvedUrl.split('?')[0];
    const url = cleanUrl === "/" ? "/en/" : cleanUrl;
    pageParams = { url: url.endsWith("/") ? url : url + "/" };
  }

  // Select query and variables
  const searchOrderBy = { _ranking: "SEMANTIC", _semanticWeight: 0.9 };
  const { queryDocument, queryVariables } = selectQuery(pageParams, searchOrderBy);

  // Create Apollo client for server-side data fetching
  const apolloClient = initializeApollo();
  let data: SSRData | null = null;
  
  try {
    const result = await apolloClient.query({ 
      query: queryDocument, 
      variables: queryVariables 
    });
    data = result.data as SSRData;
  } catch (error) {
    // Log error in production applications
    console.error('SSR data fetch error:', error);
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      ssrData: data,
      pageParams,
    },
  };
}

/**
 * Optimizely CMS Demo - Home Page Component
 * 
 * Demonstrates how to integrate Optimizely SaaS CMS with Next.js:
 * - Server-side rendering with GraphQL data fetching
 * - Apollo Client state hydration
 * - Content routing based on URL patterns
 */
export default function Home({ initialApolloState, ssrData, pageParams }: HomePageProps) {
  const client = initializeApollo(initialApolloState);
  
  return (
    <ApolloProvider client={client}>
      <main 
        className={`flex min-h-screen flex-col items-center px-12 justify-between ${inter.className}`}
        data-component="main-layout"
      >
        <VisualBuilder {...pageParams} ssrData={ssrData} />
      </main>
    </ApolloProvider>
  );
}



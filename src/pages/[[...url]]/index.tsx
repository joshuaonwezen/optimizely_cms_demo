import VisualBuilder from "@/components/content/VisualBuilder";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useMemo } from "react";
import { initializeApollo } from "../../lib/apollo-ssr";
import { selectQuery } from "../../utils/querySelector";
import { ApolloProvider } from "@apollo/client";
import { GetServerSideProps } from "next";

const inter = Inter({ subsets: ["latin"] });

/**
 * Main page component for Optimizely CMS demo
 * Handles different URL patterns and renders appropriate content
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Parse params as in the component
  const { query, resolvedUrl } = context;
  let pageParams: any = {};
  if (query.query) {
    pageParams = { searchQuery: query.query };
  } else if (query.key) {
    pageParams = { contentKey: query.key, version: query.ver };
  } else {
    const url = resolvedUrl === "/" ? "/en/" : resolvedUrl;
    pageParams = { url: url.endsWith("/") ? url : url + "/" };
  }

  // Select query and variables
  const searchOrderBy = { _ranking: "SEMANTIC", _semanticWeight: 0.9 };
  const { queryDocument, queryVariables } = selectQuery(pageParams, searchOrderBy);

  // Create Apollo client for SSR
  const apolloClient = initializeApollo();
  let data = null;
  try {
    const result = await apolloClient.query({ query: queryDocument, variables: queryVariables });
    data = result.data;
  } catch (e) {
    // handle error, optionally log
  }

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      ssrData: data,
      pageParams,
    },
  };
}

export default function Home({ initialApolloState, ssrData, pageParams }: {
  initialApolloState: any;
  ssrData: any;
  pageParams: any;
}) {
  const client = initializeApollo(initialApolloState);
  return (
    <ApolloProvider client={client}>
      <main className={`flex min-h-screen flex-col items-center px-12 justify-between ${inter.className}`}>
        <VisualBuilder {...pageParams} ssrData={ssrData} />
      </main>
    </ApolloProvider>
  );
}



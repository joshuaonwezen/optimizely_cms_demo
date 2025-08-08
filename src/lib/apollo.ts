import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getPreviewToken } from "./cms";

/**
 * Optimizely Graph Apollo Client Configuration
 * - Preview mode: Authenticated access to draft content
 * - Published mode: Public access
 * - Optimized caching for CMS content
 * - SSR support with singleton pattern
 */

const graphUrl = process.env.GRAPH_URL!;
const cmsUrl = process.env.CMS_URL!;
const singleGraphKey = process.env.GRAPH_SINGLE_KEY;

// Singleton instance for client-side usage
let globalApolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * Initialize Apollo Client (SSR-safe)
 */
export function initializeApollo(initialState?: NormalizedCacheObject) {
  const isServer = typeof window === "undefined";
  const client = isServer
    ? createApolloClient()
    : (globalApolloClient ??= createApolloClient());

  if (initialState) {
    client.cache.restore(initialState);
  }

  return client;
}

/**
 * Create a new Apollo Client instance
 */
function createApolloClient(): ApolloClient<NormalizedCacheObject> {
  const previewToken = getPreviewToken();
  const httpLink = createHttpLink({
    uri: previewToken
      ? `https://${graphUrl}/content/v2`
      : `https://${graphUrl}/content/v2?auth=${singleGraphKey}`
  });

  const authLink = setContext((_, { headers }) => ({
    headers: {
      ...headers,
      ...(previewToken ? { authorization: `Bearer ${previewToken}` } : {})
    }
  }));

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: createOptimizedCache(),
    defaultOptions: {
      watchQuery: { fetchPolicy: 'cache-first' },
      query: { fetchPolicy: 'cache-first' },
    },
  });

  // Inject Visual Builder script in preview mode (client only)
  if (previewToken && typeof window !== "undefined") {
    injectVisualBuilderScript();
  }

  return client;
}

/**
 * Optimized Apollo cache for CMS content
 */
function createOptimizedCache(): InMemoryCache {
  return new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          _Experience: { merge: false },
          CityPage: { merge: false },
          _Component: { merge: false },
        },
      },
    },
  });
}

/**
 * Append the Visual Builder communication script
 */
function injectVisualBuilderScript() {
  const script = document.createElement('script');
  script.src = `${cmsUrl}util/javascript/communicationInjector.js`;
  script.setAttribute('data-nscript', 'afterInteractive');
  document.body.appendChild(script);
}

export default initializeApollo();

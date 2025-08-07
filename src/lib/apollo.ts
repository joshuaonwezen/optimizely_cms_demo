import { ApolloClient, createHttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getPreviewToken } from "./cms";

/**
 * Optimizely Graph Apollo Client Configuration
 * 
 * Demonstrates Optimizely SaaS CMS GraphQL integration:
 * - Dual mode: Preview (authenticated) vs Published (public)
 * - Optimized caching strategy for CMS content
 * - Visual Builder communication for editing experience
 * - Server-side rendering support with singleton pattern
 */

// Environment configuration
const graphUrl = process.env.GRAPH_URL;
const cmsUrl = process.env.CMS_URL;
const preview_token = getPreviewToken();

// Singleton Apollo Client for client-side usage
let globalApolloClient: ApolloClient<NormalizedCacheObject> | undefined = undefined;

/**
 * Initialize Apollo Client with SSR support
 * @param initialState - Hydration state from server-side rendering
 * @returns Configured Apollo Client instance
 */
export function initializeApollo(initialState?: NormalizedCacheObject) {
    // Always create a new client for SSR, reuse singleton on client
    const isServer = typeof window === "undefined";
    let _client: ApolloClient<NormalizedCacheObject>;
    
    if (isServer) {
        _client = createApolloClient();
    } else {
        if (!globalApolloClient) {
            globalApolloClient = createApolloClient();
        }
        _client = globalApolloClient;
    }
    
    if (initialState) {
        _client.cache.restore(initialState);
    }
    
    return _client;
}

/**
 * Create Apollo Client instance with Optimizely-specific configuration
 * @returns Configured Apollo Client
 */
function createApolloClient(): ApolloClient<NormalizedCacheObject> {
    const graphUrl = process.env.GRAPH_URL;
    const cmsUrl = process.env.CMS_URL;
    const preview_token = getPreviewToken();
    
    let client: ApolloClient<NormalizedCacheObject>;
    
    if (preview_token) {
        // Preview mode: Authenticated access to draft content
        const httpLink = createHttpLink({ uri: `https://${graphUrl}/content/v2` });
        const authLink = setContext((_, { headers }) => ({
            headers: { ...headers, authorization: `Bearer ${preview_token}` }
        }));
        
        client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: createOptimizedCache(),
            defaultOptions: {
                watchQuery: { fetchPolicy: 'cache-first' },
                query: { fetchPolicy: 'cache-first' },
            },
        });
        
        // Enable Visual Builder communication for editing experience
        if (typeof window !== "undefined") {
            const communicationScript = document.createElement('script');
            communicationScript.src = `${cmsUrl}util/javascript/communicationInjector.js`;
            communicationScript.setAttribute('data-nscript', 'afterInteractive')
            document.body.appendChild(communicationScript);
        }
    } else {
        // Published mode: Public access to published content
        const singleGraphKey = process.env.GRAPH_SINGLE_KEY;
        const httpLink = createHttpLink({ 
            uri: `https://${graphUrl}/content/v2?auth=${singleGraphKey}` 
        });
        const authLink = setContext((_, { headers }) => ({ headers: { ...headers } }));
        
        client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: createOptimizedCache(),
            defaultOptions: {
                watchQuery: { fetchPolicy: 'cache-first' },
                query: { fetchPolicy: 'cache-first' },
            },
        });
    }
    
    return client;
}

/**
 * Create optimized cache configuration for Optimizely CMS content
 * @returns InMemoryCache instance with CMS-specific policies
 */
function createOptimizedCache(): InMemoryCache {
    return new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    // Don't merge arrays - replace them for cleaner updates
                    // This ensures fresh content on navigation
                    _Experience: { merge: false },
                    CityPage: { merge: false },
                    _Component: { merge: false },
                },
            },
        },
    });
}

export default initializeApollo();


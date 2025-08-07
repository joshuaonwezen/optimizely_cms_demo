import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getPreviewToken } from "./cms";

/**
 * Optimizely Graph Apollo Client Configuration
 * Handles both public and preview modes for the CMS demo
 */

// Environment variables
const graphUrl = process.env.GRAPH_URL;
const cmsUrl = process.env.CMS_URL;
const preview_token = getPreviewToken();

// Enhanced cache configuration for better performance
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // Don't merge arrays - replace them for cleaner updates
                _Experience: { merge: false },
                CityPage: { merge: false },
                _Component: { merge: false },
            },
        },
    },
});

let globalApolloClient: ApolloClient<any> | undefined = undefined;

export function initializeApollo(initialState?: any) {
    // Always create a new client for SSR, reuse singleton on client
    const isServer = typeof window === "undefined";
    let _client: ApolloClient<any>;
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

function createApolloClient() {
    const graphUrl = process.env.GRAPH_URL;
    const cmsUrl = process.env.CMS_URL;
    const preview_token = getPreviewToken();
    let client: ApolloClient<any>;
    if (preview_token) {
        const httpLink = createHttpLink({ uri: `https://${graphUrl}/content/v2` });
        const authLink = setContext((_, { headers }) => ({
            headers: { ...headers, authorization: `Bearer ${preview_token}` }
        }));
        client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            _Experience: { merge: false },
                            CityPage: { merge: false },
                            _Component: { merge: false },
                        },
                    },
                },
            }),
            defaultOptions: {
                watchQuery: { fetchPolicy: 'cache-first' },
                query: { fetchPolicy: 'cache-first' },
            },
        });
        if (typeof window !== "undefined") {
            const communicationScript = document.createElement('script');
            communicationScript.src = `${cmsUrl}util/javascript/communicationInjector.js`;
            communicationScript.setAttribute('data-nscript', 'afterInteractive')
            document.body.appendChild(communicationScript);
        }
    } else {
        const singleGraphKey = process.env.GRAPH_SINGLE_KEY;
        const httpLink = createHttpLink({ uri: `https://${graphUrl}/content/v2?auth=${singleGraphKey}` });
        const authLink = setContext((_, { headers }) => ({ headers: { ...headers } }));
        client = new ApolloClient({
            link: authLink.concat(httpLink),
            cache: new InMemoryCache({
                typePolicies: {
                    Query: {
                        fields: {
                            _Experience: { merge: false },
                            CityPage: { merge: false },
                            _Component: { merge: false },
                        },
                    },
                },
            }),
            defaultOptions: {
                watchQuery: { fetchPolicy: 'cache-first' },
                query: { fetchPolicy: 'cache-first' },
            },
        });
    }
    return client;
}

export default initializeApollo();


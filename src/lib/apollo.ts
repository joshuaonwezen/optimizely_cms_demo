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

let client: ApolloClient<any> | undefined = undefined;

/**
 * PREVIEW MODE - When editing content in Optimizely CMS
 * Uses Bearer token authentication and loads Visual Builder scripts
 */
if (preview_token) {
    const httpLink = createHttpLink({
        uri: `https://${graphUrl}/content/v2`,
    });

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: `Bearer ${preview_token}`
            }
        };
    });

    client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        defaultOptions: {
            watchQuery: { fetchPolicy: 'cache-first' },
            query: { fetchPolicy: 'cache-first' },
        },
    });

    // Load Visual Builder communication script for live editing
    const communicationScript = document.createElement('script');
    communicationScript.src = `${cmsUrl}util/javascript/communicationInjector.js`;
    communicationScript.setAttribute('data-nscript', 'afterInteractive')
    document.body.appendChild(communicationScript);
}

/**
 * PUBLIC MODE - For regular website visitors
 * Uses single key authentication (simpler, no bearer token needed)
 */
if (client === undefined) {
    const singleGraphKey = process.env.GRAPH_SINGLE_KEY;
    
    const httpLink = createHttpLink({
        uri: `https://${graphUrl}/content/v2?auth=${singleGraphKey}`,
    });

    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers
            }
        };
    });

    client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache,
        defaultOptions: {
            watchQuery: { fetchPolicy: 'cache-first' },
            query: { fetchPolicy: 'cache-first' },
        },
    });
}

export default client;


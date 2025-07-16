import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "../lib/apollo";
import { OptimizelyProvider } from "@optimizely/react-sdk";
import { optimizely, visitorId } from "../lib/optimizely";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <OptimizelyProvider optimizely={optimizely} user={{ id: visitorId }}>
            <ApolloProvider client={client!}>
                <Component {...pageProps} />
            </ApolloProvider>
        </OptimizelyProvider>
    );
}

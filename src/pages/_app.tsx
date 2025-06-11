import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "../apolloClient";
import { OptimizelyProvider, createInstance } from "@optimizely/react-sdk";

const optimizely = createInstance({
    sdkKey: "XKkRw1SWTRnp5WXmVMYdB",
});

const visitorId = '123';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <OptimizelyProvider optimizely={optimizely} user={{ id: visitorId }}>
            <ApolloProvider client={client!}>
                <Component {...pageProps} />
            </ApolloProvider>
        </OptimizelyProvider>
    );
}

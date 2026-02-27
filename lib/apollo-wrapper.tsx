"use client";

import {
    ApolloLink,
    HttpLink,
} from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
    const httpLink = new HttpLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql",
    });

    return new ApolloClient({
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        products: {
                            // Don't cache skip/take as part of the key - we want to merge them
                            keyArgs: ["category", "search"],
                            merge(existing, incoming, { args }) {
                                const skip = args?.skip || 0;
                                const items = existing?.items ? [...existing.items] : [];

                                if (incoming?.items) {
                                    // Append or insert at skip position
                                    for (let i = 0; i < incoming.items.length; ++i) {
                                        items[skip + i] = incoming.items[i];
                                    }
                                }

                                return {
                                    ...incoming,
                                    items,
                                };
                            },
                        },
                    },
                },
            },
        }),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
                : httpLink,
        connectToDevTools: false,
    });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}

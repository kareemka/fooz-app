import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

// Server-side Apollo Client for RSC (React Server Components)
export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql",
            // You can add headers here if needed (e.g., for auth)
        }),
        devtools: {
            enabled: false,
        },
    });
});

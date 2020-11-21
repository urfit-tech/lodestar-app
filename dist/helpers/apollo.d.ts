import ApolloClient from 'apollo-client';
declare type ApolloClientOptions = {
    appId: string;
    authToken: string | null;
};
export declare const createApolloClient: (options: ApolloClientOptions) => ApolloClient<import("apollo-cache-inmemory").NormalizedCacheObject>;
export {};

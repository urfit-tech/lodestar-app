import types from '../types';
import { PostLinkProps, PostPreviewProps, PostProps } from '../types/blog';
export declare const usePostPreviewCollection: (filter?: {
    authorId?: string | undefined;
    tags?: string[] | undefined;
} | undefined) => {
    loadingPosts: boolean;
    errorPosts: import("apollo-client").ApolloError | undefined;
    posts: PostPreviewProps[];
    refetchPosts: (variables?: types.GET_POST_PREVIEW_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_POST_PREVIEW_COLLECTION>>;
};
export declare const usePopularPostCollection: () => {
    loadingPosts: boolean;
    errorPosts: import("apollo-client").ApolloError | undefined;
    posts: PostLinkProps[];
    refetchPosts: (variables?: types.GET_POPULAR_POST_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_POPULAR_POST_COLLECTION>>;
    postCount: number;
    fetchMorePost: (page: number) => Promise<import("apollo-client").ApolloQueryResult<types.GET_POPULAR_POST_COLLECTION>>;
};
export declare const useRelativePostCollection: (id: string, tags?: string[] | undefined) => {
    loadingPost: boolean;
    errorPost: import("apollo-client").ApolloError | undefined;
    posts: PostLinkProps[];
    refetchPost: (variables?: types.GET_RELATIVE_POST_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_RELATIVE_POST_COLLECTION>>;
    postCount: number;
    fetchMorePost: (page: number) => Promise<import("apollo-client").ApolloQueryResult<types.GET_RELATIVE_POST_COLLECTION>>;
};
export declare const usePost: (search: string) => {
    loadingPost: boolean;
    errorPost: import("apollo-client").ApolloError | undefined;
    post: PostProps | null;
    refetchPosts: (variables?: types.GET_POSTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_POST>>;
};
export declare const useAddPostViews: () => (id: string) => Promise<import("@apollo/react-common").ExecutionResult<types.ADD_POST_VIEWS>>;

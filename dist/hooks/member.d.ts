import types from '../types';
import { MemberProps, MemberPublicProps, SocialCardProps } from '../types/member';
export declare const useMember: (memberId: string) => {
    loadingMember: boolean;
    errorMember: import("apollo-client").ApolloError | undefined;
    member: MemberProps | null;
    refetchMember: (variables?: types.GET_MEMBERVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MEMBER>>;
};
export declare const usePublicMember: (memberId: string) => {
    loadingMember: boolean;
    errorMember: import("apollo-client").ApolloError | undefined;
    member: MemberPublicProps | null;
    refetchMember: (variables?: types.GET_PUBLIC_MEMBERVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PUBLIC_MEMBER>>;
};
export declare const useUpdateMember: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.UPDATE_MEMBER, types.UPDATE_MEMBERVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_MEMBER>>;
export declare const useUpdateMemberMetadata: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.UPDATE_MEMBER_METADATA, types.UPDATE_MEMBER_METADATAVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_MEMBER_METADATA>>;
export declare const useCreatorCollection: () => {
    loadingCreators: boolean;
    errorCreators: import("apollo-client").ApolloError | undefined;
    creators: {
        id: string;
        avatarUrl: string | null;
        name: string;
        abstract: string | null;
        description: string | null;
        title: string;
    }[];
    refetchCreators: (variables?: types.GET_CREATOR_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_CREATOR_COLLECTION>>;
};
export declare const useUpdateMemberYouTubeChannelIds: () => (options?: import("@apollo/react-common").MutationFunctionOptions<any, Record<string, any>> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
export declare const useSocialCardCollection: () => {
    loadingSocialCards: boolean;
    errorSocialCards: import("apollo-client").ApolloError | undefined;
    socialCards: SocialCardProps[];
    refetchSocialCards: (variables?: Record<string, any> | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_SOCIAL_CARD_COLLECTION>>;
};

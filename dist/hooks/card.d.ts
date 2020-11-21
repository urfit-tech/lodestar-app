import types from '../types';
export declare const useEnrolledMembershipCardIds: (memberId: string) => {
    loadingMembershipCardIds: boolean;
    errorMembershipCardIds: import("apollo-client").ApolloError | undefined;
    enrolledMembershipCardIds: string[];
    refetchMembershipCardIds: (variables?: types.GET_ENROLLED_CARD_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_CARD_IDS>>;
};
export declare const useMembershipCard: (cardId: string) => {
    loadingMembershipCard: boolean;
    errorMembershipCard: import("apollo-client").ApolloError | undefined;
    membershipCard: {
        id: string;
        title: string;
        description: string;
        template: string;
    } | null;
    refetchMembershipCard: (variables?: types.GET_ENROLLED_CARDVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_CARD>>;
};
export declare const useEnrolledMembershipCards: (memberId: string) => {
    loadingMembershipCards: boolean;
    errorMembershipCards: import("apollo-client").ApolloError | undefined;
    enrolledMembershipCards: {
        card: {
            id: string;
            title: string;
            description: string;
            template: string;
        };
        updatedAt: Date | null;
    }[];
    refetchMembershipCards: (variables?: types.GET_ENROLLED_CARDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_CARDS>>;
};

import { NotificationProps } from '../contexts/NotificationContext';
import types from '../types';
import { CouponProps } from '../types/checkout';
export declare const useNotifications: (limit: number) => {
    loadingNotifications: boolean;
    errorNotifications: import("apollo-client").ApolloError | undefined;
    notifications: NotificationProps[];
    unreadCount: number | null | undefined;
    refetchNotifications: (variables?: types.GET_NOTIFICATIONSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_NOTIFICATIONS>>;
};
export declare const useCouponCollection: (memberId: string) => {
    loadingCoupons: boolean;
    errorCoupons: import("apollo-client").ApolloError | undefined;
    coupons: CouponProps[];
    refetchCoupons: (variables?: types.GET_COUPON_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_COUPON_COLLECTION>>;
};
export declare const useEnrolledProductIds: (memberId: string) => {
    loadingProductIds: boolean;
    errorProductIds: import("apollo-client").ApolloError | undefined;
    enrolledProductIds: string[];
    refetchProgramIds: (variables?: types.GET_ENROLLED_PRODUCTSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PRODUCTS>>;
};
export declare const useNav: () => {
    navs: {
        block: string;
        position: number;
        label: string;
        icon: string | null;
        href: string;
        external: boolean;
        locale: string;
        tag: string | null;
    }[];
    pageTitle: string;
};
export declare const useMemberContract: (memberContractId: string) => {
    memberContract: {
        startedAt: any;
        endedAt: any;
        values: any;
        agreedAt: any;
        agreedIp: string | null;
        agreedOptions: any;
        revokedAt: any;
        contract: {
            name: string;
            description: string;
            template: string;
        };
    };
    client: import("apollo-client").ApolloClient<any>;
    error?: import("apollo-client").ApolloError | undefined;
    loading: boolean;
    networkStatus: import("apollo-client").NetworkStatus;
    called: boolean;
    startPolling: (pollInterval: number) => void;
    stopPolling: () => void;
    subscribeToMore: <TSubscriptionData = types.GET_MEMBER_CONTRACT, TSubscriptionVariables = types.GET_MEMBER_CONTRACTVariables>(options: import("apollo-client").SubscribeToMoreOptions<types.GET_MEMBER_CONTRACT, TSubscriptionVariables, TSubscriptionData>) => () => void;
    updateQuery: <TVars = types.GET_MEMBER_CONTRACTVariables>(mapFn: (previousQueryResult: types.GET_MEMBER_CONTRACT, options: import("apollo-client").UpdateQueryOptions<TVars>) => types.GET_MEMBER_CONTRACT) => void;
    refetch: (variables?: types.GET_MEMBER_CONTRACTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MEMBER_CONTRACT>>;
    variables: types.GET_MEMBER_CONTRACTVariables;
    fetchMore: (<K extends "memberContractId">(fetchMoreOptions: import("apollo-client").FetchMoreQueryOptions<types.GET_MEMBER_CONTRACTVariables, K> & import("apollo-client").FetchMoreOptions<types.GET_MEMBER_CONTRACT, types.GET_MEMBER_CONTRACTVariables>) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MEMBER_CONTRACT>>) & (<TData2, TVariables2, K_1 extends keyof TVariables2>(fetchMoreOptions: {
        query?: import("graphql").DocumentNode | undefined;
    } & import("apollo-client").FetchMoreQueryOptions<TVariables2, K_1> & import("apollo-client").FetchMoreOptions<TData2, TVariables2>) => Promise<import("apollo-client").ApolloQueryResult<TData2>>);
};

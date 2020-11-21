import types from '../types';
import { MerchandiseBriefProps, MerchandiseProps, OrderLogWithMerchandiseSpecProps } from '../types/merchandise';
export declare const useMerchandiseCollection: (search?: string | null) => {
    loadingMerchandise: boolean;
    errorMerchandise: import("apollo-client").ApolloError | undefined;
    merchandises: MerchandiseBriefProps[];
    merchandiseTags: string[];
    refetchMerchandise: (variables?: types.GET_MERCHANDISE_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MERCHANDISE_COLLECTION>>;
};
export declare const useMerchandise: (merchandiseId: string) => {
    loadingMerchandise: boolean;
    errorMerchandise: import("apollo-client").ApolloError | undefined;
    merchandise: MerchandiseProps | null;
    refetchMerchandise: (variables?: types.GET_MERCHANDISEVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MERCHANDISE>>;
};
export declare const useOrderLogsWithMerchandiseSpec: (memberId: string) => {
    loadingOrderLogs: boolean;
    errorOrderLogs: import("apollo-client").ApolloError | undefined;
    orderLogs: OrderLogWithMerchandiseSpecProps[];
    refetchOrderLogs: (variables?: types.GET_ORDER_LOGS_WITH_MERCHANDISE_SPECVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ORDER_LOGS_WITH_MERCHANDISE_SPEC>>;
};

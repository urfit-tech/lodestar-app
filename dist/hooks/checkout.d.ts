import { InvoiceProps } from '../components/checkout/InvoiceInput';
import { ShippingProps } from '../components/checkout/ShippingInput';
import types from '../types';
import { CheckProps } from '../types/checkout';
import { MemberShopProps } from '../types/merchandise';
export declare const useCheck: (productIds: string[], discountId: string | null, shipping: ShippingProps | null, options: {
    [ProductId: string]: any;
}) => {
    check: CheckProps;
    checkError: Error | null;
    orderPlacing: boolean;
    orderChecking: boolean;
    placeOrder: (paymentType: 'perpetual' | 'subscription', invoice: InvoiceProps) => Promise<string>;
    totalPrice: number;
};
export declare const useOrderProduct: (orderProductId: string) => {
    loadingOrderProduct: boolean;
    errorOrderProduct: import("apollo-client").ApolloError | undefined;
    orderProduct: {
        id: string;
        name: string;
        description: string;
        createAt: Date | null;
        product: {
            id: string;
            type: string;
            target: string;
        };
        memberId: string;
        invoice: any;
    };
    refetchOrderProduct: (variables?: types.GET_ORDER_PRODUCTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ORDER_PRODUCT>>;
};
export declare const useMemberShop: (id: string) => {
    loadingMemberShop: boolean;
    errorMemberShop: import("apollo-client").ApolloError | undefined;
    memberShop: MemberShopProps | null;
    refetchMemberShop: (variables?: types.GET_MEMBER_SHOPVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_MEMBER_SHOP>>;
};
export declare const useCartProjectPlanCollection: (cartProjectPlanIds: string[]) => {
    loading: boolean;
    error: import("apollo-client").ApolloError | undefined;
    cartProjectPlans: {
        id: any;
        isPhysical: boolean;
    }[];
};
export declare const usePhysicalProductCollection: (productIds: string[]) => {
    loading: boolean;
    error: import("apollo-client").ApolloError | undefined;
    hasPhysicalProduct: boolean;
};

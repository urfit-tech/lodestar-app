import { ProductType } from '../types/product';
import { PeriodType } from '../types/program';
declare type TargetProps = {
    id: string;
    productType: ProductType | null;
    title: string;
    coverUrl?: string | null;
    listPrice?: number;
    salePrice?: number;
    discountDownPrice?: number;
    periodAmount?: number;
    periodType?: PeriodType;
    startedAt?: Date;
    endedAt?: Date;
    variant?: 'default' | 'simple' | 'cartProduct' | 'simpleCartProduct' | 'checkout';
    isSubscription?: boolean;
    isLimited?: boolean;
    isPhysical?: boolean;
    isCustomized?: boolean;
} | null;
export declare const useSimpleProduct: ({ id, startedAt }: {
    id: string;
    startedAt?: Date | undefined;
}) => {
    loading: boolean;
    error: import("apollo-client").ApolloError | undefined;
    target: TargetProps;
};
export {};

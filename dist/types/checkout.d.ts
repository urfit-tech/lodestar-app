export declare type OrderProductProps = {
    productId: string;
    name: string;
    description: string;
    price: number;
    endedAt: Date | null;
    startedAt: Date | null;
    autoRenewed: boolean;
    options?: {
        quantity?: number;
        currencyId?: string;
        currencyPrice?: number;
    };
};
export declare type OrderDiscountProps = {
    name: string;
    type: string | null;
    target: string | null;
    description: string | null;
    price: number;
    options: {
        [key: string]: any;
    } | null;
};
export declare type shippingOptionProps = {
    id: string;
    fee: number;
    days: number;
    enabled: boolean;
};
export declare type shippingOptionIdProps = 'sevenEleven' | 'familyMart' | 'okMart' | 'sendByPost' | 'homeDelivery';
export declare type CheckProps = {
    orderProducts: OrderProductProps[];
    orderDiscounts: OrderDiscountProps[];
    shippingOption: shippingOptionProps | null;
};
export declare type CartProductProps = {
    productId: string;
    shopId: string;
    enrollments?: {
        memberId: string | null;
        isPhysical: boolean | null;
    }[];
    options?: {
        [key: string]: any;
    };
};
export declare type CouponProps = {
    id: string;
    status: {
        used: boolean;
        outdated: boolean;
    };
    couponCode: {
        code: string;
        couponPlan: {
            id: string;
            startedAt: Date | null;
            endedAt: Date | null;
            type: 'cash' | 'percent';
            constraint: number;
            amount: number;
            title: string;
            description: string | null;
            count: number;
            remaining: number;
            scope: string[] | null;
            productIds?: string[];
        };
    };
};

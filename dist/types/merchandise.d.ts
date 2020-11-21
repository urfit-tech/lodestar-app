import { InvoiceProps } from '../components/checkout/InvoiceInput';
import { ShippingProps } from '../components/checkout/ShippingInput';
export declare type MerchandiseBasicProps = {
    id: string;
    title: string;
    soldAt: Date | null;
    minPrice: number;
    maxPrice: number;
    tags: string[];
    categories: {
        id: string;
        name: string;
    }[];
    images: {
        id: string;
        url: string;
        isCover: boolean;
    }[];
};
export declare type MerchandiseBriefProps = MerchandiseBasicProps & {
    specs: MerchandiseSpecBasicProps[];
};
export declare type MerchandiseProps = MerchandiseBasicProps & {
    abstract: string | null;
    description: string | null;
    startedAt: Date | null;
    endedAt: Date | null;
    isLimited: boolean;
    isPhysical: boolean;
    isCustomized: boolean;
    isCountdownTimerVisible: boolean;
    memberShop: MemberShopProps | null;
    specs: MerchandiseSpecProps[];
};
export declare type MerchandiseSpecBasicProps = {
    id: string;
    title: string;
    listPrice: number;
    salePrice: number | null;
};
export declare type MerchandiseSpecProps = MerchandiseSpecBasicProps & {
    quota: number;
    buyableQuantity?: number;
};
export declare type ShippingMethodType = 'seven-eleven' | 'family-mart' | 'hi-life' | 'ok-mart' | 'home-delivery' | 'send-by-post' | 'other';
export declare type ShippingMethodProps = {
    id: ShippingMethodType;
    enabled: boolean;
    fee: number;
    days: number;
};
export declare type MemberShopProps = {
    id: string;
    title: string;
    shippingMethods: ShippingMethodProps[];
    pictureUrl?: string | null;
};
export declare type OrderContact = {
    id: string;
    message: string;
    createdAt: Date;
    member: {
        id: string;
        name: string;
        pictureUrl: string | null;
    };
};
export declare type OrderLogWithMerchandiseSpecProps = {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    deliveredAt: Date | null;
    deliverMessage: string | null;
    shipping: ShippingProps | null;
    invoice: InvoiceProps;
    orderProducts: {
        id: string;
        merchandiseSpecId: string;
        quantity: number;
        filenames: string[];
    }[];
};

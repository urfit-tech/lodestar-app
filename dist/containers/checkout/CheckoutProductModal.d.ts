import { FormComponentProps } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { MemberProps } from '../../types/member';
import { ShippingMethodProps } from '../../types/merchandise';
export declare type CheckoutProductModalProps = FormComponentProps & ModalProps & {
    renderTrigger: React.FC<{
        setVisible: () => void;
    }>;
    renderProductSelector?: (options: {
        productId: string;
        onProductChange: (productId: string) => void;
    }) => JSX.Element;
    paymentType: 'perpetual' | 'subscription';
    defaultProductId?: string;
    isProductPhysical?: boolean;
    warningText?: string;
    startedAt?: Date;
    member: MemberProps | null;
    shippingMethods?: ShippingMethodProps[];
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<CheckoutProductModalProps>, Pick<CheckoutProductModalProps, "footer" | "style" | "title" | "mask" | "className" | "width" | "startedAt" | "warningText" | "prefixCls" | "visible" | "transitionName" | "confirmLoading" | "closable" | "onOk" | "onCancel" | "afterClose" | "centered" | "okText" | "okType" | "cancelText" | "maskClosable" | "forceRender" | "okButtonProps" | "cancelButtonProps" | "destroyOnClose" | "wrapClassName" | "maskTransitionName" | "getContainer" | "zIndex" | "bodyStyle" | "maskStyle" | "keyboard" | "wrapProps" | "closeIcon" | "wrappedComponentRef" | "member" | "shippingMethods" | "renderTrigger" | "renderProductSelector" | "paymentType" | "defaultProductId" | "isProductPhysical">>;
export default _default;

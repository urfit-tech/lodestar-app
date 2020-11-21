import { FormComponentProps } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
declare type IssueCreationModalProps = ModalProps & FormComponentProps & {
    threadId: string;
    memberId: string;
    onSubmit?: () => void;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<IssueCreationModalProps>, Pick<IssueCreationModalProps, "footer" | "style" | "title" | "mask" | "className" | "width" | "onSubmit" | "prefixCls" | "visible" | "transitionName" | "memberId" | "confirmLoading" | "closable" | "onOk" | "onCancel" | "afterClose" | "centered" | "okText" | "okType" | "cancelText" | "maskClosable" | "forceRender" | "okButtonProps" | "cancelButtonProps" | "destroyOnClose" | "wrapClassName" | "maskTransitionName" | "getContainer" | "zIndex" | "bodyStyle" | "maskStyle" | "keyboard" | "wrapProps" | "closeIcon" | "wrappedComponentRef" | "threadId">>;
export default _default;

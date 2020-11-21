import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
declare type VoucherInsertBlockProps = FormComponentProps & {
    onInsert?: (setLoading: React.Dispatch<React.SetStateAction<boolean>>, code: string) => void;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<VoucherInsertBlockProps>, Pick<VoucherInsertBlockProps, "wrappedComponentRef" | "onInsert">>;
export default _default;

import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { AuthState } from '../../types/member';
declare type RegisterSectionProps = FormComponentProps & {
    onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<RegisterSectionProps>, Pick<RegisterSectionProps, "onAuthStateChange" | "wrappedComponentRef">>;
export default _default;

import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { AuthState } from '../../types/member';
declare type LoginSectionProps = FormComponentProps & {
    onAuthStateChange: React.Dispatch<React.SetStateAction<AuthState>>;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<LoginSectionProps>, Pick<LoginSectionProps, "onAuthStateChange" | "wrappedComponentRef">>;
export default _default;

import { ButtonProps } from 'antd/lib/button';
import React from 'react';
import { ProgramProps } from '../../types/program';
declare type ProgramPaymentButtonProps = {
    program: ProgramProps;
    cartButtonProps?: ButtonProps;
    orderButtonProps?: ButtonProps;
    variant?: string;
};
declare const ProgramPaymentButton: React.FC<ProgramPaymentButtonProps>;
export default ProgramPaymentButton;

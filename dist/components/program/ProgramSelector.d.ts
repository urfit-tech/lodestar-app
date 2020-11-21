import { SelectProps } from 'antd/lib/select';
import React from 'react';
declare type ProgramSelectorProps = SelectProps<string> & {
    memberId: string;
};
export declare const EnrolledProgramSelector: React.FC<ProgramSelectorProps>;
export {};

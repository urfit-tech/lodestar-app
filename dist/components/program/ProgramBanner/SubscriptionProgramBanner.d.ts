import React from 'react';
import { ProgramProps, ProgramRoleProps } from '../../../types/program';
declare const SubscriptionProgramBanner: React.FC<{
    program: ProgramProps & {
        tags: string[];
        roles: ProgramRoleProps[];
    };
}>;
export default SubscriptionProgramBanner;

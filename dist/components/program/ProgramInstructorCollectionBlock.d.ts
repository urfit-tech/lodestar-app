import React from 'react';
import { ProgramProps, ProgramRoleProps } from '../../types/program';
declare const ProgramInstructorCollectionBlock: React.FC<{
    program: ProgramProps & {
        roles: ProgramRoleProps[];
    };
    title?: string;
}>;
export default ProgramInstructorCollectionBlock;

import React from 'react';
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program';
declare const ProgramInfoBlock: React.FC<{
    program: ProgramProps & {
        roles: ProgramRoleProps[];
        contentSections: (ProgramContentSectionProps & {
            contents: ProgramContentProps[];
        })[];
    };
}>;
export default ProgramInfoBlock;

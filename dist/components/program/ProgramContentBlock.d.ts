import React from 'react';
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program';
declare const ProgramContentBlock: React.FC<{
    program: ProgramProps & {
        roles: ProgramRoleProps[];
        contentSections: (ProgramContentSectionProps & {
            contents: ProgramContentProps[];
        })[];
    };
    programContentId: string;
}>;
export default ProgramContentBlock;

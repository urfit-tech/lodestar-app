import React from 'react';
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps } from '../../types/program';
declare const ProgramContentListSection: React.FC<{
    memberId: string;
    program: ProgramProps & {
        contentSections: (ProgramContentSectionProps & {
            contents: ProgramContentProps[];
        })[];
    };
    trialOnly?: boolean;
}>;
export default ProgramContentListSection;

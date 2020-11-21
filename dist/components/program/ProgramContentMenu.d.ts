import React from 'react';
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps } from '../../types/program';
declare const ProgramContentMenu: React.FC<{
    program: ProgramProps & {
        contentSections: (ProgramContentSectionProps & {
            contents: ProgramContentProps[];
        })[];
    };
    onSelect?: (programContentId: string) => void;
}>;
export default ProgramContentMenu;

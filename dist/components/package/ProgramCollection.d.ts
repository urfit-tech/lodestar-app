import React from 'react';
import { ProgramPackageProgramProps } from '../../types/programPackage';
declare const ProgramCollection: React.FC<{
    programs: ProgramPackageProgramProps[];
    renderItem: React.FC<{
        program: ProgramPackageProgramProps;
        displayType: 'grid' | 'list';
    }>;
    defaultDisplayType?: 'grid' | 'list';
    noDisplayTypeButton?: boolean;
}>;
export default ProgramCollection;

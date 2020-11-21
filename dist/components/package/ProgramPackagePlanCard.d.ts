import React from 'react';
import { ProgramPackagePlanProps } from '../../types/programPackage';
declare const ProgramPackagePlanCard: React.FC<ProgramPackagePlanProps & {
    programPackageId: string;
    loading?: boolean;
    isEnrolled?: boolean;
}>;
export default ProgramPackagePlanCard;

import React from 'react';
declare type ProgramPackageBannerProps = {
    title: string;
    coverUrl?: string | null;
    programPackageId: string;
    isEnrolled?: boolean;
};
declare const ProgramPackageBanner: React.FC<ProgramPackageBannerProps>;
export default ProgramPackageBanner;

import React from 'react';
declare type Video = {
    src: string;
    title: string;
};
declare type OnSaleTrialSectionProps = {
    title: string;
    videos: Video[];
};
declare const OnSaleTrialSection: React.FC<OnSaleTrialSectionProps>;
export default OnSaleTrialSection;

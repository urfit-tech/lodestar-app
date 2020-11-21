import React from 'react';
export declare type PodcastProgramBriefCardProps = {
    coverUrl: string | null;
    title: string;
    listPrice: number;
    salePrice?: number | null;
    soldAt?: Date | null;
};
declare const PodcastProgramBriefCard: React.FC<PodcastProgramBriefCardProps>;
export default PodcastProgramBriefCard;

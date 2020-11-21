import React from 'react';
export declare type PodcastProgramCardProps = {
    coverUrl: string | null;
    title: string;
    instructor?: {
        id: string;
        avatarUrl?: string | null;
        name: string;
    } | null;
    salePrice?: number;
    listPrice: number;
    duration: number;
    durationSecond: number;
    variant?: 'progress';
    percent?: number;
    isEnrolled?: boolean;
    noPrice?: boolean;
};
declare const PodcastProgramCard: React.FC<PodcastProgramCardProps>;
export default PodcastProgramCard;

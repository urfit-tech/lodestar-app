import React from 'react';
export declare type PodcastProgramPopoverProps = {
    title: string;
    duration: number;
    durationSecond: number;
    listPrice: number;
    salePrice: number | null;
    description?: string | null;
    categories: {
        id: string;
        name: string;
    }[];
    instructor?: {
        id: string;
        avatarUrl?: string | null;
        name: string;
    } | null;
    isEnrolled?: boolean;
    isSubscribed?: boolean;
    onSubscribe?: () => void;
};
declare const PodcastProgramPopover: React.FC<PodcastProgramPopoverProps & {
    podcastProgramId: string;
}>;
export default PodcastProgramPopover;

import React from 'react';
import { PodcastProgramCardProps } from '../../components/podcast/PodcastProgramCard';
import { PodcastProgramPopoverProps } from '../../components/podcast/PodcastProgramPopover';
export declare type PodcastProgramProps = PodcastProgramPopoverProps & PodcastProgramCardProps & {
    id: string;
    publishedAt: Date;
    supportLocales: string[] | null;
};
declare const PodcastProgramTimeline: React.FC<{
    memberId: string | null;
    podcastPrograms: PodcastProgramProps[];
    renderItem?: (item: {
        podcastProgram: PodcastProgramProps;
        isEnrolled: boolean;
        isSubscribed: boolean;
    }) => JSX.Element;
}>;
export default PodcastProgramTimeline;

import React from 'react';
import { PodcastProgramProps } from '../../containers/podcast/PodcastProgramTimeline';
import { ProgramBriefProps } from '../../types/program';
declare const OverviewBlock: React.FC<{
    programs: ProgramBriefProps[];
    podcastPrograms: PodcastProgramProps[];
    onChangeTab?: (key: string) => void;
    onSubscribe?: () => void;
}>;
export default OverviewBlock;

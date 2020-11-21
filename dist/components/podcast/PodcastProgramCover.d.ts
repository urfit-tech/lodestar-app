import React from 'react';
declare const PodcastProgramCover: React.FC<{
    memberId: string;
    podcastProgramId: string;
    coverUrl: string | null;
    title: string;
    publishedAt: Date;
    tags: string[];
    description?: string | null;
}>;
export default PodcastProgramCover;

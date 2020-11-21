import React from 'react';
declare type CreatorBriefCardProps = {
    imageUrl?: string | null;
    title: string;
    meta?: string | null;
    description?: string | null;
    variant?: 'featuring' | 'default';
};
declare const CreatorBriefCard: React.FC<CreatorBriefCardProps>;
export default CreatorBriefCard;

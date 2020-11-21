import React from 'react';
declare const CreatorCard: React.FC<{
    id: string;
    avatarUrl?: string | null;
    title: string;
    labels?: {
        id: string;
        name: string;
    }[];
    jobTitle?: string | null;
    description?: string | null;
    withProgram?: boolean;
    withPodcast?: boolean;
    withAppointment?: boolean;
    withBlog?: boolean;
    noPadding?: boolean;
}>;
export default CreatorCard;

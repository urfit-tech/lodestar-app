import React from 'react';
import { Callout } from './ProjectCalloutButton';
declare type ProjectBannerSectionProps = {
    title: string;
    abstract: string;
    description: string;
    url: string;
    type: string;
    expiredAt: Date | null;
    backgroundImage: string;
    callout?: Callout;
};
declare const ProjectBannerSection: React.FC<ProjectBannerSectionProps>;
export default ProjectBannerSection;

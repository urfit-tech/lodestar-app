import React from 'react';
import { Callout } from './ProjectCalloutButton';
declare type ProjectInstructorSectionProps = {
    title: string;
    callout?: Callout;
    items: {
        title: string;
        description: string;
        picture: string;
    }[];
};
declare const ProjectInstructorSection: React.FC<ProjectInstructorSectionProps>;
export default ProjectInstructorSection;

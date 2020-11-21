import React from 'react';
declare type ProjectCardSectionProps = {
    items: {
        icon?: string;
        title: string;
        description: string;
    }[];
    title: string;
    subtitle: string;
};
declare const ProjectCardSection: React.FC<ProjectCardSectionProps>;
export default ProjectCardSection;

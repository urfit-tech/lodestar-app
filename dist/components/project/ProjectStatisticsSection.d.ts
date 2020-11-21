import React from 'react';
declare type ProjectStatisticsSectionProps = {
    title: string;
    subtitle: string;
    items: {
        unit: string;
        amount: number;
        identity: string;
        description: string;
    }[];
};
declare const ProjectStatisticsSection: React.FC<ProjectStatisticsSectionProps>;
export default ProjectStatisticsSection;

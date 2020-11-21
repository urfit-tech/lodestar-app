import React from 'react';
declare type Feature = {
    title: string;
    description: string;
};
declare type Comparison = {
    title: string;
    subtitle: string;
    features: Feature[];
};
declare type ProjectComparisonSectionProps = {
    items: Comparison[];
};
declare const ProjectComparisonSection: React.FC<ProjectComparisonSectionProps>;
export default ProjectComparisonSection;

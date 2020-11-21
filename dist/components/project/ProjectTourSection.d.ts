import React from 'react';
declare type Step = {
    title: string;
    featureUrl: string;
    descriptions: string[];
};
declare type Roadmap = {
    header: string;
    steps: Step[];
};
declare type ProjectTourSectionProps = {
    trips: Roadmap[];
};
declare const ProjectTourSection: React.FC<ProjectTourSectionProps>;
export default ProjectTourSection;

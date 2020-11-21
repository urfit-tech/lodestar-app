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
declare type OnSaleRoadmapSectionProps = {
    roadmaps: Roadmap[];
};
declare const OnSaleRoadmapSection: React.FC<OnSaleRoadmapSectionProps>;
export default OnSaleRoadmapSection;

import React from 'react';
declare const ProjectPlanCollectionBlock: React.FC<{
    projectPlans: ProjectPlanBlockProps[];
}>;
export declare type ProjectPlanBlockProps = {
    id: string;
    title: string;
    description: string;
    project: {
        id: string;
        title: string;
        expiredAt: Date | null;
    };
};
export default ProjectPlanCollectionBlock;

import React from 'react';
import { ProjectPlanProps } from '../../types/project';
declare const FundingContentsPane: React.FC<{
    contents: {
        title: string;
        subtitle: string;
        contents: {
            title: string;
            description: string;
        }[];
    }[];
    projectPlans: ProjectPlanProps[];
}>;
export default FundingContentsPane;

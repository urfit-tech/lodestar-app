import React from 'react';
import { ProjectPlanProps } from '../../types/project';
declare const FundingUpdatesPane: React.FC<{
    updates: {
        date: string;
        cover?: string;
        title: string;
        description: string;
    }[];
    projectPlans: ProjectPlanProps[];
}>;
export default FundingUpdatesPane;

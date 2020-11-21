import React from 'react';
declare type PodcastPlanProps = {
    id: string;
    periodAmount: number;
    periodType: 'D' | 'W' | 'M' | 'Y';
    listPrice: number;
    salePrice?: number;
    soldAt: Date | null;
};
declare const PodcastPlanSelector: React.FC<{
    value?: string;
    defaultValue?: string;
    onChange?: (podcastPlanId: string) => void;
    podcastPlans: PodcastPlanProps[];
}>;
export default PodcastPlanSelector;

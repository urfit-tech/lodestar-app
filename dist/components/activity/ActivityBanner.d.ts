import React from 'react';
declare type ActivityBannerProps = {
    coverImage?: string;
    activityCategories: {
        category: {
            id: string;
            name: string;
        };
    }[];
    activityTitle: string;
};
declare const ActivityBanner: React.FC<ActivityBannerProps>;
export default ActivityBanner;

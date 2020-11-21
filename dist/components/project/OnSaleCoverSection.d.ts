import React from 'react';
declare type Statistic = {
    unit: string;
    amount: number;
    identity: string;
};
declare type OnSaleCoverSectionProps = {
    cover: {
        title: string;
        abstract: string;
        description: string;
        introduction: string;
        url: string;
        type: string;
    };
    header: {
        title: string;
        subtitle: string;
    };
    statistics: Statistic[];
    expiredAt: Date | null;
};
declare const OnSaleCoverSection: React.FC<OnSaleCoverSectionProps>;
export default OnSaleCoverSection;

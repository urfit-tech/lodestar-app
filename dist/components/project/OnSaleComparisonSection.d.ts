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
declare type OnSaleComparisonSectionProps = {
    comparisons: Comparison[];
};
declare const OnSaleComparisonSection: React.FC<OnSaleComparisonSectionProps>;
export default OnSaleComparisonSection;

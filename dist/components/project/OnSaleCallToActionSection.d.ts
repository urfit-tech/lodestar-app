import React from 'react';
declare type OnSaleCallToActionSectionProps = {
    projectId: string;
    updates: {
        headers: string[];
        promotes: string[];
        callToAction: string;
    };
    expiredAt: Date | null;
};
declare const OnSaleCallToActionSection: React.FC<OnSaleCallToActionSectionProps>;
export default OnSaleCallToActionSection;

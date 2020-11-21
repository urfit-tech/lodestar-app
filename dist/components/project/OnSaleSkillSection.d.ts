import React from 'react';
declare type OnSaleSkillSectionProps = {
    cards: {
        icon?: string;
        title: string;
        description: string;
    }[];
    header: {
        title1: string;
        title2: string;
        subtitle: string;
    };
};
declare const OnSaleSkillSection: React.FC<OnSaleSkillSectionProps>;
export default OnSaleSkillSection;

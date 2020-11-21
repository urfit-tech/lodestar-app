import React from 'react';
declare type ProjectPromotionSectionProps = {
    promotions: string[];
    expiredAt: Date | null;
    button: {
        label: string;
        href: string;
    };
};
declare const ProjectPromotionSection: React.FC<ProjectPromotionSectionProps>;
export default ProjectPromotionSection;

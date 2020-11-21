import { CategoryProps } from './general';
declare type ProjectSectionProps = {
    id: string;
    type: string;
    options: any;
};
export declare type FundingCommentProps = {
    name: string;
    title?: string;
    avatar: string;
    description: string;
};
export declare type ProjectPlanBasicProps = {
    id: string;
    coverUrl: string | null;
    title: string;
    description: string;
    isSubscription: boolean;
    periodAmount: number | null;
    periodType: string | null;
    listPrice: number;
    salePrice: number | null;
    soldAt: Date | null;
    discountDownPrice: number;
    createdAt: Date;
};
export declare type ProjectPlanProps = ProjectPlanBasicProps & {
    projectTitle: string;
    isParticipantsVisible: boolean;
    isPhysical: boolean;
    isLimited: boolean;
    isEnrolled?: boolean;
    isExpired?: boolean;
    buyableQuantity: number | null;
    projectPlanEnrollmentCount: number;
};
export declare type ProjectBasicProps = {
    id: string;
    type: string;
    title: string;
    coverType: string;
    coverUrl: string;
    previewUrl: string | null;
    abstract: string;
    description: string;
    targetAmount: number;
    targetUnit: 'funds' | 'participants';
    expiredAt: Date | null;
    isParticipantsVisible: boolean;
    isCountdownTimerVisible: boolean;
    totalSales: number;
    enrollmentCount: number;
    categories: CategoryProps[];
};
export declare type ProjectIntroProps = ProjectBasicProps & {
    projectPlans?: ProjectPlanBasicProps[];
};
export declare type ProjectProps = ProjectBasicProps & {
    template: string | null;
    introduction: string;
    updates: any;
    comments: any;
    contents: any;
    createdAt: Date;
    publishedAt: Date | null;
    projectSections: ProjectSectionProps[];
    projectPlans?: ProjectPlanProps[];
};
export {};

import types from '../types';
import { ProjectIntroProps, ProjectProps } from '../types/project';
export declare const usePhysicalEnrolledProjectPlanIds: (memberId: string) => {
    loadingEnrolledProjectPlanIds: boolean;
    errorEnrolledProjectPlanIds: import("apollo-client").ApolloError | undefined;
    enrolledProjectPlanIds: string[];
    refetchEnrolledProjectPlanIds: (variables?: types.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PHYSICAL_ENROLLED_PROJECT_PLAN_IDS>>;
};
export declare const useEnrolledProjectPlanIds: (memberId: string) => {
    loadingEnrolledProjectPlanIds: boolean;
    errorEnrolledProjectPlanIds: import("apollo-client").ApolloError | undefined;
    enrolledProjectPlanIds: (string | null)[];
    refetchEnrolledProjectPlanIds: (variables?: types.GET_ENROLLED_PROJECT_PLAN_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PROJECT_PLAN_IDS>>;
};
export declare const useProject: (projectId: string) => {
    loadingProject: boolean;
    errorProject: import("apollo-client").ApolloError | undefined;
    project: ProjectProps | null;
    refetchProject: (variables?: types.GET_PROJECTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROJECT>>;
};
export declare const useProjectIntroCollection: (filter?: {
    categoryId?: string | undefined;
} | undefined) => {
    loadingProjects: boolean;
    errorProjects: import("apollo-client").ApolloError | undefined;
    projects: ProjectIntroProps[];
    refetchProjects: (variables?: types.GET_PROJECT_INTRO_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROJECT_INTRO_COLLECTION>>;
};

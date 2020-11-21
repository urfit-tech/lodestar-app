import types from '../types';
import { CategoryProps } from '../types/general';
import { ProgramBriefProps, ProgramContentBodyProps, ProgramContentProps, ProgramContentSectionProps, ProgramPlanProps, ProgramRoleProps } from '../types/program';
export declare const usePublishedProgramCollection: (options?: {
    instructorId?: string | undefined;
    isPrivate?: boolean | undefined;
    categoryId?: string | undefined;
} | undefined) => {
    loadingPrograms: boolean;
    errorPrograms: import("apollo-client").ApolloError | undefined;
    programs: (ProgramBriefProps & {
        supportLocales: string[] | null;
        categories: CategoryProps[];
        roles: ProgramRoleProps[];
        plans: ProgramPlanProps[];
    })[];
    refetchPrograms: (variables?: types.GET_PUBLISHED_PROGRAM_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PUBLISHED_PROGRAM_COLLECTION>>;
};
export declare const useLatestProgramIds: ({ limit, language }: {
    limit?: number | undefined;
    language?: string | undefined;
}) => {
    loadingProgramIds: boolean;
    errorProgramIds: import("apollo-client").ApolloError | undefined;
    programIds: string[];
    refetchProgramIds: (variables?: types.GET_LATEST_PROGRAM_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_LATEST_PROGRAM_IDS>>;
};
export declare const useProgram: (programId: string) => {
    loadingProgram: boolean;
    errorProgram: import("apollo-client").ApolloError | undefined;
    program: (ProgramBriefProps & {
        description: string | null;
        coverVideoUrl: string | null;
        isIssuesOpen: boolean;
        isSoldOut: boolean | null;
        isCountdownTimerVisible?: boolean | undefined;
    } & {
        categories: CategoryProps[];
        tags: string[];
        roles: ProgramRoleProps[];
        plans: ProgramPlanProps[];
        contentSections: (ProgramContentSectionProps & {
            contents: ProgramContentProps[];
        })[];
    }) | null;
    refetchProgram: (variables?: types.GET_PROGRAMVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM>>;
};
export declare const useProgramContent: (programContentId: string) => {
    loadingProgramContent: boolean;
    errorProgramContent: import("apollo-client").ApolloError | undefined;
    programContent: (ProgramContentProps & {
        programContentBody: ProgramContentBodyProps | null;
    }) | null;
    refetchProgramContent: (variables?: types.GET_PROGRAM_CONTENTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM_CONTENT>>;
};
export declare const useEnrolledProgramIds: (memberId: string) => {
    enrolledProgramIds: any[];
    errorProgramIds: import("apollo-client").ApolloError | undefined;
    loadingProgramIds: boolean;
    refetchProgramIds: (variables?: types.GET_ENROLLED_PROGRAMSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PROGRAMS>>;
};
export declare const useEnrolledPlanIds: (memberId: string) => {
    programPlanIds: string[];
    loadingProgramPlanIds: boolean;
    refetchProgramPlanIds: (variables?: types.GET_ENROLLED_PROGRAM_PLANSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PROGRAM_PLANS>>;
};
export declare const useProgramPlanEnrollment: (programPlanId: string) => {
    numProgramPlanEnrollments: number;
    loadingProgramPlanEnrollments: boolean;
    refetchProgramPlanEnrollments: (variables?: types.GET_PROGRAM_PLAN_ENROLLMENTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM_PLAN_ENROLLMENT>>;
};

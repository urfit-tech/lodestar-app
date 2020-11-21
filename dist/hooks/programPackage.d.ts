import types from '../types';
import { ProgramPackagePlanProps, ProgramPackageProgramProps, ProgramPackageProps } from '../types/programPackage';
export declare const useProgramPackageIntroduction: (programPackageId: string) => {
    loadingProgramPackage: boolean;
    errorProgramPackage: import("apollo-client").ApolloError | undefined;
    programPackageIntroduction: ProgramPackageProps & {
        programPackagePlans: ProgramPackagePlanProps[];
        includedPrograms: ProgramPackageProgramProps[];
    };
    refetchProgramPackage: (variables?: types.GET_PROGRAM_PACKAGE_INTRODUCTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM_PACKAGE_INTRODUCTION>>;
};
export declare const useEnrolledProgramPackagePlanIds: (memberId: string) => {
    loadingProgramPackageIds: boolean;
    enrolledProgramPackagePlanIds: any[];
    errorProgramPackageIds: import("apollo-client").ApolloError | undefined;
    refetchProgramPackageIds: (variables?: types.GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PROGRAM_PACKAGE_PLAN_IDS>>;
};
export declare const useEnrolledProgramPackageIds: (memberId: string, programPackageId: string) => {
    loadingProgramPackageIds: boolean;
    enrolledProgramPackageIds: any[];
    errorProgramPackageIds: import("apollo-client").ApolloError | undefined;
    refetchProgramPackageIds: (variables?: types.GET_ENROLLED_PROGRAM_PACKAGEVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PROGRAM_PACKAGE>>;
};
export declare const useProgramPackage: (programPackageId: string, memberId: string | null) => {
    loading: boolean;
    error: import("apollo-client").ApolloError | undefined;
    programPackage: ProgramPackageProps & {
        isEnrolled: boolean;
    };
    programs: ProgramPackageProgramProps[];
    refetch: (variables?: types.GET_PROGRAM_PACKAGE_CONTENTVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM_PACKAGE_CONTENT>>;
};

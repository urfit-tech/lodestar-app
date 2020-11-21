import React from 'react';
import types from '../types';
declare type ProgressProps = {
    programContentProgress: {
        programContentId: string;
        programContentSectionId: string;
        progress: number;
        lastProgress: number;
    }[];
    refetchProgress?: () => void;
    insertProgress?: (programContentId: string, options: {
        progress: number;
        lastProgress: number;
    }) => Promise<any>;
};
export declare const ProgressContext: React.Context<ProgressProps>;
export declare const ProgressProvider: React.FC<{
    programId: string;
    memberId: string;
}>;
export declare const useProgramContentProgress: (programId: string, memberId: string) => {
    loadingProgress: boolean;
    errorProgress: import("apollo-client").ApolloError | undefined;
    programContentProgress: {
        programContentId: string;
        programContentSectionId: string;
        progress: number;
        lastProgress: number;
    }[];
    refetchProgress: (variables?: types.GET_PROGRAM_CONTENT_PROGRESSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PROGRAM_CONTENT_PROGRESS>>;
};
export {};

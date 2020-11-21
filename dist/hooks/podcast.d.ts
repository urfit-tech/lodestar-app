import { PodcastProgramProps } from '../containers/podcast/PodcastProgramTimeline';
import types from '../types';
import { PlaylistProps, PodcastProgramContent, PodcastProgramContentProps } from '../types/podcast';
export declare const usePodcastProgramCollection: (creatorId?: string | undefined) => {
    loadingPodcastPrograms: boolean;
    errorPodcastPrograms: import("apollo-client").ApolloError | undefined;
    podcastPrograms: PodcastProgramProps[];
    refetchPodcastPrograms: (variables?: types.GET_PODCAST_PROGRAM_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PODCAST_PROGRAM_COLLECTION>>;
};
export declare const usePodcastPlanIds: (creatorId: string) => {
    loadingPodcastPlans: boolean;
    errorPodcastPlans: import("apollo-client").ApolloError | undefined;
    podcastPlanIds: string[];
    refetchPodcastPlans: (variables?: types.GET_PODCAST_PLAN_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PODCAST_PLAN_IDS>>;
};
export declare const useEnrolledPodcastProgramIds: (memberId: string) => {
    loadingPodcastProgramId: boolean;
    errorPodcastProgramId: import("apollo-client").ApolloError | undefined;
    enrolledPodcastProgramIds: string[];
    refetchPodcastProgramId: (variables?: types.GET_ENROLLED_PODCAST_PROGRAM_IDSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PODCAST_PROGRAM_IDS>>;
};
export declare const useEnrolledPodcastPrograms: (memberId: string) => {
    enrolledPodcastPrograms: PodcastProgramProps[];
    loadingPodcastProgramIds: boolean;
    refetchPodcastProgramIds: (variables?: types.GET_ENROLLED_PODCAST_PROGRAMSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PODCAST_PROGRAMS>>;
};
export declare const usePublishedPodcastPlans: (memberId: string) => {
    publishedPodcastPlans: {
        id: any;
        periodAmount: any;
        periodType: import("../types/program").PeriodType;
        listPrice: any;
        salePrice: any;
        soldAt: any;
    }[];
    loadingPodcastPlans: boolean;
    errorPodcastPlan: import("apollo-client").ApolloError | undefined;
    refetchPodcastPlans: (variables?: types.GET_PUBLISHED_PODCAST_PLANSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PUBLISHED_PODCAST_PLANS>>;
};
export declare const useEnrolledPodcastPlansCreators: (memberId: string) => {
    enrolledPodcastPlansCreators: {
        id: string;
        pictureUrl: string | null;
        name: string | null;
        username: string;
    }[];
    loadingPodcastPlanIds: boolean;
    refetchPodcastPlan: (variables?: types.GET_ENROLLED_PODCAST_PLANVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_PODCAST_PLAN>>;
};
export declare const usePodcastProgramContent: (podcastProgramId: string) => {
    loadingPodcastProgram: boolean;
    errorPodcastProgram: import("apollo-client").ApolloError | undefined;
    podcastProgram: PodcastProgramContent | null;
    refetchPodcastProgram: (variables?: types.GET_PODCAST_PROGRAM_WITH_BODYVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PODCAST_PROGRAM_WITH_BODY>>;
};
export declare const usePlaylistCollection: (memberId: string) => {
    loadingPlaylists: boolean;
    errorPlaylists: import("apollo-client").ApolloError | undefined;
    playlists: (PlaylistProps & {
        podcastProgramIds: string[];
    })[];
    totalPodcastProgramCount: number;
    refetchPlaylists: (variables?: Record<string, any> | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PLAYLIST_COLLECTION>>;
};
export declare const useCreatePlaylist: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.CREATE_PLAYLIST, types.CREATE_PLAYLISTVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.CREATE_PLAYLIST>>;
export declare const useUpdatePlaylist: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.UPDATE_PLAYLIST, types.UPDATE_PLAYLISTVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_PLAYLIST>>;
export declare const useUpdatePlaylistPosition: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.UPDATE_PLAYLIST_POSITION, types.UPDATE_PLAYLIST_POSITIONVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_PLAYLIST_POSITION>>;
export declare const useDeletePlaylist: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.DELETE_PLAYLIST, types.DELETE_PLAYLISTVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.DELETE_PLAYLIST>>;
export declare const usePlaylistPodcastPrograms: (playlistId: string) => {
    loadingPodcastPrograms: boolean;
    errorPodcastPrograms: import("apollo-client").ApolloError | undefined;
    podcastPrograms: PodcastProgramContentProps[];
    refetchPodcastPrograms: (variables?: types.GET_PLAYLIST_PODCAST_PROGRAMSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PLAYLIST_PODCAST_PROGRAMS>>;
};
export declare const useUpdatePlaylistPodcastPrograms: () => (podcastProgramId: string, removedPlaylistIds: string[], data: types.INSERT_PODCAST_PROGRAMSVariables['data']) => Promise<void>;
export declare const useUpdatePodcastProgramPositions: () => (options?: import("@apollo/react-common").MutationFunctionOptions<types.UPDATE_PODCAST_PROGRAM_POSITIONS, types.UPDATE_PODCAST_PROGRAM_POSITIONSVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_PODCAST_PROGRAM_POSITIONS>>;

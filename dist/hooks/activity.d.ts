import types from '../types';
import { ActivityCategoryProps, ActivityProps, ActivitySessionTicketProps, ActivityTicketProps } from '../types/activity';
export declare const usePublishedActivityCollection: () => {
    loadingActivities: boolean;
    errorActivities: import("apollo-client").ApolloError | undefined;
    refetchActivities: (variables?: Record<string, any> | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_PUBLISHED_ACTIVITY_COLLECTION>>;
    activities: ActivityProps[];
};
export declare const useEnrolledActivityTickets: (memberId: string) => {
    loadingTickets: boolean;
    errorTickets: import("apollo-client").ApolloError | undefined;
    refetchTickets: (variables?: types.GET_ENROLLED_ACTIVITY_TICKETSVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_ACTIVITY_TICKETS>>;
    enrolledActivityTickets: {
        orderLogId: string;
        orderProductId: string;
        activityTicketId: string;
    }[];
};
export declare const useActivitySession: (sessionId: string) => {
    loadingSession: boolean;
    errorSession: import("apollo-client").ApolloError | undefined;
    session: {
        id: string;
        title: string;
        startedAt: Date;
        endedAt: Date;
        location: string;
        description: string | null;
        threshold: number | null;
        isParticipantsVisible: boolean;
        maxAmount: number;
        enrollments: number;
    } | null;
    refetchSession: (variables?: types.GET_ACTIVITY_SESSIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ACTIVITY_SESSION>>;
};
export declare const useActivityTicket: (ticketId: string) => {
    loadingTicket: boolean;
    errorTicket: import("apollo-client").ApolloError | undefined;
    ticket: (ActivityTicketProps & {
        sessionTickets: ActivitySessionTicketProps[];
        activity: {
            id: string;
            title: string;
            coverUrl: string | null;
            categories: ActivityCategoryProps[];
        };
    }) | null;
    refetchTicket: (variables?: types.GET_TICKETVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_TICKET>>;
};
export declare const useActivityAttendance: (memberId: string, activityTicketId: string) => {
    loadingAttendance: boolean;
    errorAttendance: import("apollo-client").ApolloError | undefined;
    attendance: {
        [sessionId: string]: boolean;
    };
    refetchAttendance: (variables?: types.GET_ACTIVITY_ATTENDANCEVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ACTIVITY_ATTENDANCE>>;
};
export declare const useAttendSession: () => {
    attendActivitySession: (options?: import("@apollo/react-common").MutationFunctionOptions<types.ATTEND_ACTIVITY_SESSION, types.ATTEND_ACTIVITY_SESSIONVariables> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<types.ATTEND_ACTIVITY_SESSION>>;
    leaveActivitySession: (options?: import("@apollo/react-common").MutationFunctionOptions<any, Record<string, any>> | undefined) => Promise<import("@apollo/react-common").ExecutionResult<any>>;
};

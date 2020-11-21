import types from '../types';
import { AppointmentEnrollmentProps, AppointmentPeriodProps, AppointmentPlanProps } from '../types/appointment';
export declare const useAppointmentPlanCollection: (memberId: string, startedAt: Date) => {
    loadingAppointmentPlans: boolean;
    errorAppointmentPlans: import("apollo-client").ApolloError | undefined;
    appointmentPlans: (AppointmentPlanProps & {
        periods: AppointmentPeriodProps[];
    })[];
    refetchAppointmentPlans: (variables?: types.GET_APPOINTMENT_PLAN_COLLECTIONVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_APPOINTMENT_PLAN_COLLECTION>>;
};
export declare const useEnrolledAppointmentCollection: (memberId: string) => {
    loadingEnrolledAppointments: boolean;
    errorEnrolledAppointments: import("apollo-client").ApolloError | undefined;
    enrolledAppointments: AppointmentEnrollmentProps[];
    refetchEnrolledAppointments: (variables?: types.GET_ENROLLED_APPOINTMENT_PLANVariables | undefined) => Promise<import("apollo-client").ApolloQueryResult<types.GET_ENROLLED_APPOINTMENT_PLAN>>;
};
export declare const useUpdateAppointmentIssue: (orderProductId: string, options: any) => (appointmentIssue: string) => Promise<import("@apollo/react-common").ExecutionResult<types.UPDATE_APPOINTMENT_ISSUE>>;
export declare const useCancelAppointment: (orderProductId: string, options: any) => (reason: string) => Promise<import("@apollo/react-common").ExecutionResult<types.CANCEL_APPOINTMENT>>;

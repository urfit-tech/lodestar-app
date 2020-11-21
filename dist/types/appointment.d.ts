import { CurrencyProps } from './program';
export declare type AppointmentPlanProps = {
    id: string;
    title: string;
    description: string | null;
    duration: number;
    price: number;
    phone: string | null;
    supportLocales: string[] | null;
    currency: CurrencyProps;
};
export declare type AppointmentPeriodProps = {
    id: string;
    startedAt: Date;
    endedAt: Date;
    booked: boolean;
};
export declare type AppointmentEnrollmentProps = {
    title: string;
    startedAt: Date;
    endedAt: Date;
    canceledAt: Date | null;
    creator: {
        avatarUrl: string | null;
        name: string;
    };
    member: {
        name: string;
        email: string;
        phone: string;
    };
    appointmentUrl: string;
    appointmentIssue: string | null;
    orderProduct: {
        id: string;
        options: any;
    };
};

import React from 'react';
declare const ActivityTicket: React.FC<{
    id: string;
    title: string;
    description: string | null;
    price: number;
    count: number;
    startedAt: Date;
    endedAt: Date;
    isPublished: boolean;
    activitySessionTickets: {
        id: string;
        activitySession: {
            id: string;
            title: string;
        };
    }[];
    participants: number;
    variant?: 'admin';
    extra?: React.ReactNode;
}>;
export default ActivityTicket;

import { ApolloError } from 'apollo-client';
import React from 'react';
export declare type NotificationProps = {
    id: string;
    description: string;
    type: string | null;
    referenceUrl: string | null;
    extra: string | null;
    avatar: string | null;
    readAt: Date | null;
    updatedAt: Date;
};
export declare const GET_NOTIFICATIONS: import("graphql").DocumentNode;
declare const NotificationContext: React.Context<{
    loadingNotifications: boolean;
    errorNotifications?: ApolloError | undefined;
    notifications: NotificationProps[];
    unreadCount?: number | null | undefined;
    refetchNotifications?: (() => Promise<any>) | undefined;
}>;
export declare const NotificationProvider: React.FC;
export default NotificationContext;

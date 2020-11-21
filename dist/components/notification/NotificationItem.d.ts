import React from 'react';
declare const NotificationItem: React.FC<{
    id: string;
    description: string;
    avatar: string | null;
    updatedAt: Date;
    extra: string | null;
    referenceUrl: string | null;
    type: string | null;
    readAt: Date | null;
    onRead?: () => void;
}>;
export default NotificationItem;

import { CardProps } from 'antd/lib/card';
import React from 'react';
declare type IssueAdminCardProps = CardProps & {
    threadId: string;
    programId: string;
    issueId: string;
    title: string;
    description: string;
    reactedMemberIds: string[];
    numReplies: number;
    createdAt: Date;
    memberId: string;
    solvedAt: Date;
    onRefetch?: () => void;
};
declare const IssueAdminCard: React.FC<IssueAdminCardProps>;
export default IssueAdminCard;

import React from 'react';
import { ProgramRoleProps } from '../../types/program';
declare const IssueReplyItem: React.FC<{
    programRoles: ProgramRoleProps[];
    issueReplyId: string;
    content: string;
    reactedMemberIds: string[];
    createdAt: Date;
    memberId: string;
    onRefetch?: () => void;
}>;
export default IssueReplyItem;

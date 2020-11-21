import { FormComponentProps } from 'antd/lib/form';
import React from 'react';
import { ProgramRoleProps } from '../../types/program';
declare type IssueItemProps = FormComponentProps & {
    programRoles: ProgramRoleProps[];
    issueId: string;
    title: string;
    description: string;
    reactedMemberIds: string[];
    numReplies: number;
    createdAt: Date;
    memberId: string;
    solvedAt: Date;
    onRefetch?: () => void;
    defaultRepliesVisible?: boolean;
    showSolvedCheckbox?: boolean;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<IssueItemProps>, Pick<IssueItemProps, "title" | "description" | "memberId" | "onRefetch" | "wrappedComponentRef" | "issueId" | "programRoles" | "reactedMemberIds" | "createdAt" | "numReplies" | "solvedAt" | "defaultRepliesVisible" | "showSolvedCheckbox">>;
export default _default;

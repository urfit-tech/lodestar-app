import React from 'react';
import { ProgramRoleProps } from '../../types/program';
declare type IssueThreadBlockProps = {
    threadId: string;
    programRoles: ProgramRoleProps[];
};
declare const IssueThreadBlock: React.FC<IssueThreadBlockProps>;
export default IssueThreadBlock;

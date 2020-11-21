import { FormComponentProps } from 'antd/lib/form';
import BraftEditor from 'braft-editor';
import React from 'react';
export declare const StyledEditor: import("styled-components").StyledComponent<typeof BraftEditor, any, {}, never>;
declare type IssueReplyCreationBlockProps = FormComponentProps & {
    memberId: string;
    issueId: string;
    onRefetch?: () => void;
};
declare const _default: import("antd/lib/form/interface").ConnectedComponentClass<React.FC<IssueReplyCreationBlockProps>, Pick<IssueReplyCreationBlockProps, "memberId" | "onRefetch" | "wrappedComponentRef" | "issueId">>;
export default _default;

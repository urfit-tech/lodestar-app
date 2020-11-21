import { AvatarProps } from 'antd/lib/avatar';
import React from 'react';
import { MemberPublicProps } from '../../types/member';
declare type MemberAvatarProps = AvatarProps & {
    memberId: string;
    renderAvatar?: (member: MemberPublicProps) => React.ReactNode;
    renderText?: (member: MemberPublicProps) => React.ReactNode;
    withName?: boolean;
};
declare const MemberAvatar: React.FC<MemberAvatarProps>;
export default MemberAvatar;

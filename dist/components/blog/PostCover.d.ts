import React from 'react';
import { MerchandiseProps } from '../../types/merchandise';
declare const PostCover: React.FC<{
    title: string;
    coverUrl: string | null;
    type: 'picture' | 'video';
    merchandises: MerchandiseProps[];
    isScrollingDown?: boolean;
}>;
export default PostCover;

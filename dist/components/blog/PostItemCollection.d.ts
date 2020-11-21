import React from 'react';
import { PostPreviewProps } from '../../types/blog';
declare const PostItemCollection: React.FC<{
    posts: PostPreviewProps[];
    withTagSelector?: boolean;
}>;
export default PostItemCollection;

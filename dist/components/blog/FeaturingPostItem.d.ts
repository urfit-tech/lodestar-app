import React from 'react';
import { PostPreviewProps } from '../../types/blog';
declare const FeaturingPostItem: React.FC<PostPreviewProps & {
    variant?: 'headline' | 'featuring';
}>;
export default FeaturingPostItem;

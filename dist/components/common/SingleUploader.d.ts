import { UploadProps } from 'antd/lib/upload';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import React from 'react';
declare const SingleUploader: React.FC<UploadProps & {
    path: string;
    value?: UploadFile;
    isPublic?: boolean;
    onChange?: (value?: UploadFile) => void;
    trigger?: (props: {
        loading: boolean;
        value?: UploadFile;
    }) => React.ReactNode;
    uploadText?: string;
    reUploadText?: string;
    onCancel?: () => void;
    onUploading?: (info: UploadChangeParam<UploadFile>) => void;
    onSuccess?: (info: UploadChangeParam<UploadFile>) => void;
    onError?: (info: UploadChangeParam<UploadFile>) => void;
}>;
export default SingleUploader;

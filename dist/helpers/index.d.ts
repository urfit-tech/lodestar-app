import { RcFile } from 'antd/lib/upload';
import { AxiosRequestConfig } from 'axios';
import { FlattenSimpleInterpolation } from 'styled-components';
export declare const TPDirect: any;
export declare const getBase64: (img: File, callback: (result: FileReader['result']) => void) => void;
export declare const validateImage: (file: RcFile, fileSize?: number | undefined) => boolean;
export declare const uploadFile: (key: string, file: File | null, authToken: string | null, backendEndpoint: string | null, config?: AxiosRequestConfig | undefined) => Promise<string>;
export declare const getFileDownloadableLink: (key: string, authToken: string | null, backendEndpoint: string | null) => Promise<any>;
export declare const downloadFile: (url: string, fileName: string) => Promise<void>;
export declare const commaFormatter: (value?: string | number | null | undefined) => string | false;
export declare const dateFormatter: (value: Date, format?: string | undefined) => string;
export declare const dateRangeFormatter: (props: {
    startedAt: Date;
    endedAt: Date;
    dateFormat?: string;
    timeFormat?: string;
}) => string;
export declare const durationFormatter: (value?: number | null | undefined) => string | false;
export declare const durationFullFormatter: (seconds: number) => string;
export declare const braftLanguageFn: (languages: {
    [lan: string]: any;
}, context: any) => any;
export declare const getNotificationIconType: (type: string) => "message" | "dollar" | "book" | "heart" | "question";
export declare const rgba: (hexColor: string, alpha: number) => string;
export declare const hexToHsl: (hexColor: string) => {
    h: number;
    s: number;
    l: number;
};
export declare const snakeToCamel: (snakeValue: string) => string;
export declare const handleError: (error: any) => import("antd/lib/message").MessageType;
export declare const notEmpty: <T>(value: T | null | undefined) => value is T;
export declare const camelCaseToDash: (str: string) => string;
export declare const getUserRoleLevel: (userRole?: string | undefined) => 1 | -1 | 0 | 2 | 3;
export declare const desktopViewMixin: (children: FlattenSimpleInterpolation) => FlattenSimpleInterpolation;
export declare const createUploadFn: (appId: string, authToken: string | null, backendEndpoint: string | null) => (params: {
    file: File;
    success: (res: {
        url: string;
        meta: {
            id: string;
            title: string;
            alt: string;
            loop: boolean;
            autoPlay: boolean;
            controls: boolean;
            poster: string;
        };
    }) => void;
}) => Promise<void>;
export declare const shippingMethodFormatter: (value?: string | undefined) => "全家超商取貨" | "萊爾富超商取貨" | "宅配" | "7-11 超商取貨" | "OK 超商取貨" | "未知配送方式";
export declare const isUUIDv4: (uuid: string) => boolean;
export declare const validationRegExp: {
    [fieldId: string]: RegExp;
};

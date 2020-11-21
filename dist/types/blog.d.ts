import { MerchandiseProps } from './merchandise';
export declare type PostLinkProps = {
    id: string;
    codeName: string | null;
    title: string;
    coverUrl: string | null;
    videoUrl: string | null;
};
export declare type PostPreviewProps = PostLinkProps & {
    abstract: string | null;
    author: {
        id: string;
        name: string;
    };
    publishedAt: Date | null;
    categories: {
        id: string;
        name: string;
    }[];
    tags: string[];
};
export declare type PostProps = PostPreviewProps & {
    author: {
        avatarUrl: string | null;
        abstract: string | null;
        withPodcast?: boolean;
        withAppointment?: boolean;
    };
    views: number;
    merchandises: MerchandiseProps[];
    description: string | null;
    prevPost: {
        id: string;
        codeName: string | null;
        title: string;
    } | null;
    nextPost: {
        id: string;
        codeName: string | null;
        title: string;
    } | null;
};

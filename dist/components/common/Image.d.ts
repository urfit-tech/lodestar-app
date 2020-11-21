declare type AvatarImageProps = {
    src?: string | null;
    size?: string | number;
    shape?: 'circle' | 'square';
    background?: string;
};
export declare const AvatarImage: import("styled-components").StyledComponent<"div", any, AvatarImageProps, never>;
declare type CustomRatioImageProps = {
    width: string;
    ratio: number;
    src: string;
    shape?: 'rounded' | 'circle';
    disabled?: boolean;
};
export declare const CustomRatioImage: import("styled-components").StyledComponent<"div", any, CustomRatioImageProps, never>;
export {};

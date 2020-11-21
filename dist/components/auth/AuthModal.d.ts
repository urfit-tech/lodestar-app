import React from 'react';
import { AuthState } from '../../types/member';
export declare const StyledTitle: import("styled-components").StyledComponent<"h1", any, {}, never>;
export declare const StyledDivider: import("styled-components").StyledComponent<React.SFC<import("antd/lib/divider").DividerProps>, any, {}, never>;
export declare const StyledAction: import("styled-components").StyledComponent<"div", any, {}, never>;
export declare const AuthModalContext: React.Context<{
    visible: boolean;
    setVisible?: React.Dispatch<React.SetStateAction<boolean>> | undefined;
}>;
declare type AuthModalProps = {
    defaultAuthState?: AuthState;
    onAuthStateChange?: (authState: AuthState) => void;
};
declare const AuthModal: ({ defaultAuthState, onAuthStateChange }: AuthModalProps) => JSX.Element;
export default AuthModal;

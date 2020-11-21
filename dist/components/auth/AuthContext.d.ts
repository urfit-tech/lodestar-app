import React from 'react';
import { UserRole } from '../../types/member';
declare type AuthContext = {
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    currentUserRole: UserRole;
    currentMemberId: string | null;
    authToken: string | null;
    currentMember: {
        name: string;
        username: string;
        email: string;
        pictureUrl: string;
    } | null;
    backendEndpoint: string | null;
    setBackendEndpoint?: (value: string) => void;
    refreshToken?: (data: {
        appId: string;
    }) => Promise<void>;
    register?: (data: {
        appId: string;
        username: string;
        email: string;
        password: string;
    }) => Promise<void>;
    login?: (data: {
        appId: string;
        account: string;
        password: string;
    }) => Promise<void>;
    socialLogin?: (data: {
        appId: string;
        provider: string;
        providerToken: any;
    }) => Promise<void>;
    logout?: () => void;
};
declare const AuthContext: React.Context<AuthContext>;
export declare const AuthProvider: React.FC;
export declare const useAuth: () => AuthContext;
export {};

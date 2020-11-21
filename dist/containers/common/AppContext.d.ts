import React from 'react';
import { Module } from '../../types/general';
declare type AppProps = {
    loading: boolean;
    id: string;
    name: string;
    title: string | null;
    description: string | null;
    enabledModules: {
        [key in Module]?: boolean;
    };
    navs: {
        block: string;
        position: number;
        label: string;
        icon: string | null;
        href: string;
        external: boolean;
        locale: string;
        tag: string | null;
    }[];
    settings: {
        [key: string]: string;
    };
    currencyId: string;
    currencies: {
        [currencyId: string]: {
            id: string;
            label: string | null;
            unit: string | null;
        };
    };
};
export declare const useApp: () => AppProps;
export declare const AppProvider: React.FC<{
    appId: string;
}>;
export {};

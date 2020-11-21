import React from 'react';
import { UserRole } from './types/member';
export declare type RouteProps = {
    path: string;
    pageName: string | JSX.Element;
    authenticated: boolean;
    allowedUserRole?: UserRole;
};
export declare const routesProps: {
    [routeKey: string]: RouteProps;
};
declare const Routes: React.FC<{
    extra?: {
        [routeKey: string]: RouteProps;
    };
}>;
export default Routes;

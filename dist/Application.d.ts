import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css';
import React from 'react';
import { RouteProps } from './Routes';
declare type ApplicationProps = {
    appId: string;
    extraRouteProps?: {
        [routeKey: string]: RouteProps;
    };
};
declare const Application: React.FC<ApplicationProps>;
export default Application;

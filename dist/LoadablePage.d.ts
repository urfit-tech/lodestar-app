import React from 'react';
import { UserRole } from './types/member';
declare const LoadablePage: React.FC<{
    pageName: string;
    authenticated?: boolean;
    allowedUserRole?: UserRole;
}>;
export default LoadablePage;

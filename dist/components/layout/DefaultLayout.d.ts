import React from 'react';
declare const DefaultLayout: React.FC<{
    white?: boolean;
    noHeader?: boolean;
    noFooter?: boolean;
    noCart?: boolean;
    centeredBox?: boolean;
    footerBottomSpace?: string;
    renderTitle?: () => React.ReactNode;
}>;
export default DefaultLayout;

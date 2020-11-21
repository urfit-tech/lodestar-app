import React from 'react';
declare type errorState = {
    hasError: boolean;
};
declare class ErrorBoundary extends React.Component<{}, errorState> {
    state: {
        hasError: boolean;
    };
    static getDerivedStateFromError(error: Error | null): {
        hasError: boolean;
    };
    componentDidCatch(error: Error | null, errorInfo: React.ErrorInfo | null): void;
    render(): {} | null | undefined;
}
export default ErrorBoundary;

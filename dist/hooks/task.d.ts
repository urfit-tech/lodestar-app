export declare const useTask: (queue: string, taskId: string) => {
    task: {
        returnvalue: any;
        failedReason: string;
        progress: number;
        timestamp: number;
        finishedOn: number | null;
        processedOn: number | null;
    } | null;
    retry: number;
};

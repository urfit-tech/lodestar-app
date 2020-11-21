import 'moment/locale/zh-tw';
import React from 'react';
declare type LanguageProps = {
    currentLanguage: string;
    setCurrentLanguage?: (language: string) => void;
};
declare const LanguageContext: React.Context<LanguageProps>;
export declare const LanguageProvider: React.FC;
export default LanguageContext;

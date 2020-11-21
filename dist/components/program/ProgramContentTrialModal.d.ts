import React from 'react';
declare type ProgramContentTrialModalProps = {
    render?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    }>;
    programContentId: string;
};
declare const ProgramContentTrialModal: React.FC<ProgramContentTrialModalProps>;
export default ProgramContentTrialModal;

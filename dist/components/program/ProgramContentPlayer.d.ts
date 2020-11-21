import React from 'react';
import { ReactPlayerProps } from 'react-player';
import { ProgramContentBodyProps } from '../../types/program';
declare const ProgramContentPlayer: React.FC<ReactPlayerProps & {
    programContentBody: ProgramContentBodyProps;
    nextProgramContent?: {
        id: string;
        title: string;
    };
    lastProgress?: number;
}>;
export default ProgramContentPlayer;

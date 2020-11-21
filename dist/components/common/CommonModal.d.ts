import { ModalProps } from '@chakra-ui/react';
import React from 'react';
declare const CommonModal: React.FC<ModalProps & {
    title: string;
    renderTrigger: () => React.ReactElement;
    renderFooter?: () => React.ReactElement;
}>;
export default CommonModal;

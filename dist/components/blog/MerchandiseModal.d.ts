import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { MerchandiseProps } from '../../types/merchandise';
declare const MerchandiseModal: React.FC<ModalProps & {
    renderTrigger: React.FC<{
        setVisible: () => void;
    }>;
    merchandises: MerchandiseProps[];
}>;
export default MerchandiseModal;

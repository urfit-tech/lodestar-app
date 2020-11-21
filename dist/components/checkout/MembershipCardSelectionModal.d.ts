import React from 'react';
declare type MembershipCardSelectionModalProps = {
    memberId: string;
    onSelect?: (membershipCardId: string) => void;
    render?: React.FC<{
        setVisible: React.Dispatch<React.SetStateAction<boolean>>;
        selectedMembershipCard?: {
            id: string;
            title: string;
        };
    }>;
};
declare const MembershipCardSelectionModal: React.FC<MembershipCardSelectionModalProps>;
export default MembershipCardSelectionModal;

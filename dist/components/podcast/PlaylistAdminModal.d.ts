import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import { PlaylistProps } from '../../types/podcast';
declare const PlaylistAdminModal: React.FC<ModalProps & {
    memberId: string;
    playlists: (PlaylistProps & {
        podcastProgramIds: string[];
    })[];
    selectedPodcastProgramId: string;
    onRefetch?: () => void;
    onSuccess?: () => void;
}>;
export default PlaylistAdminModal;

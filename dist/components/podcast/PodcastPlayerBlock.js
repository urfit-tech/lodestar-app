import React, { useContext } from 'react';
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext';
import { useAuth } from '../auth/AuthContext';
import PodcastPlayer from './PodcastPlayer';
var PodcastPlayerBlock = function () {
    var currentMemberId = useAuth().currentMemberId;
    var _a = useContext(PodcastPlayerContext), visible = _a.visible, currentPlayingId = _a.currentPlayingId;
    if (!currentMemberId || !visible || !currentPlayingId) {
        return null;
    }
    return React.createElement(PodcastPlayer, { memberId: currentMemberId });
};
export default PodcastPlayerBlock;
//# sourceMappingURL=PodcastPlayerBlock.js.map
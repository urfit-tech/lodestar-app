import React, { useContext } from 'react'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { useAuth } from '../auth/AuthContext'
import PodcastPlayer from './PodcastPlayer'

const PodcastPlayerBlock: React.VFC = () => {
  const { currentMemberId } = useAuth()
  const { visible, currentPlayingId } = useContext(PodcastPlayerContext)

  if (!currentMemberId || !visible || !currentPlayingId) {
    return null
  }

  return <PodcastPlayer memberId={currentMemberId} />
}

export default PodcastPlayerBlock

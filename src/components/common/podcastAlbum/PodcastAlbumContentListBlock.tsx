import { Divider, Icon } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import { BiMicrophone } from 'react-icons/bi'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import PodcastPlayerContext from '../../../contexts/PodcastPlayerContext'
import { durationFullFormatter } from '../../../helpers'
import { podcastAlbumMessages } from '../../../helpers/translation'
import { PodcastAlbum } from '../../../types/podcastAlbum'
import { AuthModalContext } from '../../auth/AuthModal'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
  font-weight: bold;
`
const PodcastAlbumContentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 12px;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f7f8f8;
  font-size: 14px;
  cursor: pointer;

  .ant-typography-secondary {
    font-size: 12px;
  }
`
const StyledTitleWrapper = styled.div`
  span {
    letter-spacing: 0.4px;
    color: #585858;
    font-weight: 500;
  }
`
const StyleIcon = styled(Icon)`
  font-size: 16px;
`
const StyledDuration = styled.span`
  color: var(--gray-darker);
  letter-spacing: 0.4px;
  font-family: Roboto;
`

const PodcastAlbumContentListBlock: React.VFC<{
  podcastAlbumId: PodcastAlbum['id']
  podcastPrograms: PodcastAlbum['podcastPrograms']
}> = ({ podcastAlbumId, podcastPrograms }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { playNow } = useContext(PodcastPlayerContext)

  return (
    <>
      <StyledTitle>{formatMessage(podcastAlbumMessages.label.podcastContent)}</StyledTitle>
      <Divider className="mb-3" />

      {podcastPrograms.map(podcastProgram => (
        <PodcastAlbumContentItem
          key={podcastProgram.id}
          onClick={() => {
            if (isAuthenticated) {
              history.push(`/podcasts/${podcastProgram.id}?podcastAlbumId=${podcastAlbumId}`)
              playNow?.({
                id: null,
                podcastAlbumId: podcastAlbumId,
                podcastProgramIds: podcastPrograms.map(podcastProgram => podcastProgram.id),
                currentIndex: 0,
              })
            } else {
              setAuthModalVisible?.(true)
            }
          }}
        >
          <StyledTitleWrapper className="d-flex align-items-center">
            <StyleIcon as={BiMicrophone} className="mr-2" />
            <span>{podcastProgram.title}</span>
          </StyledTitleWrapper>
          <StyledDuration>{durationFullFormatter(podcastProgram.durationSecond) || '00:00'}</StyledDuration>
        </PodcastAlbumContentItem>
      ))}
    </>
  )
}

export default PodcastAlbumContentListBlock

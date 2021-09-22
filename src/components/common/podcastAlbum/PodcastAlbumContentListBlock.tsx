import { Icon } from '@chakra-ui/react'
import { Divider } from 'antd'
import React from 'react'
import { BiMicrophone } from 'react-icons/bi'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { durationFullFormatter } from '../../../helpers'
import { productMessages } from '../../../helpers/translation'
import { PodcastAlbum } from '../../../types/podcastAlbum'

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
  podcastAlbum: PodcastAlbum
}> = ({ podcastAlbum }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <StyledTitle>{formatMessage(productMessages.program.title.content)}</StyledTitle>
      <Divider className="mt-1" />

      {podcastAlbum.podcastPrograms.map(podcastProgram => (
        <PodcastAlbumContentItem key={podcastProgram.id}>
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

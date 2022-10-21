import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import EmptyCover from '../../../images/empty-cover.png'
import { PodcastAlbum } from '../../../types/podcastAlbum'
import BlurredBanner from '../../common/BlurredBanner'
import Responsive, { BREAK_POINT } from '../../common/Responsive'

const StyledTitleBlockWrapper = styled.div`
  position: absolute;
  width: 100%;
`
const StyledTitleBlock = styled.div`
  position: relative;
  padding-top: 2rem;
  color: #fff;
  z-index: 1;
  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem 0rem;
  }
`
const StyledCoverImage = styled.div<{ coverUrl?: string | null }>`
  background-image: url(${props => props.coverUrl || ''});
  background-size: cover;
  background-position: center;
  width: 220px;
  height: 220px;
  margin-top: 32px;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: ${BREAK_POINT}px) {
    margin: 0px 0px 0px 15px;
  }
`
const StyledTitle = styled.div`
  font-size: 28px;
  letter-spacing: 0.23px;
  font-weight: bold;
`
const StyledSectionCount = styled.div`
  font-size: 14px;
  letter-spacing: 0.8px;
  text-align: center;
  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
  }
`
const StyledCategories = styled.div`
  text-align: center;
  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
  }
`
const StyledLink = styled(Link)`
  padding: 3px 8px;
  border-radius: 11px;
  border: solid 1px #fff;
`
const PodcastAlbumBanner: React.VFC<{
  podcastAlbum: Pick<PodcastAlbum, 'coverUrl' | 'title' | 'podcastPrograms' | 'categories'>
}> = ({ podcastAlbum }) => {
  const { formatMessage } = useIntl()

  return (
    <BlurredBanner
      coverUrl={{ desktopUrl: podcastAlbum.coverUrl || EmptyCover }}
      width={{ desktop: '240px', mobile: '360px' }}
    >
      <StyledTitleBlockWrapper>
        <StyledTitleBlock className="container d-lg-flex">
          <Responsive.Desktop>
            <StyledCoverImage coverUrl={podcastAlbum.coverUrl || EmptyCover} className="mr-5" />
          </Responsive.Desktop>
          <div>
            <StyledTitle className="text-center mb-2">{podcastAlbum.title}</StyledTitle>
            {/* <StyledSectionCount className="mb-4">{`${formatMessage(podcastAlbumMessages.text.sectionCount, {
              sectionCount: podcastAlbum.podcastPrograms.length,
            })}`}</StyledSectionCount> */}
            <StyledCategories>
              {podcastAlbum.categories.map(category => (
                <StyledLink key={category.id} className="mr-2" to={`/podcast-albums?active=${category.id}`}>
                  {category.name}
                </StyledLink>
              ))}
            </StyledCategories>
          </div>
          <Responsive.Default>
            <StyledCoverImage coverUrl={podcastAlbum.coverUrl || EmptyCover} />
          </Responsive.Default>
        </StyledTitleBlock>
      </StyledTitleBlockWrapper>
    </BlurredBanner>
  )
}

export default PodcastAlbumBanner

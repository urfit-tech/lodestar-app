import { Skeleton } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import styled from 'styled-components'
import { useLatestCreator } from '../../hooks/member'
import DefaultAvatar from '../../images/avatar.svg'
import { SectionTitle } from '../../pages/AppPage'
import { BREAK_POINT } from '../common/Responsive'

const StyledSection = styled.section`
  padding: 80px 0;
`
const StyledWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
`
const StyledSlider = styled(Slider)`
  && {
    position: relative;

    .slick-dots {
      position: absolute;
    }
    li button::before {
      opacity: 1;
      font-size: 12px;
      color: #cdcdcd;
      transition: 0.3s;
    }
    li.slick-active button::before {
      color: ${props => props.theme['@primary-color']};
      font-size: 18px;
    }

    @media (min-width: ${BREAK_POINT}px) {
      li.slick-active button::before {
        font-size: 16px;
      }
    }
  }
`
const StyledInstructorBlock = styled.div`
  padding: 1rem;
`
const StyledAvatar = styled.img`
  overflow: hidden;
  width: 240px;
  height: 240px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  background: #ccc;
`
const StyledTitle = styled.div`
  margin-bottom: 0.5rem;
  font-size: 18px;
  color: var(--gray-darker);
  font-weight: bold;
  text-align: center;
  letter-spacing: 0.8px;
`
const StyledDescription = styled.div`
  color: #a9a9a9;
  line-height: 1.5;
  letter-spacing: 0.2px;
  max-width: 190px;
  text-align: center;
  margin: 0 auto;
  max-height: 190px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
`

const CreatorSection: React.VFC<{ options: { title?: string; topInstructorIds?: string[] } }> = ({ options }) => {
  const { id: appId } = useApp()
  const { loadingLatestCreators, latestCreators, errorLatestCreators } = useLatestCreator(
    options?.topInstructorIds || [],
    appId,
  )

  const instructorBlock = (amount: number) => {
    return latestCreators.slice(0, amount).map(v => (
      <StyledInstructorBlock key={v.id}>
        <Link to={`/creators/${v.id}`}>
          <div className="mb-4">
            <StyledAvatar
              src={v.avatarUrl !== null ? v.avatarUrl : DefaultAvatar}
              alt={v.name || ''}
              className="mx-auto"
            />
          </div>
          <StyledTitle>{v.name}</StyledTitle>
          <StyledDescription>{v.abstract}</StyledDescription>
        </Link>
      </StyledInstructorBlock>
    ))
  }

  if (loadingLatestCreators)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (latestCreators.length === 0 || errorLatestCreators) return null

  return (
    <StyledSection className="page-section">
      <SectionTitle className="mb-5">{options?.title || '合作講師'}</SectionTitle>
      <StyledWrapper>
        <StyledSlider
          dots
          arrows={false}
          slidesToShow={latestCreators.length < 3 ? latestCreators.length : 3}
          slidesToScroll={latestCreators.length < 3 ? latestCreators.length : 3}
          responsive={[
            {
              breakpoint: BREAK_POINT,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {window.innerWidth < BREAK_POINT ? instructorBlock(3) : instructorBlock(9)}
        </StyledSlider>
      </StyledWrapper>
    </StyledSection>
  )
}

export default CreatorSection

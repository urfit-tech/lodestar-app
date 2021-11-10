import { Icon } from '@chakra-ui/icons'
import { MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common/index'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { PodcastProgramProps } from '../../containers/podcast/PodcastProgramTimeline'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledPodcastPlansCreators, useEnrolledPodcastProgramIds } from '../../hooks/podcast'
import { useEnrolledProgramIds } from '../../hooks/program'
import { ReactComponent as ArrowRightIcon } from '../../images/angle-right.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramBriefProps } from '../../types/program'
import PodcastProgramPopover from '../podcast/PodcastProgramPopover'

const StyledTitle = styled.div`
  ${MultiLineTruncationMixin}
  padding-left: 20px;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
`
const StyledSideBarBlock = styled.div`
  margin-bottom: 2rem;
  padding-left: 1.25rem;
`
const StyledImage = styled.img`
  width: 114px;
  height: 70px;
  object-fit: cover;
`
const StyledLink = styled.div`
  margin-top: 24px;
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition: 0.5s;

  &:hover {
    opacity: 0.7;
  }
`

const OverviewBlock: React.VFC<{
  programs: ProgramBriefProps[]
  podcastPrograms: PodcastProgramProps[]
  onChangeTab?: (key: string) => void
  onSubscribe?: () => void
}> = ({ programs, podcastPrograms, onChangeTab, onSubscribe }) => {
  const { currentMemberId } = useAuth()
  const { formatMessage } = useIntl()
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')
  const { enrolledPodcastProgramIds } = useEnrolledPodcastProgramIds(currentMemberId || '')
  const { enrolledPodcastPlansCreators } = useEnrolledPodcastPlansCreators(currentMemberId || '')

  return (
    <>
      <StyledSideBarBlock>
        <h4 className="mb-4">{formatMessage(commonMessages.title.addCourse)}</h4>
        {programs.slice(0, 3).map(program => (
          <Link
            key={program.id}
            to={`/programs/${program.id}${enrolledProgramIds.includes(program.id) ? '/contents' : ''}`}
          >
            <div className="d-flex align-items-center mb-3">
              <StyledImage
                className="flex-shrink-0"
                src={program.coverUrl || EmptyCover}
                alt={program.title || program.id}
              />
              <StyledTitle>{program.title}</StyledTitle>
            </div>
          </Link>
        ))}
        <StyledLink onClick={() => onChangeTab && onChangeTab('programs')}>
          {formatMessage(commonMessages.content.browse)}
          <Icon as={ArrowRightIcon} className="ml-2" />
        </StyledLink>
      </StyledSideBarBlock>

      {podcastPrograms.length > 0 && (
        <StyledSideBarBlock>
          <h4 className="mb-4">{formatMessage(commonMessages.content.podcasts)}</h4>
          {podcastPrograms.slice(0, 3).map(podcastProgram => {
            const isEnrolled = enrolledPodcastProgramIds.includes(podcastProgram.id)
            const isSubscribed =
              !!podcastProgram.instructor &&
              enrolledPodcastPlansCreators.map(v => v.id).includes(podcastProgram.instructor.id)

            return (
              <PodcastProgramPopover
                key={podcastProgram.id}
                isEnrolled={isEnrolled}
                isSubscribed={isSubscribed}
                podcastProgramId={podcastProgram.id}
                title={podcastProgram.title}
                listPrice={podcastProgram.listPrice}
                salePrice={podcastProgram.salePrice}
                duration={podcastProgram.duration}
                durationSecond={podcastProgram.durationSecond}
                description={podcastProgram.description}
                categories={podcastProgram.categories}
                instructor={podcastProgram.instructor}
                onSubscribe={onSubscribe}
              >
                <div className="d-flex align-items-center mb-3">
                  <StyledImage
                    className="flex-shrink-0"
                    src={podcastProgram.coverUrl || EmptyCover}
                    alt={podcastProgram.title}
                  />
                  <StyledTitle>{podcastProgram.title}</StyledTitle>
                </div>
              </PodcastProgramPopover>
            )
          })}
          <StyledLink onClick={() => onChangeTab && onChangeTab('podcasts')}>
            {formatMessage(commonMessages.content.browse)}
            <Icon as={ArrowRightIcon} className="ml-2" />
          </StyledLink>
        </StyledSideBarBlock>
      )}
    </>
  )
}

export default OverviewBlock

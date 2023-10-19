import { Timeline } from 'antd'
import moment from 'moment'
import { groupBy } from 'ramda'
import React from 'react'
import styled from 'styled-components'
import { PodcastProgramCardProps } from '../../components/podcast/PodcastProgramCard'
import { PodcastProgramPopoverProps } from '../../components/podcast/PodcastProgramPopover'
import { useEnrolledPodcastPlansCreators, useEnrolledPodcastPrograms } from '../../hooks/podcast'

const StyledTimeline = styled(Timeline)`
  && .ant-timeline-item-head {
    border-color: ${props => props.theme['@primary-color']};
  }
`

const StyledTitle = styled.div`
  color: var(--gray-darker);
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledProgram = styled.div`
  margin-bottom: 1.25rem;
`

export type PodcastProgramProps = PodcastProgramPopoverProps &
  PodcastProgramCardProps & {
    id: string
    publishedAt: Date
    supportLocales: string[] | null
  }
const PodcastProgramTimeline: React.VFC<{
  memberId: string | null
  podcastPrograms: PodcastProgramProps[]
  renderItem?: (item: {
    podcastProgram: PodcastProgramProps
    isEnrolled: boolean
    isSubscribed: boolean
  }) => React.ReactElement
}> = ({ memberId, podcastPrograms, renderItem }) => {
  const { enrolledPodcastPrograms } = useEnrolledPodcastPrograms(memberId || '')
  const { enrolledPodcastPlansCreators } = useEnrolledPodcastPlansCreators(memberId || '')

  const podcastProgramsGroupByDate: { [date: string]: PodcastProgramProps[] } = groupBy(
    podcast => moment(podcast.publishedAt).format('YYYY-MM-DD(dd)'),
    podcastPrograms,
  )

  return (
    <StyledTimeline>
      {Object.keys(podcastProgramsGroupByDate).map((date: string) => (
        <Timeline.Item key={date}>
          <StyledTitle className="mb-4">{date}</StyledTitle>
          {renderItem &&
            podcastProgramsGroupByDate[date].map(podcastProgram => {
              const isEnrolled = enrolledPodcastPrograms.map(v => v.id).includes(podcastProgram.id)
              const isSubscribed =
                !!podcastProgram.instructor &&
                enrolledPodcastPlansCreators.map(v => v.id).includes(podcastProgram.instructor.id)

              return (
                <StyledProgram key={podcastProgram.id} className="pl-3" id={podcastProgram.id}>
                  {renderItem && renderItem({ podcastProgram, isEnrolled, isSubscribed })}
                </StyledProgram>
              )
            })}
        </Timeline.Item>
      ))}
    </StyledTimeline>
  )
}

export default PodcastProgramTimeline

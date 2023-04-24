import { gql, useQuery } from '@apollo/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import BadgeCard from '../../components/learningAchievement/BadgeCard'
import InfoCard from '../../components/learningAchievement/InfoCard'
import ProgramProgressDetailCard from '../../components/learningAchievement/ProgramProgressDetailCard'
import ProgramSummaryCard from '../../components/learningAchievement/ProgramSummaryCard'
import ProgressBarCard from '../../components/learningAchievement/ProgressBarCard'
import RadarCard from '../../components/learningAchievement/RadarCard'
import learningAchievementMessages from '../../components/learningAchievement/translation'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as LearningAchievementIcon } from '../../images/icon-grid-view.svg'

export type LearnedStatistic = {
  memberId: string
  programCount: number
  programTagOptions: null | { count: number; tagName: string }[]
  avgProgramProgressPercent: number
  totalProgramContentCount: number
  progressProgramContentCount: number
  progressProgramCount: number
  totalProgramTime: number
  progressProgramTime: number
  productOptions: { title: string; productId: string; progressPercent: number }[]
  consecutiveDayOptions: null | { startedDay: string; endedDay: string; consecutiveDay: number }
}

const StyledRowGrid = styled.div`
  display: grid;
  align-items: start;
  gap: 20px;
  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    width: 100%;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }
`

const StyledColGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const learningAchievementTheme = extendTheme({
  components: {
    Popover: {
      variants: {
        responsive: {
          popper: {
            maxWidth: 'unset',
            width: 'unset',
          },
        },
      },
    },
    Table: {
      parts: ['th', 'td'],
      baseStyle: {
        td: {
          borderBottom: '0px',
          border: '#fff',
        },
      },
    },
    Progress: {
      baseStyle: {
        filledTrack: {
          bg: '#049d96',
        },
      },
    },
  },
})

const LearningAchievementPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { learnedStatistic, learnedStatisticLoading, learnedStatisticError } = useLearnedStatistic(
    currentMemberId || '',
  )

  return (
    <ChakraProvider theme={learningAchievementTheme}>
      {!learnedStatisticLoading && (
        <MemberAdminLayout
          content={{
            icon: LearningAchievementIcon,
            title: formatMessage(commonMessages.content.learningAchievement),
            endText: formatMessage(learningAchievementMessages['*'].updateEveryDay, { time: 9 }),
          }}
        >
          <StyledColGrid>
            <InfoCard />
            <StyledRowGrid>
              <ProgramSummaryCard
                programCount={learnedStatistic?.programCount || 0}
                programTagOptions={['溝通表達', '經營領導', '心靈成長', '職場專業', '創業開店', '健康家庭'].map(
                  tag => ({
                    tagName: tag,
                    count: learnedStatistic?.programTagOptions?.find(data => data.tagName === tag)?.count || 0,
                  }),
                )}
              />
              <RadarCard
                programCount={learnedStatistic?.programCount || 0}
                totalProgramContentCount={learnedStatistic?.totalProgramContentCount || 0}
                totalProgramTime={learnedStatistic?.totalProgramTime || 0}
                progressProgramContentCount={learnedStatistic?.progressProgramContentCount || 0}
                progressProgramTime={Math.round(learnedStatistic?.progressProgramTime || 0)}
                progressProgramCount={learnedStatistic?.progressProgramCount || 0}
              />
            </StyledRowGrid>
            <ProgressBarCard />
            <ProgramProgressDetailCard productOptions={learnedStatistic?.productOptions || []} />
            <BadgeCard />
          </StyledColGrid>
        </MemberAdminLayout>
      )}
    </ChakraProvider>
  )
}

const useLearnedStatistic = (memberId: string) => {
  const {
    data: learnedStatisticData,
    loading: learnedStatisticLoading,
    error: learnedStatisticError,
  } = useQuery<hasura.GET_CW_LEARNED_STATISTIC, hasura.GET_CW_LEARNED_STATISTICVariables>(
    gql`
      query GET_CW_LEARNED_STATISTIC($memberId: String!) {
        cw_learned_statistic(where: { member_id: { _eq: $memberId } }) {
          member_id
          program_count
          program_tag_options
          avg_program_progress_percent
          total_program_content_count
          progress_program_content_count
          progress_program_count
          total_program_time
          progress_program_time
          product_options
          consecutive_day_options
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  const { data } = useQuery<hasura.GET_MEMBER_ACHIEVEMENT, hasura.GET_MEMBER_ACHIEVEMENTVariables>(
    gql`
      query GET_MEMBER_ACHIEVEMENT($memberId: String!) {
        member_achievement(where: { member_id: { _eq: $memberId } }) {
          member_id
          created_at
          updated_at
          app_achievement {
            id
            name
            countable
            is_public
            position
            achievement_template {
              picture_url
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const learnedStatistic: LearnedStatistic | undefined = learnedStatisticData?.cw_learned_statistic.map(data => ({
    memberId: memberId || data?.member_id || '',
    programCount: data?.program_count || 0,
    programTagOptions: data?.program_tag_options,
    avgProgramProgressPercent: data?.avg_program_progress_percent || 0,
    totalProgramContentCount: data?.total_program_content_count || 0,
    progressProgramContentCount: data?.progress_program_content_count || 0,
    progressProgramCount: data?.progress_program_count || 0,
    totalProgramTime: data?.total_program_time || 0,
    progressProgramTime: data?.progress_program_time || 0,
    productOptions: data?.product_options,
    consecutiveDayOptions: data?.consecutive_day_options,
  }))[0]
  return { learnedStatistic, learnedStatisticLoading, learnedStatisticError }
}

export default LearningAchievementPage

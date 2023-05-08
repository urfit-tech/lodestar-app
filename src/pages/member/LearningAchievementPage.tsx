import { gql, useQuery } from '@apollo/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { isEmpty } from 'lodash'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
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
import { usePublicMember } from '../../hooks/member'
import { ReactComponent as LearningAchievementIcon } from '../../images/icon-grid-view.svg'

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

export type LearnedStatistic = {
  memberId: string
  programCount: number
  programTagOptions: { count: number; tagName: string }[]
  avgProgramProgressPercent: number
  totalProgramContentCount: number
  progressProgramContentCount: number
  progressProgramCount: number
  totalProgramTime: number
  progressProgramTime: number
  productOptions: { title: string; progressPercent: number; purchasedAt: string }[]
  consecutiveDayOptions: {
    personalConsecutiveDay: number
    personalMaxConsecutiveDay: number
    allMemberMaxConsecutiveDay: number
    allMemberAvgConsecutiveDay: number
  }
}

export type MemberAchievement = {
  memberId: string
  createdAt: Date
  updatedAt: Date
  achievementId: string
  name: string
  countable: boolean
  isPublic: boolean
}

const LearningAchievementPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { currentMemberId } = useAuth()
  const { learnedStatistic, learnedStatisticLoading, learnedStatisticError } = useLearnedStatistic(
    memberId || currentMemberId || '',
  )
  const {
    memberAchievement,
    loading: memberAchievementLoading,
    error: memberAchievementError,
  } = useAchievement(memberId || currentMemberId || '')
  const { member } = usePublicMember(memberId || currentMemberId || '')

  const getAchievementTag = () => {
    const tagFilter = memberAchievement?.filter(a => a.countable)
    if (!tagFilter) return null
    const counts = tagFilter.reduce((acc: any, cur) => {
      if (cur.name in acc) {
        acc[cur.name]++
      } else {
        acc[cur.name] = 1
      }
      return acc
    }, {})

    let maxCount = 0
    let maxName = ''
    for (let name in counts) {
      if (counts[name] > maxCount) {
        maxCount = counts[name]
        maxName = name
      }
    }
    return maxName
  }

  return (
    <ChakraProvider theme={learningAchievementTheme}>
      {!learnedStatisticLoading && learnedStatistic && (
        <MemberAdminLayout
          content={{
            icon: LearningAchievementIcon,
            title: formatMessage(commonMessages.content.learningAchievement),
            endText: formatMessage(learningAchievementMessages['*'].updateEveryDay, { time: 9 }),
          }}
        >
          <StyledColGrid>
            <InfoCard
              avgProgramProgressPercent={learnedStatistic.avgProgramProgressPercent}
              achievementCount={memberAchievement?.length || 0}
              achievementTag={getAchievementTag()}
              memberName={member?.name || ''}
              memberPictureUrl={member?.pictureUrl || ''}
            />
            <StyledRowGrid>
              <ProgramSummaryCard
                programCount={learnedStatistic.programCount}
                programTagOptions={learnedStatistic.programTagOptions}
              />
              <RadarCard
                programCount={learnedStatistic.programCount}
                totalProgramContentCount={learnedStatistic.totalProgramContentCount}
                totalProgramTime={learnedStatistic.totalProgramTime}
                progressProgramContentCount={learnedStatistic.progressProgramContentCount}
                progressProgramTime={Math.floor(learnedStatistic.progressProgramTime)}
                progressProgramCount={learnedStatistic.progressProgramCount}
              />
            </StyledRowGrid>
            <ProgressBarCard consecutiveDayOptions={learnedStatistic.consecutiveDayOptions} />
            <ProgramProgressDetailCard productOptions={learnedStatistic.productOptions} />
            <BadgeCard memberAchievement={memberAchievement || []} />
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
          max_consecutive_day
          avg_consecutive_day
          the_newest_consecutive_day
        }
      }
    `,
    {
      variables: { memberId },
    },
  )

  const { data: consecutiveDayStatisticData } = useQuery<hasura.GET_CW_CONSECUTIVE_DAT_STATISTIC>(gql`
    query GET_CW_CONSECUTIVE_DAT_STATISTIC {
      cw_consecutive_day_statistic {
        max_consecutive_day
        avg_consecutive_day
      }
    }
  `)

  const { data: orderProductPurchaseData } = useQuery<
    hasura.GET_ORDER_PRODUCT_PURCHASED_AT,
    hasura.GET_ORDER_PRODUCT_PURCHASED_ATVariables
  >(
    gql`
      query GET_ORDER_PRODUCT_PURCHASED_AT($productIds: [String!]) {
        order_product(where: { product_id: { _in: $productIds } }) {
          product_id
          created_at
        }
      }
    `,
    {
      variables: {
        productIds: learnedStatisticData?.cw_learned_statistic[0]?.product_options.map(
          (option: { productId: string }) => option?.productId,
        ),
      },
    },
  )

  // hard code
  const tags = ['溝通表達', '經營領導', '心靈成長', '職場專業', '創業開店', '健康家庭']

  const learnedStatistic: LearnedStatistic =
    !isEmpty(learnedStatisticData?.cw_learned_statistic) && learnedStatisticData
      ? learnedStatisticData.cw_learned_statistic.map(data => ({
          memberId: data.member_id || memberId,
          programCount: data.program_count || 0,
          programTagOptions: tags.map(tag => ({
            tagName: tag,
            count:
              data.program_tag_options?.find((data: { tagName: string; count: number }) => data.tagName === tag)
                ?.count || 0,
          })),
          avgProgramProgressPercent: Math.floor(Number((data.avg_program_progress_percent * 100).toFixed(2))) || 0,
          totalProgramContentCount: data.total_program_content_count || 0,
          progressProgramContentCount: data.progress_program_content_count || 0,
          progressProgramCount: data.progress_program_count || 0,
          totalProgramTime: Math.floor(data.total_program_time / 3600) || 0, // hr
          progressProgramTime: Math.floor(data.progress_program_time / 3600) || 0, //hr
          productOptions: data.product_options
            ?.map((option: { title: string; progressPercent: number; productId: string }) => ({
              title: option?.title,
              progressPercent: Math.floor(Number((option?.progressPercent * 100).toFixed(2))),
              purchasedAt: dayjs(
                orderProductPurchaseData?.order_product.find(op => op.product_id === option?.productId)?.created_at,
              ).format('YYYY-MM-DD'),
            }))
            .sort(
              (a: { purchasedAt: string }, b: { purchasedAt: string }) =>
                dayjs(b.purchasedAt).valueOf() - dayjs(a.purchasedAt).valueOf(),
            ),
          consecutiveDayOptions: {
            personalConsecutiveDay: data.the_newest_consecutive_day || 0,
            personalMaxConsecutiveDay: data.max_consecutive_day || 0,
            allMemberMaxConsecutiveDay:
              consecutiveDayStatisticData?.cw_consecutive_day_statistic[0].max_consecutive_day || 0,
            allMemberAvgConsecutiveDay:
              consecutiveDayStatisticData?.cw_consecutive_day_statistic[0].avg_consecutive_day || 0,
          },
        }))[0]
      : {
          memberId,
          programCount: 0,
          programTagOptions: tags.map(tag => ({
            tagName: tag,
            count: 0,
          })),
          avgProgramProgressPercent: 0,
          totalProgramContentCount: 0,
          progressProgramContentCount: 0,
          progressProgramCount: 0,
          totalProgramTime: 0, // hr
          progressProgramTime: 0, //hr
          productOptions: [],
          consecutiveDayOptions: {
            personalConsecutiveDay: 0,
            personalMaxConsecutiveDay: 0,
            allMemberMaxConsecutiveDay: 0,
            allMemberAvgConsecutiveDay: 0,
          },
        }

  return { learnedStatistic, learnedStatisticLoading, learnedStatisticError }
}

const useAchievement = (memberId: string) => {
  const { data, loading, error } = useQuery<hasura.GET_MEMBER_ACHIEVEMENT, hasura.GET_MEMBER_ACHIEVEMENTVariables>(
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

  const memberAchievement: MemberAchievement[] | null = data
    ? data.member_achievement
        .map(a => ({
          memberId: a.member_id || memberId,
          createdAt: a.created_at,
          updatedAt: a.updated_at,
          name: a.app_achievement?.name || '',
          isPublic: !!a.app_achievement?.is_public,
          countable: !!a.app_achievement?.countable,
          achievementId: a.app_achievement?.id,
        }))
        .sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf())
    : null

  return { memberAchievement, loading, error }
}

export default LearningAchievementPage

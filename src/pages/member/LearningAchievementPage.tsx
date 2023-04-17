import React from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as LearningAchievementIcon } from '../../images/icon-grid-view.svg'
import styled from 'styled-components'
import InfoCard from '../../components/learningAchievement/InfoCard'
import ProgramSummaryCard from '../../components/learningAchievement/ProgramSummaryCard'
import RadarCard from '../../components/learningAchievement/RadarCard'
import BadgeCard from '../../components/learningAchievement/BadgeCard'
import ProgressBarCard from '../../components/learningAchievement/ProgressBarCard'
import ProgramProgressDetailCard from '../../components/learningAchievement/ProgramProgressDetailCard'
import { ChakraProvider, extendTheme, Text } from '@chakra-ui/react'
import { BREAK_POINT } from '../../components/common/Responsive'
import learningAchievementMessages from '../../components/learningAchievement/translation'

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

  return (
    <ChakraProvider theme={learningAchievementTheme}>
      <MemberAdminLayout
        content={{
          icon: LearningAchievementIcon,
          title: formatMessage(commonMessages.content.learningAchievement),
          endText: formatMessage(learningAchievementMessages['*'].updateEveryDay,{time: 9}),
        }}
      >
        <StyledColGrid>
          <InfoCard />
          <StyledRowGrid>
            <ProgramSummaryCard />
            <RadarCard />
          </StyledRowGrid>
          <ProgressBarCard />
          <ProgramProgressDetailCard />
          <BadgeCard />
        </StyledColGrid>
      </MemberAdminLayout>
    </ChakraProvider>
  )
}

export default LearningAchievementPage

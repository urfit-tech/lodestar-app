import { Icon } from '@chakra-ui/icons'
import { Typography } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import moment from 'moment'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import EmptyCover from '../../images/empty-cover.png'
import { ProgramPackageProgram } from '../../types/programPackage'
import ProgressBar from '../common/ProgressBar'
import { BREAK_POINT } from '../common/Responsive'
import programMessages from './translation'

const StyledProgramDisplayItem = styled.div`
  border-bottom: 1px solid var(--gray-light);
  margin-bottom: 12px;

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 24px;
  }
`

const StyledWrapper = styled.div`
  width: 100%;
  padding-bottom: 12px;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 0 20px 24px;
  }
`

const StyledProgramCover = styled.div<{ src: string }>`
  border-radius: 4px;
  width: 7rem;
  height: 3.9rem;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`

const StyledProgramInfo = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    align-items: center;
  }
`

const StyledProgramTitle = styled(Typography.Title)`
  && {
    margin: 0;
    overflow: hidden;
    ${CommonTitleMixin}
  }
`

const StyledExpiredTime = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const StyledProgressBar = styled.div`
  width: 100%;
  margin-top: 12px;

  @media (min-width: ${BREAK_POINT}px) {
    width: 100px;
    margin-top: 0;
  }
`

export const ProgramDisplayedListItem: React.VFC<{
  program: ProgramPackageProgram & {
    expiredAt?: Date | null
  }
  memberId?: string | null
}> = ({ program, memberId }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledProgramDisplayItem>
      <StyledWrapper className="d-flex justify-content-between align-items-center">
        <StyledProgramCover className="flex-shrink-0 mr-4" src={program.coverUrl || EmptyCover} />
        <StyledProgramInfo className="flex-grow-1">
          <div>
            <StyledProgramTitle level={2} ellipsis={{ rows: 2 }}>
              {program.title}
            </StyledProgramTitle>
            {program.expiredAt && (
              <StyledExpiredTime className="mt-1 d-flex align-items-center">
                <Icon as={CalendarOIcon} className="mr-1" />
                <span className="mr-1">{moment(program.expiredAt).format('YYYY-MM-DD')}</span>
                <span>{formatMessage(programMessages.ProgramDisplayedListItem.expiredAt)}</span>
              </StyledExpiredTime>
            )}
          </div>
          {memberId && (
            <StyledProgressBar className="flex-shrink-0">
              <ProgressBar percent={program.viewRate ? Math.floor(program.viewRate * 100) : 0} />
            </StyledProgressBar>
          )}
        </StyledProgramInfo>
      </StyledWrapper>
    </StyledProgramDisplayItem>
  )
}

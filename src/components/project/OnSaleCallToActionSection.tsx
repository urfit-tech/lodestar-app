import { Button, Icon } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import ProjectEnrollmentCounts from '../../containers/project/ProjectEnrollmentCounts'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'

const StyledJoin = styled.div`
  background-color: #563952;
  padding: 64px 0;
  margin-bottom: 76px;

  h3 {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 420px;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 0.77px;
    text-align: center;
    color: white;

    &::before {
      position: absolute;
      bottom: 0px;
      left: -15px;
      content: url('https://static.kolable.com/images/xuemi/shine-01.svg');
    }

    &::after {
      position: absolute;
      bottom: -130px;
      right: -10px;
      content: url('https://static.kolable.com/images/xuemi/shine-02.svg');
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 80px 0;

    h3 {
      font-size: 28px;
      max-width: 560px;

      &::before {
        bottom: 0px;
        left: -100px;
      }

      &::after {
        top: 15px;
        right: -120px;
      }
    }
  }
`
const StyledHeader = styled.h3`
  > span {
    display: block;
    margin: 0 auto;
    text-align: center;
  }
`
const StyledButton = styled(Button)`
  display: block;
  margin: 40px auto 0;
`
const StyledView = styled.div`
  z-index: 10;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #323232;

  p {
    color: white;
    margin: 0;
    padding-right: 16px;
    span:first-child {
      display: none;
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    p span:first-child {
      display: inline-block;
    }
  }
`
const StyledWrapper = styled.div`
  padding: 20px;
`
const StyledSlogan = styled.div`
  font-size: 14px;
  color: white;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 16px;
  }
`
const StyledCountDownTime = styled.div`
  color: white;

  .icon {
    display: none;

    @media (min-width: ${BREAK_POINT}px) {
      display: inline-block;
    }
  }
`

type OnSaleCallToActionSectionProps = {
  projectId: string
  updates: {
    headers: string[]
    promotes: string[]
    callToAction: string
  }
  expiredAt: Date | null
}
const OnSaleCallToActionSection: React.FC<OnSaleCallToActionSectionProps> = ({ projectId, updates, expiredAt }) => {
  const { formatMessage } = useIntl()

  return (
    <section className="d-flex flex-column">
      <StyledJoin className="d-flex justify-content-center align-items-center">
        <div className="container">
          <StyledHeader>
            {updates.headers.map(header => (
              <span key={header}>{header}</span>
            ))}
          </StyledHeader>
          <StyledButton
            coloScheme="primary"
            onClick={() => document.getElementById('project-plan-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>
              與 <ProjectEnrollmentCounts projectId={projectId} numberOnly /> 人一起參與
            </span>
          </StyledButton>
        </div>
      </StyledJoin>
      <StyledView className="d-flex align-items-center">
        <StyledWrapper className="container">
          <div className="row">
            <StyledSlogan className="col-8 col-lg-10 d-flex flex-wrap justify-content-between align-items-center">
              <div>
                {updates.promotes.map(promote => (
                  <span key={promote}>{promote}</span>
                ))}
                <span>
                  已有 <ProjectEnrollmentCounts projectId={projectId} numberOnly /> 人一起學習
                </span>
              </div>
              <StyledCountDownTime className="d-flex align-items-center justify-content-between">
                {<Icon as={CalendarOIcon} className="icon mr-2" />}
                {expiredAt && <CountDownTimeBlock expiredAt={expiredAt} />}
              </StyledCountDownTime>
            </StyledSlogan>
            <Button
              coloScheme="primary"
              className="col-4 col-lg-2"
              onClick={() => document.getElementById('project-plan-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span>{formatMessage(commonMessages.button.viewProject)}</span>
            </Button>
          </div>
        </StyledWrapper>
      </StyledView>
    </section>
  )
}

export default OnSaleCallToActionSection

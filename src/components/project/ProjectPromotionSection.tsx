import { Icon } from '@chakra-ui/icons'
import { Button } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'

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

type ProjectPromotionSectionProps = {
  promotions: string[]
  expiredAt: Date | null
  button: {
    label: string
    href: string
  }
}
const ProjectPromotionSection: React.FC<ProjectPromotionSectionProps> = ({ promotions, expiredAt, button }) => {
  return (
    <StyledView className="d-flex align-items-center">
      <StyledWrapper className="container">
        <div className="row">
          <StyledSlogan className="col-8 col-lg-10 d-flex flex-wrap justify-content-between align-items-center">
            <div>
              {promotions.map(promotion => (
                <span key={promotion}>{promotion}</span>
              ))}
            </div>
            <StyledCountDownTime className="d-flex align-items-center justify-content-between">
              {<Icon as={CalendarOIcon} className="icon mr-2" />}
              {expiredAt && <CountDownTimeBlock text="開課倒數" expiredAt={expiredAt} />}
            </StyledCountDownTime>
          </StyledSlogan>
          <Button
            type="primary"
            className="col-4 col-lg-2"
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{button.label}</span>
          </Button>
        </div>
      </StyledWrapper>
    </StyledView>
  )
}

export default ProjectPromotionSection

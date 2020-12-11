import { Icon } from '@chakra-ui/icons'
import React from 'react'
import styled from 'styled-components'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { BREAK_POINT } from '../common/Responsive'
import FundingCoverBlock from './FundingCoverBlock'
import ProjectCalloutButton, { Callout } from './ProjectCalloutButton'

const StyledSection = styled.section`
  position: relative;

  > img {
    display: none;
  }
  @media (min-width: ${BREAK_POINT}px) {
    > img {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 300px;
      z-index: 1;
    }
  }
`
const StyledCountDownBlock = styled.div`
  z-index: 10;
`
const StyledCover = styled.div`
  padding-bottom: 40px;
  .row {
    padding-top: 40px;
  }
  .col-lg-7 {
    z-index: 4;
  }
  img {
    display: none;
  }
  @media (min-width: ${BREAK_POINT}px) {
    padding-bottom: 100px;
    .row {
      padding-top: 60px;
      align-items: flex-end;
    }
    .col-lg-7 {
      align-items: flex-end;
    }
    img {
      display: block;
    }
  }
`
const StyledCountDownTime = styled.div`
  background-color: #fff;
  border-radius: 4px;
  width: 100%;
  height: 56px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

  .text-primary {
    color: ${props => props.theme['@primary-color']};
  }

  @media (max-width: ${BREAK_POINT}px) {
    .discount-down::before {
      content: '優惠';
    }
  }
`
const StyledTitle = styled.h1`
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  font-size: 40px;
  line-height: 1.3;
  letter-spacing: 1px;
  @media (min-width: ${BREAK_POINT}px) {
    font-size: 60px;
    line-height: 1.35;
    letter-spacing: 1.5px;
  }
`
const StyledSubtitle = styled.h2`
  font-size: 28px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 4px;
  color: #ffc129;
`
const StyledDescription = styled.div`
  margin-bottom: 40px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.69;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
  > div:first-child {
    display: inline-block;
    border-top: 4px solid #ffc129;
    padding: 40px 0;
  }
`

type ProjectBannerSectionProps = {
  title: string
  abstract: string
  description: string
  url: string
  type: string
  expiredAt: Date | null
  backgroundImage: string
  callout?: Callout
}
const ProjectBannerSection: React.FC<ProjectBannerSectionProps> = ({
  title,
  abstract,
  description,
  url,
  type,
  expiredAt,
  backgroundImage,
  callout,
}) => {
  return (
    <StyledSection>
      <img src={backgroundImage} alt="background" />
      <div className="container pt-5">
        <div className="row flex-row-reverse">
          <StyledCountDownBlock className="col-12 col-lg-4">
            <StyledCountDownTime className="d-flex align-items-center justify-content-center">
              {<Icon as={CalendarOIcon} className="mr-2" />}
              {expiredAt && <CountDownTimeBlock text="開課倒數" expiredAt={expiredAt} />}
            </StyledCountDownTime>
          </StyledCountDownBlock>
        </div>
      </div>
      <StyledCover className="container">
        <div className="row">
          <div className="col-12 col-lg-5">
            <StyledTitle>{title}</StyledTitle>
            <StyledSubtitle>{abstract}</StyledSubtitle>
            <StyledDescription>
              {description.split('\n').map(description => (
                <div key={description}>{description}</div>
              ))}
            </StyledDescription>
            {callout && (
              <div style={{ marginBottom: 40 }}>
                <ProjectCalloutButton href={callout.href} label={callout.label} />
              </div>
            )}
          </div>
          <div className="col-12 col-lg-7">
            <FundingCoverBlock coverType={type} coverUrl={url} />
          </div>
        </div>
      </StyledCover>
    </StyledSection>
  )
}

export default ProjectBannerSection

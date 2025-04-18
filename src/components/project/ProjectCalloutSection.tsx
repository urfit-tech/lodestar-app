import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'
import ProjectCalloutButton, { Callout } from './ProjectCalloutButton'

const StyledJoin = styled.div`
  background-color: #ffeae3;
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
    color: var(--gray-darker);

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

type ProjectCalloutSectionProps = {
  title: string
  callout?: Callout
}
const ProjectCalloutSection: React.FC<ProjectCalloutSectionProps> = ({ title, callout }) => {
  return (
    <section className="d-flex flex-column">
      <StyledJoin className="d-flex justify-content-center align-items-center">
        <div className="container">
          <StyledHeader>
            {title.split(';').map((value, idx) => (
              <span key={idx}>{value}</span>
            ))}
          </StyledHeader>
          <div className="pt-4 d-flex justify-content-center">
            {callout && <ProjectCalloutButton href={callout.href} label={callout.label} />}
          </div>
        </div>
      </StyledJoin>
    </section>
  )
}

export default ProjectCalloutSection

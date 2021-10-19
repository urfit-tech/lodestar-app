import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import MemberAvatar from '../../../components/common/MemberAvatar'
import { BREAK_POINT } from '../../../components/common/Responsive'
import { productMessages } from '../../../helpers/translation'
import { Program, ProgramRole } from '../../../types/program'

const StyledTags = styled.div`
  margin-bottom: 1rem;
  color: white;
  font-size: 14px;
`
const StyledTitle = styled.h1`
  margin: 0;
  color: white;
  font-size: 28px;
  line-height: 1.23;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
  }
`
const StyledVideoWrapper = styled.div<{ backgroundImage?: string }>`
  position: relative;
  padding-top: 56.25%;
  ${props => props.backgroundImage && `background-image: url(${props.backgroundImage});`}
  background-size: cover;
  background-position: center;
`
const StyledPlayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: black;
`

const StyledWrapper = styled.div`
  background: #f7f8f8;

  ${StyledTags} {
    color: #9b9b9b;
  }
  ${StyledTitle} {
    color: #585858;
    margin-bottom: 2rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`
const StyledMediaBlock = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    order: 1;
    width: ${(700 / 12).toFixed(6)}%;
  }
`
const StyledTitleBlock = styled.div`
  width: 100%;
  padding: 1.5rem;

  @media (min-width: ${BREAK_POINT}px) {
    max-width: 520px;
  }
`
const StyledTag = styled.span`
  padding: 2px 8px;
  border: 1px solid #cdcdcd;
  border-radius: 12px;
  font-size: 12px;
`

const StyledLink = styled(Link)`
  color: #9b9b9b;
`

const SubscriptionProgramBanner: React.VFC<{
  program: Program & {
    tags: string[]
    roles: ProgramRole[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const instructorId = program.roles.filter(role => role.name === 'instructor').map(role => role.memberId)[0] || ''

  return (
    <StyledWrapper id="program-banner">
      <StyledMediaBlock>
        <StyledVideoWrapper backgroundImage={program.coverUrl || ''}>
          {program.coverVideoUrl && (
            <StyledPlayer>
              <video
                className="smartvideo"
                src={program.coverVideoUrl}
                controls
                autoPlay
                style={{ width: '100%', height: '100%' }}
              />
            </StyledPlayer>
          )}
        </StyledVideoWrapper>
      </StyledMediaBlock>

      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <StyledTitleBlock>
          <StyledTags>
            <StyledTag className="mr-2">{formatMessage(productMessages.program.content.subscribe)}</StyledTag>
            {program.tags.map(programTag => (
              <StyledLink key={programTag} to={`/search?tag=${programTag}&tab=programs`} className="mr-2">
                #{programTag}
              </StyledLink>
            ))}
          </StyledTags>
          <StyledTitle>{program.title}</StyledTitle>
          <MemberAvatar memberId={instructorId} withName={true} />
        </StyledTitleBlock>
      </div>
    </StyledWrapper>
  )
}

export default SubscriptionProgramBanner

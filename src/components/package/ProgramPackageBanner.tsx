import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ReactComponent as ListOIcon } from '../../images/list-o.svg'
import BlurredBanner from '../common/BlurredBanner'
import { BREAK_POINT } from '../common/Responsive'

const messages = defineMessages({
  decorationPart1: { id: 'programPackage.label.decorationPart1', defaultMessage: '課程' },
  decorationPart2: { id: 'programPackage.label.decorationPart2', defaultMessage: '組合' },
  introduction: { id: 'programPackage.label.introduction', defaultMessage: '簡介' },
})

const StyledWrapper = styled.div`
  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem 0;
  }
`
const StyledCenterBox = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 2.5rem 6rem 2.5rem 1.5rem;
  width: 100%;
  max-width: 600px;
  color: white;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 5.25rem 6rem;
    border: 1px solid white;
    text-align: center;
  }
`
const StyledDecoration = styled.div`
  position: absolute;
  top: 0;
  right: 1rem;
  overflow: hidden;
  padding: 10px 12px 20px;

  span {
    z-index: 2;
    position: relative;
    font-size: 14px;
    font-weight: bold;
    line-height: 1.29;
    letter-spacing: 0.18px;
  }

  ::before,
  ::after {
    z-index: 1;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${props => props.theme['@primary-color']};
    content: '';
  }

  ::before {
    transform-origin: left bottom;
    transform: skewY(-20deg);
  }

  ::after {
    transform-origin: right bottom;
    transform: skewY(20deg);
  }
`
const StyledTitle = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 0.23px;

  @media (min-width: ${BREAK_POINT}px) {
    font-size: 40px;
  }
`

const StyledEntrolledLink = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  a {
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.18px;
    color: white;
  }
  i {
    vertical-align: sub;
  }
`

type ProgramPackageBannerProps = {
  title: string
  coverUrl?: string | null
  programPackageId: string
  isEnrolled?: boolean
}
const ProgramPackageBanner: React.VFC<ProgramPackageBannerProps> = ({
  title,
  coverUrl,
  programPackageId,
  isEnrolled,
}) => {
  const { formatMessage } = useIntl()
  return (
    <BlurredBanner coverUrl={{ desktopUrl: coverUrl || undefined }}>
      {isEnrolled && (
        <StyledEntrolledLink>
          <Link to={`/program-packages/${programPackageId}`}>
            <Icon as={ListOIcon} className="mr-2" />
            <span>{formatMessage(messages.introduction)}</span>
          </Link>
        </StyledEntrolledLink>
      )}

      <StyledWrapper>
        <StyledCenterBox>
          <StyledDecoration>
            <div
              dangerouslySetInnerHTML={{
                __html: '<span>{{part1}}<br>{{part2}}</span>'
                  .replace('{{part1}}', formatMessage(messages.decorationPart1))
                  .replace('{{part2}}', formatMessage(messages.decorationPart2)),
              }}
            />
          </StyledDecoration>
          <StyledTitle className="mb-3">{title}</StyledTitle>
        </StyledCenterBox>
      </StyledWrapper>
    </BlurredBanner>
  )
}

export default ProgramPackageBanner

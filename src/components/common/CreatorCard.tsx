import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { CommonTitleMixin } from '.'
import { useApp } from '../../containers/common/AppContext'
import { desktopViewMixin } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { ProgramRoleName } from '../../types/program'
import { AvatarImage } from './Image'
import ProductRoleFormatter from './ProductRoleFormatter'
import { BREAK_POINT } from './Responsive'

const StyledWrapper = styled.div`
  padding: 2.5rem 1.5rem;
  background: white;
  text-align: center;

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    align-items: center;
    padding: 2.5rem;
    text-align: left;
  }
`
const AvatarBlock = styled.div`
  margin-bottom: 2.5rem;

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0;
    margin-right: 2.5rem;
  }
`
const StyledTitle = styled.div`
  justify-content: center;
  ${CommonTitleMixin}

  a {
    color: var(--gray-darker);
  }

  @media (min-width: ${BREAK_POINT}px) {
    justify-content: start;
  }
`
const StyledLabel = styled.span`
  padding: 2px 0.5rem;
  background: ${props => props.theme['@primary-color']};
  color: white;
  font-size: 12px;
  font-weight: normal;
  line-height: normal;
  letter-spacing: 0.58px;
  border-radius: 11px;
`
const StyledJobTitle = styled.div`
  margin-top: 0.75rem;
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 1.5rem;
  max-height: 3rem;
  color: var(--gray-darker);
  letter-spacing: 0.2px;
  text-align: center;
  white-space: pre-line;

  ${desktopViewMixin(css`
    text-align: justify;
  `)}
`
const StyledAction = styled.div`
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0 1rem;
  font-size: 14px;

  &:not(:first-child) {
    border-left: 1px solid var(--gray-light);
  }

  @media (min-width: ${BREAK_POINT}px) {
    &:first-child {
      padding-left: 0;
    }
  }
`

const CreatorCard: React.VFC<{
  id: string
  avatarUrl?: string | null
  title: string
  labels?: {
    id: string
    name: string
  }[]
  jobTitle?: string | null
  description?: string | null
  withProgram?: boolean
  withPodcast?: boolean
  withAppointment?: boolean
  withBlog?: boolean
  noPadding?: boolean
}> = ({
  id,
  avatarUrl,
  title,
  labels,
  jobTitle,
  description,
  withProgram,
  withPodcast,
  withAppointment,
  withBlog,
  noPadding,
}) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()

  return (
    <StyledWrapper className={noPadding ? 'p-0' : ''}>
      <AvatarBlock className="flex-shrink-0">
        <Link to={`/creators/${id}?tabkey=introduction`}>
          <AvatarImage src={avatarUrl} size={128} className="mx-auto" />
        </Link>
      </AvatarBlock>

      <div className="flex-grow-1">
        <StyledTitle className="d-flex align-items-center">
          <Link to={`/creators/${id}?tabkey=introduction`}>{title}</Link>
          {!!labels &&
            labels.map(label => (
              <StyledLabel key={label.id} className="ml-2">
                <ProductRoleFormatter value={label.name as ProgramRoleName} />
              </StyledLabel>
            ))}
        </StyledTitle>

        {!!jobTitle && <StyledJobTitle>{jobTitle}</StyledJobTitle>}
        {!!description && <StyledDescription>{description}</StyledDescription>}

        <div>
          {withProgram && (
            <StyledAction>
              <Link to={`/creators/${id}?tabkey=programs`}>{formatMessage(commonMessages.content.addCourse)}</Link>
            </StyledAction>
          )}
          {withPodcast && enabledModules.podcast && (
            <StyledAction>
              <Link to={`/creators/${id}?tabkey=podcasts`}>{formatMessage(commonMessages.content.podcasts)}</Link>
            </StyledAction>
          )}
          {withAppointment && enabledModules.appointment && (
            <StyledAction>
              <Link to={`/creators/${id}?tabkey=appointments`}>
                {formatMessage(commonMessages.content.appointments)}
              </Link>
            </StyledAction>
          )}
          {withBlog && enabledModules.blog && (
            <StyledAction>
              <Link to={`/creators/${id}?tabkey=posts`}>{formatMessage(commonMessages.content.blog)}</Link>
            </StyledAction>
          )}
        </div>
      </div>
    </StyledWrapper>
  )
}

export default CreatorCard

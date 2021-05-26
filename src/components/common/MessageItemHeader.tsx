import { Tag } from 'antd'
import moment from 'moment'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { ProductRoleName } from '../../types/general'
import { ProgramRoleProps } from '../../types/program'
import MemberAvatar from '../common/MemberAvatar'
import ProductRoleFormatter from '../common/ProductRoleFormatter'

const StyledTag = styled(Tag)<{ variant?: string }>`
  &.ant-tag-has-color {
    ${props => (props.variant && props.variant === 'assistant' ? `color: ${props.theme['@primary-color']};` : '')}
  }
`

const MessageItemHeader: React.VFC<{
  programRoles: ProgramRoleProps[]
  memberId: string
  createdAt: Date
}> = ({ programRoles, memberId, createdAt }) => {
  const theme = useContext(ThemeContext)
  return (
    <div className="d-flex align-items-center justify-content-between mb-2">
      <div className="d-flex align-items-center justify-content-center">
        <MemberAvatar
          memberId={memberId}
          renderText={() =>
            programRoles
              .filter(role => role.memberId === memberId)
              .map(role =>
                role.name === 'instructor' ? (
                  <StyledTag key={role.id} color={theme['@primary-color']} className="ml-2 mr-0">
                    <ProductRoleFormatter value={role.name as ProductRoleName} />
                  </StyledTag>
                ) : role.name === 'assistant' ? (
                  <StyledTag key={role.id} color={theme['@processing-color']} className="ml-2 mr-0" variant="assistant">
                    <ProductRoleFormatter value={role.name as ProductRoleName} />
                  </StyledTag>
                ) : null,
              )
          }
          withName
        />
        <span className="ml-2" style={{ fontSize: '12px', color: '#9b9b9b' }}>
          {moment(createdAt).fromNow()}
        </span>
      </div>
    </div>
  )
}

export default MessageItemHeader

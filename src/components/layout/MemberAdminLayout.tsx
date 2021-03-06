import { Icon } from '@chakra-ui/icons'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { useRouteKeys } from '../../hooks/util'
import { MemberAdminMenu } from '../common/AdminMenu'
import Responsive from '../common/Responsive'
import DefaultLayout from './DefaultLayout'

const StyledContent = styled.div<{ white?: boolean; footerHeight: number }>`
  min-width: 240px;
  height: calc(100vh - 64px - ${props => props.footerHeight}px);
  overflow-y: auto;
  overflow-x: hidden;
  ${props => (props.white ? 'background: white;' : '')}
`

const StyledHeading = styled.h2`
  font-family: NotoSansCJKtc;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledLink = styled(Link)`
  color: ${props => props.theme['@primary-color']};
  &&:hover {
    color: ${props => props.theme['@primary-color']}bf;
  }
`

const MemberAdminLayout: React.FC<{
  content: {
    title: string
    icon?: React.FC
  }
}> = ({ content, children }) => {
  const defaultSelectedKeys = useRouteKeys()
  const { formatMessage } = useIntl()

  return (
    <DefaultLayout
      noFooter
      renderTitle={() => <StyledLink to={`/settings`}>{formatMessage(commonMessages.button.backstage)}</StyledLink>}
    >
      <div className="d-flex">
        <Responsive.Desktop>
          <StyledContent className="pl-5 py-5" footerHeight={0}>
            <MemberAdminMenu defaultSelectedKeys={defaultSelectedKeys} />
          </StyledContent>
        </Responsive.Desktop>
        <StyledContent className="flex-grow-1 p-3 p-sm-5" footerHeight={0}>
          <StyledHeading className="d-flex mb-4">
            <Icon as={content.icon} className="my-auto mr-3" />
            <span>{content.title}</span>
          </StyledHeading>
          {children}
        </StyledContent>
      </div>
    </DefaultLayout>
  )
}

export default MemberAdminLayout

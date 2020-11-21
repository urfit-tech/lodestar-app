import { Button } from 'antd'
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

const MemberAdminLayout: React.FC = ({ children }) => {
  const defaultSelectedKeys = useRouteKeys()
  const { formatMessage } = useIntl()

  return (
    <DefaultLayout
      noFooter
      renderTitle={() => (
        <Link to={`/settings`}>
          <Button type="link">{formatMessage(commonMessages.button.backstage)}</Button>
        </Link>
      )}
    >
      <div className="d-flex">
        <Responsive.Desktop>
          <StyledContent className="pl-5 py-5" footerHeight={0}>
            <MemberAdminMenu defaultSelectedKeys={defaultSelectedKeys} />
          </StyledContent>
        </Responsive.Desktop>
        <StyledContent className="flex-grow-1 p-3 p-sm-5" footerHeight={0}>
          {children}
        </StyledContent>
      </div>
    </DefaultLayout>
  )
}

export default MemberAdminLayout

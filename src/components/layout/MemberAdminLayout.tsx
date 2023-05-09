import { Icon } from '@chakra-ui/icons'
import { Box, Spacer, Text } from '@chakra-ui/layout'
import { Icon as AntdIcon, message } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { filter } from 'ramda'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { useAuthModal } from '../../hooks/auth'
import { AuthModalContext } from '../auth/AuthModal'
import { MemberAdminMenu } from '../common/AdminMenu'
import { useAppRouter } from '../common/AppRouter'
import PageHelmet from '../common/PageHelmet'
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
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const MemberAdminLayout: React.FC<{
  content: {
    title: string
    icon?: React.FC
    endText?: string
  }
}> = ({ content, children }) => {
  const location = useLocation()
  const { routesMap } = useAppRouter()
  const { isAuthenticating, isAuthenticated, currentMemberId } = useAuth()
  const defaultSelectedKeys = Object.keys(filter(routeProps => routeProps.path === location.pathname, routesMap))
  const { renderMemberAdminMenu } = useCustomRenderer()
  const authModal = useAuthModal()
  const history = useHistory()
  const { logout } = useAuth()

  return (
    <DefaultLayout noFooter>
      <PageHelmet title={content.title} />
      <div className="d-flex">
        <Responsive.Desktop>
          <StyledContent className="py-5" footerHeight={0}>
            <MemberAdminMenu renderAdminMenu={renderMemberAdminMenu} defaultSelectedKeys={defaultSelectedKeys} />
            <ul
              className="ant-menu ant-menu-light ant-menu-root ant-menu-inline"
              style={{ marginTop: '20px', paddingRight: '5px', background: 'transparent', border: 'none' }}
            >
              <li
                className="ant-menu-item"
                style={{ display: 'flex', paddingLeft: '3rem', alignItems: 'center', borderRadius: '0 100px 100px 0' }}
                onClick={() => {
                  logout && logout()
                  history.push('/')
                  message.success('已成功登出')
                }}
              >
                <AntdIcon type="logout" className="mr-2" />
                登出
              </li>
            </ul>
          </StyledContent>
        </Responsive.Desktop>
        <StyledContent className="flex-grow-1 p-3 p-sm-5" footerHeight={0}>
          <StyledHeading className="d-flex mb-4">
            <Icon as={content.icon} className="my-auto mr-3" />
            <span>{content.title}</span>
            <Spacer />
            <Box display="flex" alignItems="center">
              <Text color="var(--gray-dark)" fontSize="xs">
                {content.endText}
              </Text>
            </Box>
          </StyledHeading>
          {children}
        </StyledContent>
      </div>
      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => {
          if (!isAuthenticating && !isAuthenticated && !currentMemberId) {
            authModal.open(setAuthModalVisible)
          }
          return <></>
        }}
      </AuthModalContext.Consumer>
    </DefaultLayout>
  )
}

export default MemberAdminLayout

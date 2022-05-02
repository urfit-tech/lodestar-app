import { Icon } from '@chakra-ui/icons'
import { filter } from 'ramda'
import React from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { MemberAdminMenu } from '../common/AdminMenu'
import { useAppRouter } from '../common/AppRouter'
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
  }
}> = ({ content, children }) => {
  const location = useLocation()
  const { routesMap } = useAppRouter()
  const defaultSelectedKeys = Object.keys(filter(routeProps => routeProps.path === location.pathname, routesMap))
  const { renderMemberAdminMenu } = useCustomRenderer()

  return (
    <DefaultLayout noFooter>
      <div className="d-flex">
        <Responsive.Desktop>
          <StyledContent className="py-5" footerHeight={0}>
            <MemberAdminMenu renderAdminMenu={renderMemberAdminMenu} defaultSelectedKeys={defaultSelectedKeys} />
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

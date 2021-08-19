import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Collapse, useDisclosure } from '@chakra-ui/react'
import { Button, Icon, List, message, Popover } from 'antd'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AppNavProps, useApp } from '../../containers/common/AppContext'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import PodcastPlayerContext from '../../contexts/PodcastPlayerContext'
import { commonMessages } from '../../helpers/translation'
import { useNav } from '../../hooks/data'
import { useAuth } from '../auth/AuthContext'
import { MemberAdminMenu } from './AdminMenu'
import GlobalSearchInput from './GlobalSearchInput'
import MemberAvatar from './MemberAvatar'
import Responsive from './Responsive'

export const Wrapper = styled.div`
  padding: 12px 0;
  width: 100vw;
  max-width: 320px;
`
export const StyledList = styled(List)`
  && {
    padding: 0 12px;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;

    a {
      color: rgba(0, 0, 0, 0.65);
    }
  }
`
const BlankIcon = styled.i`
  display: inline-block;
  width: 16px;
  height: 16px;
`
const BorderedItem = styled(List.Item)`
  border-bottom: 1px solid #e8e8e8;

  &.shift-left {
    margin-left: -24px;
    margin-right: -12px;
  }
`
const StyledCollapseIconWrapper = styled(Box)`
  && {
    margin: auto 0;
  }
`

export const CollapseNavLinks: React.VFC<{ nav: AppNavProps }> = ({ nav }) => {
  const { isOpen, onToggle } = useDisclosure()

  const ListItem = (
    <List.Item key={nav.id} style={{ cursor: 'pointer' }}>
      {nav.icon ? <Icon type={nav.icon} className="mr-2" /> : <BlankIcon className="mr-2" />}
      {nav.label}
    </List.Item>
  )

  return (
    <>
      {nav.href ? (
        <>
          {nav.external ? (
            <a key={nav.id} href={nav.href} target="_blank" rel="noopener noreferrer">
              {ListItem}
            </a>
          ) : (
            <Link key={nav.id} to={nav.href}>
              {ListItem}
            </Link>
          )}
        </>
      ) : (
        <>
          <Box d="flex" justifyContent="space-between" cursor="pointer" onClick={onToggle}>
            <Box>{ListItem}</Box>
            <StyledCollapseIconWrapper>
              {isOpen ? <ChevronDownIcon w="16px" /> : <ChevronRightIcon w="16px" />}
            </StyledCollapseIconWrapper>
          </Box>
          <Collapse in={isOpen} animateOpacity style={{ background: '#f7f8f8', margin: '0 -12px' }}>
            {nav.subNavs.map(subNav => {
              const navListItem = (
                <List.Item key={subNav.id}>
                  {subNav.icon ? <Icon type={subNav.icon} className="mr-2" /> : <BlankIcon className="mr-2" />}
                  {subNav.label}
                </List.Item>
              )
              return (
                <Box ml="3rem" style={{ cursor: 'pointer' }}>
                  {subNav.external ? (
                    <a key={subNav.id} href={subNav.href} target="_blank" rel="noopener noreferrer">
                      {navListItem}
                    </a>
                  ) : (
                    <Link key={subNav.id} to={subNav.href}>
                      {navListItem}
                    </Link>
                  )}
                </Box>
              )
            })}
          </Collapse>
        </>
      )}
    </>
  )
}

export const CustomNavLinks: React.VFC = () => {
  const { navs } = useNav()

  return (
    <>
      {navs
        .filter(nav => nav.block === 'header')
        .map(nav => {
          return <CollapseNavLinks nav={nav} />
        })}
    </>
  )
}

const DefaultLogout: React.VFC<{ onClick?: React.MouseEventHandler<HTMLDivElement> }> = ({ onClick }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { closePlayer } = useContext(PodcastPlayerContext)
  const { logout } = useAuth()

  return (
    <List.Item
      className="cursor-pointer"
      onClick={
        onClick ||
        (() => {
          closePlayer && closePlayer()
          logout && logout()
          history.push('/')
          message.success('已成功登出')
        })
      }
    >
      <Icon type="logout" className="mr-2" />
      {formatMessage(commonMessages.content.logout)}
    </List.Item>
  )
}

const MemberProfileButton: React.VFC<{
  id: string
  name: string
  username: string
  email: string
  pictureUrl: string
}> = member => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { closePlayer } = useContext(PodcastPlayerContext)
  const { renderMemberProfile, renderMemberAdminMenu, renderLogout } = useCustomRenderer()
  const { logout } = useAuth()
  const { enabledModules } = useApp()

  const content = (
    <Wrapper>
      <StyledList split={false}>
        {enabledModules.search && (
          <Responsive.Default>
            <GlobalSearchInput />
          </Responsive.Default>
        )}

        <BorderedItem className="justify-content-between">
          {renderMemberProfile?.(member) || (
            <>
              <div>{member.name}</div>
              <Responsive.Default>
                <MemberAvatar memberId={member.id} size={36} />
              </Responsive.Default>
            </>
          )}
        </BorderedItem>

        <Responsive.Default>
          <CustomNavLinks />
          <BorderedItem onClick={() => history.push(`/members/${member.id}`)} style={{ cursor: 'pointer' }}>
            <BlankIcon className="mr-2" />
            {formatMessage(commonMessages.content.myPage)}
          </BorderedItem>
        </Responsive.Default>

        <BorderedItem className="shift-left">
          <MemberAdminMenu renderAdminMenu={renderMemberAdminMenu} style={{ border: 'none' }} />
        </BorderedItem>

        {renderLogout?.({
          logout: () => {
            closePlayer?.()
            logout?.()
          },
          DefaultLogout,
        }) || <DefaultLogout />}
      </StyledList>
    </Wrapper>
  )

  return (
    <Popover placement="bottomRight" trigger="click" content={content}>
      <Responsive.Default>
        <Button type="link" icon="menu" />
      </Responsive.Default>

      <Responsive.Desktop>
        <div className="cursor-pointer">
          {renderMemberProfile?.(member) || <MemberAvatar memberId={member.id} size={36} />}
        </div>
      </Responsive.Desktop>
    </Popover>
  )
}

export default MemberProfileButton

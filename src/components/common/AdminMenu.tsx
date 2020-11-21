import { useQuery } from '@apollo/react-hooks'
import { SettingsIcon } from '@chakra-ui/icons'
import { Menu } from 'antd'
import { ClickParam, MenuProps } from 'antd/lib/menu'
import gql from 'graphql-tag'
import React from 'react'
import Icon from 'react-inlinesvg'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../hooks/card'
import { useSocialCardCollection } from '../../hooks/member'
import BookIcon from '../../images/book.svg'
import ClipboardListIcon from '../../images/clipboard-list.svg'
import CoinIcon from '../../images/coin.svg'
import CommentsIcon from '../../images/comments.svg'
import GiftIcon from '../../images/gift.svg'
import IdentityIcon from '../../images/identity.svg'
import MemberCardIcon from '../../images/membercard.svg'
import TicketIcon from '../../images/ticket.svg'
import UserIcon from '../../images/user.svg'
import { routesProps } from '../../Routes'
import types from '../../types'
import { useAuth } from '../auth/AuthContext'

const StyledMenu = styled(Menu)`
  && {
    border-right: none;
  }

  & .ant-menu-item-selected.creatorManagementSystem {
    background: none !important;
  }
`

const AdminMenu: React.FC<MenuProps> = ({ children, ...menuProps }) => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const history = useHistory()

  const { managementDomain } = useManagementDomain(appId)

  const handleClick = ({ key, item }: ClickParam) => {
    if (key.startsWith('_blank')) {
      window.open(item.props['data-href'])
    } else if (key.startsWith('creator_management_system')) {
      window.open(`//${managementDomain?.domain[0]}`)
    } else {
      const route = routesProps[key]
      route ? history.push(route.path) : alert(formatMessage(commonMessages.alert.noPath))
    }
  }

  return (
    <StyledMenu {...menuProps} mode="inline" onClick={handleClick}>
      {children}
    </StyledMenu>
  )
}

export const MemberAdminMenu: React.FC<MenuProps> = ({ ...props }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole } = useAuth()
  const { enabledModules, settings } = useApp()
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')
  const { socialCards } = useSocialCardCollection()

  return (
    <AdminMenu {...props} style={{ background: 'transparent', border: 'none' }}>
      {currentUserRole === 'content-creator' && (
        <Menu.Item key="creator_management_system" className="creatorManagementSystem">
          <SettingsIcon className="mr-2" />
          {formatMessage(commonMessages.content.creatorManagementSystem)}
        </Menu.Item>
      )}
      <Menu.Item key="member_profile_admin">
        <Icon src={UserIcon} className="mr-2" />
        {formatMessage(commonMessages.content.personalSettings)}
      </Menu.Item>
      <Menu.Item key="member_program_issues_admin">
        <Icon src={BookIcon} className="mr-2" />
        {formatMessage(commonMessages.content.courseProblem)}
      </Menu.Item>
      <Menu.Item key="member_orders_admin">
        <Icon src={ClipboardListIcon} className="mr-2" />
        {formatMessage(commonMessages.content.orderHistory)}
      </Menu.Item>

      {enabledModules.contract && (
        <Menu.Item key="member_contracts_admin">
          <Icon src={ClipboardListIcon} className="mr-2" />
          {formatMessage(commonMessages.content.contracts)}
        </Menu.Item>
      )}

      {enabledModules.coin && (
        <Menu.Item key="member_coins_admin">
          <Icon src={CoinIcon} className="mr-2" />
          {formatMessage(commonMessages.content.coinsAdmin)}
        </Menu.Item>
      )}

      {enabledModules.social_connect && socialCards.length && (
        <Menu.Item key="member_social_cards">
          <Icon src={IdentityIcon} className="mr-2" />
          {formatMessage(commonMessages.content.socialCard)}
        </Menu.Item>
      )}

      <Menu.Item key="member_coupons_admin">
        <Icon src={TicketIcon} className="mr-2" />
        {formatMessage(commonMessages.content.coupon)}
      </Menu.Item>

      {enabledModules.voucher && (
        <Menu.Item key="member_voucher_admin">
          <Icon src={GiftIcon} className="mr-2" />
          {formatMessage(commonMessages.content.voucher)}
        </Menu.Item>
      )}

      {enabledModules.member_card && enrolledMembershipCardIds.length > 0 && (
        <Menu.Item key="member_cards_admin">
          <Icon src={MemberCardIcon} className="mr-2" />
          {formatMessage(commonMessages.content.memberCard)}
        </Menu.Item>
      )}

      <Menu.Item key="_blank" data-href={settings['customer_support_link']}>
        <Icon src={CommentsIcon} className="mr-2" />
        {formatMessage(commonMessages.content.contact)}
      </Menu.Item>
    </AdminMenu>
  )
}

const useManagementDomain = (appId: string) => {
  const { loading, error, data } = useQuery<types.GET_MANAGEMENT_DOMAIN, types.GET_MANAGEMENT_DOMAINVariables>(
    gql`
      query GET_MANAGEMENT_DOMAIN($appId: String) {
        app_admin(where: { app_id: { _eq: $appId } }, limit: 1, order_by: { position: asc }) {
          host
        }
      }
    `,
    { variables: { appId } },
  )
  const managementDomain: { domain: string[] } | null =
    loading || error || !data ? null : { domain: data.app_admin.map(data => data.host) }
  return { loading, error, managementDomain }
}

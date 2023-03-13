import { useQuery } from '@apollo/react-hooks'
import { Icon, SettingsIcon } from '@chakra-ui/icons'
import { Menu } from 'antd'
import { ClickParam, MenuProps } from 'antd/lib/menu'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { parsePayload } from 'lodestar-app-element/src/hooks/util'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../hooks/card'
import { useSocialCardCollection } from '../../hooks/member'
import { CompanyIcon } from '../../images'
import { ReactComponent as BookIcon } from '../../images/book.svg'
import { ReactComponent as MemberCertificateIcon } from '../../images/certificate.svg'
import { ReactComponent as ClipboardListIcon } from '../../images/clipboard-list.svg'
import { ReactComponent as CoinIcon } from '../../images/coin.svg'
import { ReactComponent as CommentsIcon } from '../../images/comments.svg'
import { ReactComponent as DeviceIcon } from '../../images/device.svg'
import { ReactComponent as GiftIcon } from '../../images/gift.svg'
import { ReactComponent as GroupBuyIcon } from '../../images/group-buy.svg'
import { ReactComponent as IdentityIcon } from '../../images/identity.svg'
import { ReactComponent as MemberCardIcon } from '../../images/membercard.svg'
import { ReactComponent as TicketIcon } from '../../images/ticket.svg'
import { ReactComponent as UserIcon } from '../../images/user.svg'
import { useAppRouter } from './AppRouter'

const StyledMenu = styled(Menu)`
  && {
    border-right: none;
  }

  & .ant-menu-item-selected.managementSystem {
    background: none !important;
  }
`
export type RenderMemberAdminMenuProps = {
  menuProps: MenuProps
  defaultMenuItems: { key: string; item: React.ReactElement | boolean | undefined }[]
}

export const AdminMenu: React.FC<MenuProps> = ({ children, ...menuProps }) => {
  const { id: appId } = useApp()
  const { routesMap } = useAppRouter()
  const { formatMessage } = useIntl()
  const history = useHistory()

  const { managementDomain } = useManagementDomain(appId)

  const handleClick = ({ key, item }: ClickParam) => {
    if (item.props['data-href']) {
      if (key.startsWith('_blank')) window.open(item.props['data-href'])
      else history.push(item.props['data-href'])
    } else if (key.startsWith('management_system')) {
      window.open(`//${managementDomain?.domain[0]}/admin`)
    } else {
      const route = routesMap[key]
      route ? history.push(route.path) : alert(formatMessage(commonMessages.alert.noPath))
    }
  }

  return (
    <StyledMenu {...menuProps} mode="inline" onClick={handleClick}>
      {children}
    </StyledMenu>
  )
}

export const MemberAdminMenu: React.VFC<
  MenuProps & { renderAdminMenu?: (props: RenderMemberAdminMenuProps) => React.ReactElement }
> = ({ renderAdminMenu, ...props }) => {
  const { formatMessage } = useIntl()
  const { currentMemberId, currentUserRole, permissions, authToken } = useAuth()
  const { enabledModules, settings } = useApp()
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')
  const { socialCards } = useSocialCardCollection()
  const payload = authToken ? parsePayload(authToken) : null

  const defaultMenuItems = [
    {
      key: 'management_system',
      item: !payload?.isBusiness &&
        (currentUserRole === 'app-owner' || currentUserRole === 'content-creator' || permissions.BACKSTAGE_ENTER) && (
          <Menu.Item key="management_system" className="managementSystem">
            <SettingsIcon className="mr-2" />
            {formatMessage(commonMessages.content.managementSystem)}
          </Menu.Item>
        ),
    },
    {
      key: 'member_profile_admin',
      item:
        enabledModules.business_member && payload?.isBusiness ? (
          <Menu.Item key="member_profile_admin">
            <Icon as={CompanyIcon} className="mr-2" />
            {formatMessage(commonMessages.content.companySettings)}
          </Menu.Item>
        ) : settings['custom.member_profile_admin.link'] ? (
          <Menu.Item key="_blank_member_profile_admin" data-href={`${settings['custom.member_profile_admin.link']}`}>
            <Icon as={UserIcon} className="mr-2" />
            {formatMessage(commonMessages.content.personalSettings)}
          </Menu.Item>
        ) : (
          <Menu.Item key="member_profile_admin">
            <Icon as={UserIcon} className="mr-2" />
            {formatMessage(commonMessages.content.personalSettings)}
          </Menu.Item>
        ),
    },
    {
      key: 'member_program_issues_admin',
      item: (
        <Menu.Item key="member_program_issues_admin">
          <Icon as={BookIcon} className="mr-2" />
          {formatMessage(commonMessages.content.courseProblem)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_practices_admin',
      item: enabledModules.practice && (
        <Menu.Item key="member_practices_admin">
          <Icon as={BookIcon} className="mr-2" />
          {formatMessage(commonMessages.content.practiceManagement)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_certificates_admin',
      item: enabledModules.certificate && (
        <Menu.Item key="member_certificates_admin">
          <Icon as={MemberCertificateIcon} className="mr-2" />
          {formatMessage(commonMessages.content.certificate)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_orders_admin',
      item: (
        <Menu.Item key="member_orders_admin">
          <Icon as={ClipboardListIcon} className="mr-2" />
          {formatMessage(commonMessages.content.orderHistory)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_contracts_admin',
      item: enabledModules.contract && (
        <Menu.Item key="member_contracts_admin">
          <Icon as={ClipboardListIcon} className="mr-2" />
          {formatMessage(commonMessages.content.contracts)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_coins_admin',
      item: enabledModules.coin && (
        <Menu.Item key="member_coins_admin">
          <Icon as={CoinIcon} className="mr-2" />
          {formatMessage(commonMessages.content.coinsAdmin)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_social_cards',
      item: enabledModules.social_connect && !!socialCards.length && (
        <Menu.Item key="member_social_cards">
          <Icon as={IdentityIcon} className="mr-2" />
          {formatMessage(commonMessages.content.socialCard)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_group_buying_admin',
      item: enabledModules.group_buying && (
        <Menu.Item key="member_group_buying_admin">
          <Icon as={GroupBuyIcon} className="mr-2" />
          {formatMessage(commonMessages.ui.groupBuying)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_coupons_admin',
      item: (
        <Menu.Item key="member_coupons_admin">
          <Icon as={TicketIcon} className="mr-2" />
          {formatMessage(commonMessages.content.coupon)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_voucher_admin',
      item: enabledModules.voucher && (
        <Menu.Item key="member_voucher_admin">
          <Icon as={GiftIcon} className="mr-2" />
          {formatMessage(commonMessages.content.voucher)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_cards_admin',
      item: enabledModules.member_card && enrolledMembershipCardIds.length > 0 && (
        <Menu.Item key="member_cards_admin">
          <Icon as={MemberCardIcon} className="mr-2" />
          {formatMessage(commonMessages.content.memberCard)}
        </Menu.Item>
      ),
    },
    {
      key: 'member_device_admin',
      item: enabledModules.device_management && (
        <Menu.Item key="member_device_admin">
          <Icon as={DeviceIcon} className="mr-2" />
          {formatMessage(commonMessages.content.deviceManagement)}
        </Menu.Item>
      ),
    },
    {
      key: 'customer_support_link',
      item: (
        <Menu.Item key="_blank" data-href={settings['customer_support_link']}>
          <Icon as={CommentsIcon} className="mr-2" />
          {formatMessage(commonMessages.content.contact)}
        </Menu.Item>
      ),
    },
  ]

  return (
    <>
      {renderAdminMenu?.({
        menuProps: props,
        defaultMenuItems,
      }) || (
        <AdminMenu {...props} style={{ background: 'transparent', border: 'none' }}>
          {defaultMenuItems
            .filter(v => {
              if (settings['nav.personal_setting.disable'] === '1') {
                return v.key !== 'member_profile_admin'
              }
              return v
            })
            .map(v => v.item)}
        </AdminMenu>
      )}
    </>
  )
}

export const GET_MANAGEMENT_DOMAIN = gql`
  query GET_MANAGEMENT_DOMAIN($appId: String) {
    app_host(where: { app_id: { _eq: $appId } }, limit: 1, order_by: { priority: asc }) {
      host
    }
  }
`

const useManagementDomain = (appId: string) => {
  const { loading, error, data } = useQuery<hasura.GET_MANAGEMENT_DOMAIN, hasura.GET_MANAGEMENT_DOMAINVariables>(
    GET_MANAGEMENT_DOMAIN,
    { variables: { appId } },
  )
  const managementDomain: { domain: string[] } | null =
    loading || error || !data ? null : { domain: data.app_host.map(data => data.host) }
  return { loading, error, managementDomain }
}

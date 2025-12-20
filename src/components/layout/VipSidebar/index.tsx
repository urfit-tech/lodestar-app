import { gql, useQuery } from '@apollo/client'
import { ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons'
import { Icon, IconButton } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { parsePayload } from 'lodestar-app-element/src/hooks/util'
import React, { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../../hasura'
import { commonMessages } from '../../../helpers/translation'
import { useEnrolledMembershipCardIds } from '../../../hooks/card'
import { useSocialCardCollection } from '../../../hooks/member'
import { CompanyIcon } from '../../../images'
import { ReactComponent as BookIcon } from '../../../images/book.svg'
import { ReactComponent as MemberCertificateIcon } from '../../../images/certificate.svg'
import { ReactComponent as ClipboardListIcon } from '../../../images/clipboard-list.svg'
import { ReactComponent as CoinIcon } from '../../../images/coin.svg'
import { ReactComponent as CommentsIcon } from '../../../images/comments.svg'
import { ReactComponent as DeviceIcon } from '../../../images/device.svg'
import { ReactComponent as GiftIcon } from '../../../images/gift.svg'
import { ReactComponent as GroupBuyIcon } from '../../../images/group-buy.svg'
import { ReactComponent as IdentityIcon } from '../../../images/identity.svg'
import { ReactComponent as MemberCardIcon } from '../../../images/membercard.svg'
import { ReactComponent as TicketIcon } from '../../../images/ticket.svg'
import { ReactComponent as UserIcon } from '../../../images/user.svg'
import { useAppRouter } from '../../common/AppRouter'

const StyledSidebar = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  left: 0;
  top: 64px;
  height: calc(100vh - 64px);
  width: ${props => (props.isExpanded ? '200px' : '64px')};
  background: #2f387b;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  padding: ${props => (props.isExpanded ? '1rem 0.5rem' : '1rem 0')};
  transition: width 0.3s ease;
  z-index: 999;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`

const MenuItem = styled.div<{ isActive?: boolean; isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  width: ${props => (props.isExpanded ? 'calc(100% - 1rem)' : '48px')};
  height: 48px;
  padding: ${props => (props.isExpanded ? '0 1rem' : '0')};
  margin: ${props => (props.isExpanded ? '0.25rem 0.5rem' : '0.5rem 0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => (props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  svg {
    font-size: 24px;
    flex-shrink: 0;
    margin-right: ${props => (props.isExpanded ? '12px' : '0')};
  }

  span {
    white-space: nowrap;
    display: ${props => (props.isExpanded ? 'block' : 'none')};
    transition: opacity 0.2s ease;
    font-size: 14px;
  }
`

const ExpandButtonWrapper = styled.div`
  margin-top: auto;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const StyledExpandButton = styled(IconButton)<{ isExpanded: boolean }>`
  && {
    background: transparent;
    color: #ffffff;
    width: 40px;
    height: 40px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    svg {
      transform: ${props => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
      transition: transform 0.3s ease;
    }
  }
`

interface MenuItemData {
  icon: React.ReactNode
  label: string
  href?: string
  key: string
  isExternal?: boolean
}

interface VipSidebarProps {
  onExpandChange?: (isExpanded: boolean) => void
}

const GET_MANAGEMENT_DOMAIN = gql`
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

const VipSidebar: React.FC<VipSidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { routesMap } = useAppRouter()
  const { currentMemberId, currentUserRole, permissions, authToken } = useAuth()
  const { enabledModules, settings } = useApp()
  const { enrolledMembershipCardIds } = useEnrolledMembershipCardIds(currentMemberId || '')
  const { socialCards } = useSocialCardCollection()
  const payload = authToken ? parsePayload(authToken) : null
  const { managementDomain } = useManagementDomain(appId)

  const handleExpandToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const menuItems: MenuItemData[] = useMemo(() => {
    const hideKeys = settings['settings.menu.hide_keys']?.split(',') || []
    const defaultMenuItems: MenuItemData[] = []

    // management_system
    if (
      (currentUserRole === 'app-owner' || currentUserRole === 'content-creator' || permissions.BACKSTAGE_ENTER) &&
      !hideKeys.includes('management_system')
    ) {
      defaultMenuItems.push({
        key: 'management_system',
        icon: <SettingsIcon />,
        label: formatMessage(commonMessages.content.managementSystem),
        href: `//${managementDomain?.domain[0]}/admin`,
        isExternal: true,
      })
    }

    // member_profile_admin
    if (!hideKeys.includes('member_profile_admin')) {
      if (settings['nav.personal_setting.disable'] !== '1') {
        if (enabledModules.business_member && payload?.isBusiness) {
          defaultMenuItems.push({
            key: 'member_profile_admin',
            icon: <Icon as={CompanyIcon} />,
            label: formatMessage(commonMessages.content.companySettings),
            href: routesMap['member_profile_admin']?.path,
          })
        } else if (settings['custom.member_profile_admin.link']) {
          defaultMenuItems.push({
            key: '_blank_member_profile_admin',
            icon: <Icon as={UserIcon} />,
            label: formatMessage(commonMessages.content.personalSettings),
            href: settings['custom.member_profile_admin.link'],
            isExternal: true,
          })
        } else {
          defaultMenuItems.push({
            key: 'member_profile_admin',
            icon: <Icon as={UserIcon} />,
            label: formatMessage(commonMessages.content.personalSettings),
            href: routesMap['member_profile_admin']?.path,
          })
        }
      }
    }

    // member_program_issues_admin
    if (enabledModules.program_issue && !hideKeys.includes('member_program_issues_admin')) {
      defaultMenuItems.push({
        key: 'member_program_issues_admin',
        icon: <Icon as={BookIcon} />,
        label: formatMessage(commonMessages.content.courseProblem),
        href: routesMap['member_program_issues_admin']?.path,
      })
    }

    // member_practices_admin
    if (enabledModules.practice && !hideKeys.includes('member_practices_admin')) {
      defaultMenuItems.push({
        key: 'member_practices_admin',
        icon: <Icon as={BookIcon} />,
        label: formatMessage(commonMessages.content.practiceManagement),
        href: routesMap['member_practices_admin']?.path,
      })
    }

    // member_certificates_admin
    if (enabledModules.certificate && !hideKeys.includes('member_certificates_admin')) {
      defaultMenuItems.push({
        key: 'member_certificates_admin',
        icon: <Icon as={MemberCertificateIcon} />,
        label: formatMessage(commonMessages.content.certificate),
        href: routesMap['member_certificates_admin']?.path,
      })
    }

    // member_orders_admin
    if (!hideKeys.includes('member_orders_admin')) {
      defaultMenuItems.push({
        key: 'member_orders_admin',
        icon: <Icon as={ClipboardListIcon} />,
        label: formatMessage(commonMessages.content.orderHistory),
        href: routesMap['member_orders_admin']?.path,
      })
    }

    // member_contracts_admin
    if (enabledModules.contract && !hideKeys.includes('member_contracts_admin')) {
      defaultMenuItems.push({
        key: 'member_contracts_admin',
        icon: <Icon as={ClipboardListIcon} />,
        label: formatMessage(commonMessages.content.contracts),
        href: routesMap['member_contracts_admin']?.path,
      })
    }

    // member_coins_admin
    if (enabledModules.coin && !hideKeys.includes('member_coins_admin')) {
      defaultMenuItems.push({
        key: 'member_coins_admin',
        icon: <Icon as={CoinIcon} />,
        label: formatMessage(commonMessages.content.coinsAdmin),
        href: routesMap['member_coins_admin']?.path,
      })
    }

    // member_social_cards
    if (enabledModules.social_connect && !!socialCards.length && !hideKeys.includes('member_social_cards')) {
      defaultMenuItems.push({
        key: 'member_social_cards',
        icon: <Icon as={IdentityIcon} />,
        label: formatMessage(commonMessages.content.socialCard),
        href: routesMap['member_social_cards']?.path,
      })
    }

    // member_group_buying_admin
    if (enabledModules.group_buying && !hideKeys.includes('member_group_buying_admin')) {
      defaultMenuItems.push({
        key: 'member_group_buying_admin',
        icon: <Icon as={GroupBuyIcon} />,
        label: formatMessage(commonMessages.ui.groupBuying),
        href: routesMap['member_group_buying_admin']?.path,
      })
    }

    // member_coupons_admin
    if (enabledModules.coupon && !hideKeys.includes('member_coupons_admin')) {
      defaultMenuItems.push({
        key: 'member_coupons_admin',
        icon: <Icon as={TicketIcon} />,
        label: formatMessage(commonMessages.content.coupon),
        href: routesMap['member_coupons_admin']?.path,
      })
    }

    // member_voucher_admin
    if (enabledModules.voucher && !hideKeys.includes('member_voucher_admin')) {
      defaultMenuItems.push({
        key: 'member_voucher_admin',
        icon: <Icon as={GiftIcon} />,
        label: formatMessage(commonMessages.content.voucher),
        href: routesMap['member_voucher_admin']?.path,
      })
    }

    // member_cards_admin
    if (
      enabledModules.member_card &&
      enrolledMembershipCardIds.length > 0 &&
      !hideKeys.includes('member_cards_admin')
    ) {
      defaultMenuItems.push({
        key: 'member_cards_admin',
        icon: <Icon as={MemberCardIcon} />,
        label: formatMessage(commonMessages.content.memberCard),
        href: routesMap['member_cards_admin']?.path,
      })
    }

    // member_device_admin
    if (enabledModules.device_management && !hideKeys.includes('member_device_admin')) {
      defaultMenuItems.push({
        key: 'member_device_admin',
        icon: <Icon as={DeviceIcon} />,
        label: formatMessage(commonMessages.content.deviceManagement),
        href: routesMap['member_device_admin']?.path,
      })
    }

    // customer_support_link
    if (!!settings['customer_support_link'] && !hideKeys.includes('customer_support_link')) {
      defaultMenuItems.push({
        key: 'customer_support_link',
        icon: <Icon as={CommentsIcon} />,
        label: formatMessage(commonMessages.content.contact),
        href: settings['customer_support_link'],
        isExternal: true,
      })
    }

    return defaultMenuItems
  }, [
    currentUserRole,
    permissions,
    settings,
    enabledModules,
    payload,
    enrolledMembershipCardIds,
    socialCards,
    managementDomain,
    routesMap,
    formatMessage,
  ])

  const handleMenuItemClick = (index: number, item: MenuItemData) => {
    setActiveIndex(index)
    if (item.href) {
      if (item.isExternal || item.key.startsWith('_blank')) {
        window.open(item.href, '_blank')
      } else if (item.key.startsWith('management_system')) {
        window.open(item.href, '_blank')
      } else if (item.href.startsWith('/')) {
        history.push(item.href)
      } else {
        window.open(item.href, '_blank')
      }
    }
  }

  return (
    <StyledSidebar isExpanded={isExpanded}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={item.key}
          isActive={activeIndex === index}
          isExpanded={isExpanded}
          onClick={() => handleMenuItemClick(index, item)}
        >
          {item.icon}
          <span>{item.label}</span>
        </MenuItem>
      ))}

      <ExpandButtonWrapper>
        <StyledExpandButton
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          icon={<ChevronRightIcon />}
          isExpanded={isExpanded}
          onClick={handleExpandToggle}
        />
      </ExpandButtonWrapper>
    </StyledSidebar>
  )
}

export default VipSidebar

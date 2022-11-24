import { SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { DeviceIcon } from '../../images'
import ForbiddenPage from '../ForbiddenPage'

const StyledDescription = styled.span`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
`

const DeviceManagementAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMemberId, isAuthenticated, isAuthenticating } = useAuth()
  const app = useApp()

  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated && !currentMemberId) {
      history.push('/')
    }
  }, [currentMemberId, isAuthenticated, isAuthenticating, history])

  if (app.loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!app.loading && !app.enabledModules.device_management) {
    return <ForbiddenPage />
  }

  return (
    <MemberAdminLayout content={{ icon: DeviceIcon, title: formatMessage(commonMessages.content.deviceManagement) }}>
      <div className="mb-5">
        <StyledDescription>帳號至多綁定 5 個裝置，如欲解除裝置請點選「退出」進行解除綁定與終止連線。</StyledDescription>
      </div>

      <AdminCard></AdminCard>
    </MemberAdminLayout>
  )
}

export default DeviceManagementAdminPage

import { Icon, SkeletonText } from '@chakra-ui/react'
import { Button } from 'antd'
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

const deviceCollection = [
  {
    type: 'desktop',
    os: 'Mac OS',
    lastLoginAt: '2022-10-25 18:23',
    browser: 'Google Chrome',
    ipAddress: '123.122.132.1',
  },
  {
    type: 'desktop',
    os: 'Win XX',
    lastLoginAt: '2022-10-25 18:23',
    browser: 'Google Chrome',
    ipAddress: '123.122.132.1',
  },
  {
    type: 'tablet',
    os: 'OS',
    lastLoginAt: '2022-10-25 18:23',
    browser: 'Google Chrome',
    ipAddress: '123.122.132.1',
  },
  {
    type: 'mobile',
    os: 'ios',
    lastLoginAt: '2022-10-25 18:23',
    browser: 'Google Chrome',
    ipAddress: '123.122.132.1',
  },
]

const StyledDescription = styled.span`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
`

const StyledItem = styled.div`
  padding: 0.75rem 0;
  border-bottom: 1px solid #efefef;
`

const StyledDeviceTitle = styled.span`
  font-size: 19px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #4a4a4a;
`

const StyledLoginInfo = styled.div`
  font-size: 16px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const DeviceManagementAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMemberId, isAuthenticated, isAuthenticating } = useAuth()
  const { settings, loading, enabledModules } = useApp()

  useEffect(() => {
    if (!isAuthenticating && !isAuthenticated && !currentMemberId) {
      history.push('/')
    }
  }, [currentMemberId, isAuthenticated, isAuthenticating, history])

  if (loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  // if (!loading && !enabledModules.device_management) {
  //   return <ForbiddenPage />
  // }

  return (
    <MemberAdminLayout content={{ icon: DeviceIcon, title: formatMessage(commonMessages.content.deviceManagement) }}>
      <div className="mb-5">
        <StyledDescription>
          {formatMessage(
            {
              id: 'common.deviceManagementAdmin.description',
              defaultMessage: '帳號至多綁定 {number} 個裝置，如欲解除裝置請點選「退出」進行解除綁定與終止連線。',
            },
            {
              number: settings['device_num'] || 1,
            },
          )}
        </StyledDescription>
      </div>

      <AdminCard style={{ padding: '0px 16px' }}>
        {deviceCollection.map(device => {
          return (
            <StyledItem className="d-flex align-items-center">
              <div className="mr-5">
                <Icon as={DeviceIcon} className="my-auto mr-3" />
                <StyledDeviceTitle>{device.os}</StyledDeviceTitle>
              </div>
              <div className="flex-lg-grow-1">
                <StyledLoginInfo>上次登入：{device.lastLoginAt}</StyledLoginInfo>
                <StyledLoginInfo>瀏覽器：{device.browser}</StyledLoginInfo>
                <StyledLoginInfo>IP 位址：{device.ipAddress}</StyledLoginInfo>
              </div>
              <div className="">
                <Button>退出</Button>
              </div>
            </StyledItem>
          )
        })}
      </AdminCard>
    </MemberAdminLayout>
  )
}

export default DeviceManagementAdminPage

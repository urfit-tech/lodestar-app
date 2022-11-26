import { Icon, SkeletonText } from '@chakra-ui/react'
import { Button, message, Modal } from 'antd'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { DeviceIcon, ComputerIcon, MobileIcon, TabletIcon } from '../../images'
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

const messages = defineMessages({
  description: {
    id: 'page.deviceManagementAdmin.description',
    defaultMessage: '帳號至多綁定 {number} 個裝置，如欲解除裝置請點選「退出」進行解除綁定與終止連線。',
  },
  lastLoginAt: { id: 'page.deviceManagementAdmin.lastLoginAt', defaultMessage: '上次登入 : {dateTime}' },
  browser: { id: 'page.deviceManagementAdmin.browser', defaultMessage: '瀏覽器 : {browser}' },
  ipAddress: { id: 'page.deviceManagementAdmin.ipAddress', defaultMessage: 'IP 位址 : {ipAddress}' },
  logout: { id: 'page.deviceManagementAdmin.logout', defaultMessage: '退出' },
  desktop: { id: 'page.deviceManagementAdmin.desktop', defaultMessage: '電腦 {os}' },
  tablet: { id: 'page.deviceManagementAdmin.tablet', defaultMessage: '平板 {os}' },
  mobile: { id: 'page.deviceManagementAdmin.mobile', defaultMessage: '手機 {os}' },
  unKnownDevice: { id: 'page.deviceManagementAdmin.unKnownDevice', defaultMessage: '未知的裝置 {os}' },
  logoutTitle: {id: 'page.deviceManagementAdmin.logoutTitle', defaultMessage: '退出裝置' },
  logoutDescription: { id: 'page.deviceManagementAdmin.logoutDescription', defaultMessage: '若進行退出裝置將會解除此裝置的綁定與終止連線。'},
  logoutCancel: { id: 'page.deviceManagementAdmin.logoutCancel', defaultMessage: '取消'},
  logoutConfirm: { id: 'page.deviceManagementAdmin.logoutConfirm', defaultMessage: '確認'}
})

const StyledDescription = styled.span`
  color: var(--gray-darker);
  font-size: 16px;
  letter-spacing: 0.2px;
`

const StyledItem = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 2px solid var(--gray-light);

  @media (min-width: ${BREAK_POINT}px) {
    min-height: 145px;
    flex-flow: row;
    justify-content: space-between;
  }
`

const StyledDeviceDetailsSection = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: 1rem;
  align-items: center;

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    margin-bottom: 0rem;
    > div:first-child{
      min-width: 13rem;
    }
  }
`

const StyledDeviceDisplayContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  margin-right: 0rem;
  margin-bottom: 1rem;
  > svg {
    margin-right: 0rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    margin-right: 1.5rem;
    margin-bottom: 0rem;

    > svg {
      margin-right: 1.5rem;
    }
  }
`

const StyledLogoutSection = styled.div`
  margin-left: 0rem;
  margin-bottom: 1rem;

  @media (min-width: ${BREAK_POINT}px) {
    margin-left: 3rem;
    margin-bottom: 0rem;
  }
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


const StyledModal = styled(Modal)`
  && .ant-modal-footer {
    padding: 0 1.5rem 1.5rem;
  }
  && .ant-modal-footer {
    border-top: 0;
    padding: 0 1.5rem 1.5rem;
  }
`

const StyledModalTitle = styled.div`
  ${CommonTitleMixin}
`

const DeviceDisplaySection: React.VFC<{ type: string; os: string }> = ({ type, os }) => {
  const { formatMessage } = useIntl()
  if (type === 'desktop') {
    return (
      <>
        <Icon as={ComputerIcon} w={73} h={73} />
        <StyledDeviceTitle>{formatMessage(messages.desktop, { os })}</StyledDeviceTitle>
      </>
    )
  }
  if (type === 'mobile') {
    return (
      <>
        <Icon as={MobileIcon} w={73} h={73} />
        <StyledDeviceTitle>{formatMessage(messages.mobile, { os })}</StyledDeviceTitle>
      </>
    )
  }
  if (type === 'tablet') {
    return (
      <>
        <Icon as={TabletIcon} w={73} h={73} />
        <StyledDeviceTitle>{formatMessage(messages.tablet, { os })}</StyledDeviceTitle>
      </>
    )
  }

  return (
    <>
      <Icon as={DeviceIcon} w={73} h={73} />
      <StyledDeviceTitle>{formatMessage(messages.unKnownDevice) + os}</StyledDeviceTitle>
    </>
  )
}

const DeviceManagementAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMemberId, isAuthenticated, isAuthenticating } = useAuth()
  const { settings, loading, enabledModules } = useApp()

  const [ modalVisible , setModalVisible ] = useState(false)
  const [logoutLoading, setLogoutLoading ] = useState(false)

  const handleLogout = ()=>{
    
  }

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

  if (!loading && !enabledModules.device_management) {
    return <ForbiddenPage />
  }

  return (
    <MemberAdminLayout content={{ icon: DeviceIcon, title: formatMessage(commonMessages.content.deviceManagement) }}>
      <div className="mb-5">
        <StyledDescription>
          {formatMessage(messages.description, {
            number: settings['device_num'] || 1,
          })}
        </StyledDescription>
      </div>

      <AdminCard style={{ padding: '0px 16px' }}>
        {deviceCollection.map(device => {
          return (
            <StyledItem>
              <StyledDeviceDetailsSection>
                <StyledDeviceDisplayContainer>
                  <DeviceDisplaySection type={device.type} os={device.os} />
                </StyledDeviceDisplayContainer>
                <div>
                  <StyledLoginInfo>
                    {formatMessage(messages.lastLoginAt, { dateTime: device.lastLoginAt })}
                  </StyledLoginInfo>
                  <StyledLoginInfo>{formatMessage(messages.browser, { browser: device.browser })}</StyledLoginInfo>
                  <StyledLoginInfo>
                    {formatMessage(messages.ipAddress, { ipAddress: device.ipAddress })}
                  </StyledLoginInfo>
                </div>
              </StyledDeviceDetailsSection>
              <StyledLogoutSection>
                <Button onClick={()=>setModalVisible(true)}>{formatMessage(messages.logout)}</Button>
              </StyledLogoutSection>
            </StyledItem>
          )
        })}
      </AdminCard>


      <StyledModal
            width={400}
            centered
            visible={modalVisible}
            okText={formatMessage(messages.logoutConfirm)}
            cancelText={formatMessage(messages.logoutCancel)}
            okButtonProps={{ loading: logoutLoading, type: 'danger' }}
            onOk={() => handleLogout()}
            onCancel={() => {
              setModalVisible(false)
              setLogoutLoading(false)
            }}
          >
            <StyledModalTitle className="mb-4">
              {formatMessage(messages.logoutTitle)}
            </StyledModalTitle>
            <div className="mb-4">
              {formatMessage(messages.logoutDescription)}
            </div>
          </StyledModal>
    </MemberAdminLayout>
  )
}

export default DeviceManagementAdminPage

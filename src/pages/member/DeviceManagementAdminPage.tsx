import { useMutation, useQuery } from '@apollo/react-hooks'
import { Icon, SkeletonText } from '@chakra-ui/react'
import { Button, Modal } from 'antd'
import { gql } from 'graphql-tag'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ComputerIcon, DeviceIcon, MobileIcon, TabletIcon } from '../../images'
import ForbiddenPage from '../ForbiddenPage'
import { getFingerPrintId } from 'lodestar-app-element/src/hooks/util'

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
  currentDevice: {id: 'page.deviceManagementAdmin.currentDevice', defaultMessage: '當前裝置'},
  removeDeviceTitle: { id: 'page.deviceManagementAdmin.removeDeviceTitle', defaultMessage: '退出裝置' },
  removeDeviceDescription: {
    id: 'page.deviceManagementAdmin.removeDeviceDescription',
    defaultMessage: '若進行退出裝置將會解除此裝置的綁定與終止連線。',
  },
  removeDeviceCancel: { id: 'page.deviceManagementAdmin.removeDeviceCancel', defaultMessage: '取消' },
  removeDeviceConfirm: { id: 'page.deviceManagementAdmin.removeDeviceConfirm', defaultMessage: '確認' },
  removeAlert: { id: 'page.deviceManagementAdmin.removeAlert', defaultMessage: '目前裝置已中止連線，請再重新登入' },
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
const StyledLabel = styled.span`
  padding: 0.2rem 0.5rem;
  color: white;
  font-size: 14px;
  border-radius: 11px;
  background: var(--gray-darker);
  white-space: nowrap;
`

const StyledDeviceDetailsSection = styled.div`
  display: flex;
  flex-flow: column;
  margin-bottom: 1rem;
  align-items: center;

  @media (min-width: ${BREAK_POINT}px) {
    flex-flow: row;
    margin-bottom: 0rem;
    > div:first-child {
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
      <StyledDeviceTitle>{formatMessage(messages.unKnownDevice, { os })}</StyledDeviceTitle>
    </>
  )
}

const DeviceManagementAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { settings, loading, enabledModules } = useApp()

  const { loadingMemberDevices, devices, refetchMemberDevice, deleteMemberDevice } = useMemberDevice()

  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const [removeDeviceLoading, setRemoveDeviceLoading] = useState(false)
  const [currentFingerPrintId, setCurrentFingerPrintId] = useState<string | null>(null)


  const handleRemoveDevice = (fingerPrintId: string) => {
    setRemoveDeviceLoading(true)

    return deleteMemberDevice?.(fingerPrintId)
      .then(() => {
        refetchMemberDevice?.()
      })
      .catch(error => {
        console.error(error)
      })
      .finally(() => {
        setSelectedDeviceId(null)
        setRemoveDeviceLoading(false)
      })
  }

  const currentDevice = devices.filter(device=>device.id === currentFingerPrintId)

  const devicesForRender = [...currentDevice, ...devices.filter(device=>device.id !== currentFingerPrintId)]

  useEffect(()=>{
    async function setFingerPrintId(){
      const fingerPrintId = await getFingerPrintId()
      setCurrentFingerPrintId(fingerPrintId)
    }
    setFingerPrintId()
  },[])
 
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
            number: settings['bind_device_num'] || 1,
          })}
        </StyledDescription>
      </div>

      <AdminCard style={{ padding: '0px 16px' }}>
        {loadingMemberDevices && <SkeletonText mt="1" noOfLines={5} spacing="5" />}
        {devicesForRender.map(device => {
          return (
            <StyledItem key={device.id}>
              <StyledDeviceDetailsSection>
                <StyledDeviceDisplayContainer>
                  <DeviceDisplaySection type={device.type} os={device.osName} />
                </StyledDeviceDisplayContainer>
                <div>
                  <StyledLoginInfo>
                    {formatMessage(messages.lastLoginAt, {
                      dateTime: moment(device.lastLoginAt).format('YYYY/MM/DD HH:mm:ss'),
                    })}
                  </StyledLoginInfo>
                  <StyledLoginInfo>{formatMessage(messages.browser, { browser: device.browser })}</StyledLoginInfo>
                  <StyledLoginInfo>
                    {formatMessage(messages.ipAddress, { ipAddress: device.ipAddress })}
                  </StyledLoginInfo>
                </div>
              </StyledDeviceDetailsSection>
              <StyledLogoutSection> 
                {device.id === currentFingerPrintId ? <StyledLabel>{formatMessage(messages.currentDevice)}</StyledLabel>:
                <Button
                  onClick={() => {
                    setSelectedDeviceId(device.id)
                  }}
                >
                  {formatMessage(messages.logout)}
                </Button>}
              </StyledLogoutSection>
            </StyledItem>
          )
        })}
        <StyledModal
          width={400}
          centered
          visible={Boolean(selectedDeviceId)}
          okText={formatMessage(messages.removeDeviceConfirm)}
          cancelText={formatMessage(messages.removeDeviceCancel)}
          okButtonProps={{ loading: removeDeviceLoading, type: 'danger' }}
          onOk={() => selectedDeviceId && handleRemoveDevice(selectedDeviceId)}
          onCancel={() => {
            setSelectedDeviceId(null)
            setRemoveDeviceLoading(false)
          }}
        >
          <StyledModalTitle className="mb-4">{formatMessage(messages.removeDeviceTitle)}</StyledModalTitle>
          <div className="mb-4">{formatMessage(messages.removeDeviceDescription)}</div>
        </StyledModal>
      </AdminCard>
    </MemberAdminLayout>
  )
}

const useMemberDevice = () => {
  const { currentMemberId } = useAuth()

  const { loading, error, data, refetch } = useQuery<hasura.GET_MEMBER_DEVICE, hasura.GET_MEMBER_DEVICEVariables>(
    gql`
      query GET_MEMBER_DEVICE($memberId: String!) {
        member_device(where: { member_id: { _eq: $memberId } }, order_by: { last_login_at: desc }) {
          id
          fingerprint_id
          type
          browser
          os_name
          last_login_at
          options
          ip_address
        }
      }
    `,
    { variables: { memberId: currentMemberId || '' } },
  )

  const DELETE_MEMBER_DEVICE = gql`
    mutation DELETE_MEMBER_DEVICE($memberId: String!, $fingerPrintId: String!) {
      delete_member_device(where: { member_id: { _eq: $memberId }, fingerprint_id: { _eq: $fingerPrintId } }) {
        affected_rows
      }
    }
  `

  const [deleteMemberDeviceHandler] = useMutation<hasura.DELETE_MEMBER_DEVICE, hasura.DELETE_MEMBER_DEVICEVariables>(
    DELETE_MEMBER_DEVICE,
  )

  const deleteMemberDevice = (fingerPrintId: string) => {
    return deleteMemberDeviceHandler({ variables: { memberId: currentMemberId || '', fingerPrintId } })
  }
  const devices =
    loading || error || !data
      ? []
      : data?.member_device.map(device => {
          return {
            id: device.fingerprint_id,
            type: device.type || 'unknown',
            browser: device.browser || 'unknown',
            osName: device.os_name || 'unknown',
            lastLoginAt: new Date(device.last_login_at),
            ipAddress: device.ip_address || '0.0.0.0',
          }
        })

  return {
    loadingMemberDevices: loading,
    errorMemberDevices: error,
    devices,
    refetchMemberDevice: refetch,
    deleteMemberDevice,
  }
}

export default DeviceManagementAdminPage

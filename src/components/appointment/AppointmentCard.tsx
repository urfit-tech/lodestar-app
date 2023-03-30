import { useApolloClient } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { Textarea } from '@chakra-ui/react'
import { Button, Dropdown, Form, Icon as AntdIcon, Menu, message, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import gql from 'graphql-tag'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { dateRangeFormatter } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useCancelAppointment, useUpdateAppointmentIssue } from '../../hooks/appointment'
import DefaultAvatar from '../../images/avatar.svg'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { AppointmentEnrollment } from '../../types/appointment'
import { CustomRatioImage } from '../common/Image'
import { BREAK_POINT } from '../common/Responsive'

const messages = defineMessages({
  appointmentIssue: { id: 'appointment.button.appointmentIssue', defaultMessage: '提問單' },
  appointmentIssueDescription: {
    id: 'appointment.text.appointmentIssueDescription',
    defaultMessage: '建議以 1.  2. 方式點列問題，並適時換行讓老師更容易閱讀，若無問題則填寫「無」',
  },
  appointmentDate: { id: 'appointment.text.appointmentDate', defaultMessage: '諮詢日期' },
  createAppointmentIssue: { id: 'appointment.label.createAppointmentIssue', defaultMessage: '我要提問' },
  appointmentCanceledNotation: {
    id: 'appointment.text.appointmentCanceledNotation',
    defaultMessage: '已於 {time} 取消預約',
  },
  cancelAppointment: { id: 'appointment.ui.cancelAppointment', defaultMessage: '取消預約' },
  confirmCancelAlert: { id: 'appointment.label.confirmCancelAlert', defaultMessage: '確定要取消預約嗎？' },
  confirmCancelNotation: {
    id: 'appointment.text.confirmCancelNotation',
    defaultMessage: '取消預約後將會寄送通知給諮詢老師，並重新開放此時段，若需退費請主動聯繫平台。',
  },
  canceledReason: { id: 'appointment.label.canceledReason', defaultMessage: '取消原因' },
})

const StyledCard = styled.div`
  background-color: white;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 24px;

  @media (min-width: ${BREAK_POINT}px) {
    display: flex;
    justify-content: space-between;
  }
`
const StyledInfo = styled.div<{ withMask?: boolean }>`
  margin-bottom: 32px;
  ${props => (props.withMask ? 'opacity: 0.2;' : '')}

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 0;
  }
`
const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  margin-bottom: 0.75rem;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledMetaBlock = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
`
const StyledStatusBar = styled.div`
  justify-content: flex-end;

  @media (min-width: ${BREAK_POINT}px) {
    justify-content: space-between;
  }
`
const StyledBadge = styled.span`
  color: var(--gray);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
`
const StyledCanceledText = styled.span`
  color: var(--gray-dark);
  font-size: 14px;
`
const StyledModal = styled(Modal)`
  && .ant-modal-footer {
    border-top: 0;
    padding: 0 1.5rem 1.5rem;
  }
`
const StyledModalTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledModalSubTitle = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledModalMetaBlock = styled.div`
  padding: 0.75rem;
  background-color: var(--gray-lighter);
  border-radius: 4px;
`

type AppointmentCardProps = FormComponentProps &
  AppointmentEnrollment & {
    onRefetch?: () => void
  }
const AppointmentCard: React.VFC<AppointmentCardProps> = ({
  title,
  startedAt,
  endedAt,
  canceledAt,
  creator,
  member,
  appointmentUrl,
  appointmentIssue,
  orderProduct,
  onRefetch,
  form,
}) => {
  const { id: appId, enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const { authToken, currentMemberId } = useAuth()
  const apolloClient = useApolloClient()
  const updateAppointmentIssue = useUpdateAppointmentIssue(orderProduct.id, orderProduct.options)
  const cancelAppointment = useCancelAppointment(orderProduct.id, orderProduct.options)

  const [issueModalVisible, setIssueModalVisible] = useState(false)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [canceledReason, setCanceledReason] = useState('')
  const [loading, setLoading] = useState(false)

  const isFinished = Date.now() > endedAt.getTime()
  const isCanceled = !!canceledAt

  const handleSubmit = () => {
    form.validateFields((errors, values) => {
      if (errors) {
        return
      }

      setLoading(true)
      updateAppointmentIssue(values.appointmentIssue.toRAW())
        .then(() => {
          onRefetch && onRefetch()
          setIssueModalVisible(false)
          message.success(commonMessages.message.success)
        })
        .finally(() => setLoading(false))
    })
  }

  const handleCancel = () => {
    setLoading(true)
    cancelAppointment(canceledReason)
      .then(() => {
        onRefetch && onRefetch()
        setCancelModalVisible(false)
      })
      .finally(() => setLoading(false))
  }

  return (
    <StyledCard>
      <StyledInfo className="d-flex align-items-start" withMask={isCanceled}>
        <div className="flex-shrink-0 mr-4">
          <CustomRatioImage width="3rem" ratio={1} src={creator.avatarUrl || DefaultAvatar} shape="circle" />
        </div>
        <div className="flex-grow-1">
          <StyledTitle>{title}</StyledTitle>
          <StyledMetaBlock className="d-flex justify-content-start">
            <div className="mr-3">
              <Icon as={CalendarOIcon} className="mr-1" />
              <span>{dateRangeFormatter({ startedAt, endedAt, dateFormat: 'MM/DD(dd)' })}</span>
            </div>
            <div className="d-none d-lg-block">
              <Icon as={UserOIcon} className="mr-1" />
              <span>{creator.name}</span>
            </div>
          </StyledMetaBlock>
        </div>
      </StyledInfo>

      <StyledStatusBar className="d-flex align-items-center">
        {isCanceled ? (
          <StyledCanceledText>
            <Button type="link" size="small" className="mr-3" onClick={() => setIssueModalVisible(true)}>
              {formatMessage(messages.appointmentIssue)}
            </Button>
            {formatMessage(messages.appointmentCanceledNotation, {
              time: moment(canceledAt).format('MM/DD(dd) HH:mm'),
            })}
          </StyledCanceledText>
        ) : isFinished ? (
          <>
            <Button type="link" size="small" className="mr-3" onClick={() => setIssueModalVisible(true)}>
              {formatMessage(messages.appointmentIssue)}
            </Button>
            <StyledBadge>{formatMessage(commonMessages.status.finished)}</StyledBadge>
          </>
        ) : (
          <>
            <Button type="link" size="small" className="mr-3" onClick={() => setIssueModalVisible(true)}>
              {formatMessage(messages.appointmentIssue)}
            </Button>
            <Button
              type="link"
              size="small"
              className="mr-3"
              onClick={() =>
                window.open(
                  'https://calendar.google.com/calendar/event?action=TEMPLATE&text={{TITLE}}&dates={{STARTED_AT}}/{{ENDED_AT}}&details={{DETAILS}}'
                    .replace('{{TITLE}}', title)
                    .replace('{{STARTED_AT}}', moment(startedAt).format('YYYYMMDDTHHmmss'))
                    .replace('{{ENDED_AT}}', moment(endedAt).format('YYYYMMDDTHHmmss'))
                    .replace('{{DETAILS}}', appointmentUrl),
                )
              }
            >
              {formatMessage(commonMessages.button.toCalendar)}
            </Button>
            <Button
              type="primary"
              onClick={async () => {
                if (enabledModules.meet_service) {
                  const { data } = await apolloClient.query<
                    hasura.GET_APPOINTMENT_PERIOD_MEET_ID,
                    hasura.GET_APPOINTMENT_PERIOD_MEET_IDVariables
                  >({
                    query: gql`
                      query GET_APPOINTMENT_PERIOD_MEET_ID($orderProductId: uuid!) {
                        order_product(where: { id: { _eq: $orderProductId } }) {
                          id
                          options
                        }
                      }
                    `,
                    variables: { orderProductId: orderProduct.id },
                  })
                  const meetId = data.order_product?.[0]?.options?.meetId

                  try {
                    await axios
                      .post(
                        `${process.env.REACT_APP_KOLABLE_SERVER_ENDPOINT}/kolable/meets/${meetId}`,
                        {
                          role: 'guest',
                          name: `${appId}-${currentMemberId}`,
                        },
                        {
                          headers: {
                            Authorization: `Bearer ${authToken}`,
                            'x-api-key': 'kolable',
                          },
                        },
                      )
                      .then(({ data: { code, message, data } }) => window.open(data.options.startUrl))
                  } catch (error) {
                    console.log(`get meets error: ${error}`)
                    window.open(
                      `https://meet.jit.si/${orderProduct.id}#config.startWithVideoMuted=true&userInfo.displayName="${creator.name}"`,
                    )
                  }
                } else {
                  window.open(
                    `https://meet.jit.si/${orderProduct.id}#config.startWithVideoMuted=true&userInfo.displayName="${creator.name}"`,
                  )
                }
              }}
            >
              {formatMessage(commonMessages.button.attend)}
            </Button>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={() => setCancelModalVisible(true)}>
                    {formatMessage(messages.cancelAppointment)}
                  </Menu.Item>
                </Menu>
              }
              trigger={['click']}
            >
              <AntdIcon type="more" className="ml-3" />
            </Dropdown>
          </>
        )}
      </StyledStatusBar>

      {/* issue modal */}
      <StyledModal
        width={660}
        visible={issueModalVisible}
        footer={isFinished ? null : undefined}
        okText={formatMessage(commonMessages.button.save)}
        cancelText={formatMessage(commonMessages.ui.cancel)}
        okButtonProps={{ loading }}
        onOk={handleSubmit}
        onCancel={() => setIssueModalVisible(false)}
      >
        <StyledModalTitle className="mb-3">{formatMessage(messages.appointmentIssue)}</StyledModalTitle>
        <StyledModalMetaBlock className="mb-3">
          <span className="mr-2">{formatMessage(messages.appointmentDate)}</span>
          <span>{dateRangeFormatter({ startedAt, endedAt, dateFormat: 'MM/DD(dd)' })}</span>
        </StyledModalMetaBlock>
        <div className="mb-3">
          <strong className="mb-2">{formatMessage(messages.createAppointmentIssue)}</strong>
          <div>{formatMessage(messages.appointmentIssueDescription)}</div>
        </div>

        <Form colon={false} className={isFinished ? 'd-none' : ''}>
          <Form.Item>
            {form.getFieldDecorator('appointmentIssue', {
              initialValue: BraftEditor.createEditorState(appointmentIssue),
            })(
              <StyledBraftEditor
                language="zh-hant"
                contentClassName="short-bf-content"
                controls={[
                  'headings',
                  'bold',
                  'italic',
                  'underline',
                  'strike-through',
                  'remove-styles',
                  'separator',
                  'text-align',
                  'separator',
                  'list-ul',
                  'list-ol',
                  'blockquote',
                  'code',
                  'separator',
                  'link',
                  'hr',
                  'media',
                ]}
              />,
            )}
          </Form.Item>
        </Form>

        {isFinished && <BraftContent>{appointmentIssue}</BraftContent>}
      </StyledModal>

      {/* cancel modal */}
      <StyledModal
        width={384}
        centered
        visible={cancelModalVisible}
        okText={formatMessage(messages.cancelAppointment)}
        cancelText={formatMessage(commonMessages.ui.back)}
        okButtonProps={{ loading, type: 'danger', disabled: !canceledReason }}
        onOk={() => handleCancel()}
        onCancel={() => setCancelModalVisible(false)}
      >
        <StyledModalTitle className="mb-4">{formatMessage(messages.confirmCancelAlert)}</StyledModalTitle>
        <div className="mb-4">{formatMessage(messages.confirmCancelNotation)}</div>
        <StyledModalSubTitle>{formatMessage(messages.canceledReason)}</StyledModalSubTitle>
        <Textarea onChange={e => setCanceledReason(e.target.value)} />
      </StyledModal>
    </StyledCard>
  )
}

export default Form.create<AppointmentCardProps>()(AppointmentCard)

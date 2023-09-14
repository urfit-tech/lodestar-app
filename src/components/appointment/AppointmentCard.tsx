import { gql, useApolloClient, useMutation, useQuery } from '@apollo/client'
import { Icon } from '@chakra-ui/icons'
import { Button, ButtonGroup, SkeletonCircle, SkeletonText, Spinner, Textarea } from '@chakra-ui/react'
import { Divider, Dropdown, Form, Icon as AntdIcon, Menu, message, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import axios from 'axios'
import BraftEditor from 'braft-editor'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { dateRangeFormatter } from '../../helpers'
import { useAppointmentPlan, useCancelAppointment, useUpdateAppointmentIssue } from '../../hooks/appointment'
import DefaultAvatar from '../../images/avatar.svg'
import { ReactComponent as CalendarOIcon } from '../../images/calendar-alt-o.svg'
import { ReactComponent as UserOIcon } from '../../images/user-o.svg'
import { AppointmentPlan } from '../../types/appointment'
import { CustomRatioImage } from '../common/Image'
import { BREAK_POINT } from '../common/Responsive'
import AppointmentItem from './AppointmentItem'
import appointmentMessages from './translation'

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

const StyledLabel = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: normal;
  letter-spacing: 0.4px;
`

const StyledScheduleTitle = styled.h3`
  margin-bottom: 1.25rem;
  display: block;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledMeta = styled.div`
  color: var(--gray-dark);
  font-size: 12px;
`

const CustomMenu = styled(Menu)`
  && .ant-dropdown-menu-item:hover,
  .ant-dropdown-menu-submenu-title:hover {
    color: #ffffff !important;
    background-color: 'primary' !important;
  }
`

type AppointmentCardProps = FormComponentProps & {
  orderProductId: string
  appointmentPlanId: string
  memberId: string
  onRefetch?: () => void
  loadingCreator?: boolean
}

type AppointmentCardCreatorBlockProps = {
  creator: {
    avatarUrl: string | null
    name: string | null
  }
  appointmentPlan: AppointmentPlan | null
  loadingAppointmentPlan: boolean
}

const AppointmentCardCreatorBlock: React.FC<AppointmentCardCreatorBlockProps> = ({
  creator,
  appointmentPlan,
  loadingAppointmentPlan,
}) => {
  const { formatMessage } = useIntl()

  return (
    <>
      <div className="d-flex align-self-start mb-4">
        <div className="flex-shrink-0">
          <CustomRatioImage
            width="5rem"
            ratio={1}
            src={creator.avatarUrl || DefaultAvatar}
            shape="circle"
            className="mr-3"
          />
        </div>
        <div className="flex-grow-1">
          <StyledTitle className="mb-1">{creator.name}</StyledTitle>
          <StyledMeta>
            {formatMessage(appointmentMessages.AppointmentCard.periodDurationAtMost, {
              duration: appointmentPlan?.duration,
            })}
          </StyledMeta>
        </div>
      </div>
      {!loadingAppointmentPlan && (
        <StyledModalTitle className="mb-4">
          {formatMessage(appointmentMessages.AppointmentCard.rescheduleAppointmentPlanTitle, {
            title: appointmentPlan?.title,
          })}
        </StyledModalTitle>
      )}
      <Divider />
    </>
  )
}

const AppointmentCard: React.VFC<AppointmentCardProps> = ({
  orderProductId,
  appointmentPlanId,
  memberId,
  onRefetch,
  form,
}) => {
  const { id: appId, enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const { authToken, currentMemberId } = useAuth()
  const apolloClient = useApolloClient()
  const [issueModalVisible, setIssueModalVisible] = useState(false)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false)
  const [canceledReason, setCanceledReason] = useState('')
  const [rescheduleAppointment, setRescheduleAppointment] = useState<{
    rescheduleAppointment: boolean
    periodStartedAt: Date | null
    periodEndedAt: Date | null
    appointmentPlanId: string
  }>()
  const [loading, setLoading] = useState(false)
  const { loading: loadingOrderProduct, orderProduct, refetchOrderProduct } = useOrderProduct(orderProductId)
  const { loading: loadingAppointmentPlanPreview, appointmentPlanPreview } =
    useAppointmentPlanPreview(appointmentPlanId)
  const { loadingAppointmentPlan, appointmentPlan, refetchAppointmentPlan } = useAppointmentPlan(
    appointmentPlanId,
    memberId || '',
  )
  const { loading: loadingCreator, creator } = useCreator(appointmentPlanPreview.creatorId)
  const updateAppointmentIssue = useUpdateAppointmentIssue(orderProductId, orderProduct.options)
  const cancelAppointment = useCancelAppointment(orderProductId, orderProduct.options)
  const updateAppointmentPeriod = useUpdateAppointmentPeriod(orderProductId, orderProduct.options)
  const [confirm, setConfirm] = useState(false)

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
          message.success(formatMessage(appointmentMessages['*'].saveSuccessfully))
        })
        .finally(() => setLoading(false))
    })
  }

  const handleCancel = () => {
    setLoading(true)
    cancelAppointment(canceledReason)
      .then(() => {
        onRefetch && onRefetch()
        refetchOrderProduct()
        refetchAppointmentPlan()
        setCancelModalVisible(false)
      })
      .finally(() => setLoading(false))
  }

  const handleReschedule = async () => {
    setLoading(true)

    try {
      if (rescheduleAppointment) {
        await updateAppointmentPeriod(
          rescheduleAppointment.periodStartedAt,
          rescheduleAppointment.periodEndedAt,
          orderProduct.startedAt,
          currentMemberId || '',
        )
        onRefetch && onRefetch()
        await refetchAppointmentPlan()
        setRescheduleModalVisible(false)
        handleRescheduleCancel()
        await refetchOrderProduct()
        setConfirm(true)
        setLoading(false)
        await axios.post(
          `${process.env.REACT_APP_API_BASE_ROOT}/product/${orderProductId}/reschedule`,
          {},
          {
            headers: { authorization: `Bearer ${authToken}` },
          },
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRescheduleCancel = () => {
    setRescheduleAppointment({
      rescheduleAppointment: false,
      periodStartedAt: null,
      periodEndedAt: null,
      appointmentPlanId: '',
    })
  }

  if (loadingOrderProduct) {
    return (
      <StyledCard>
        <SkeletonText mt="1" noOfLines={3} spacing="4" />
      </StyledCard>
    )
  }

  const isFinished = orderProduct.endedAt ? Date.now() > orderProduct.endedAt.getTime() : true
  const isCanceled = !!orderProduct.canceledAt

  return (
    <StyledCard>
      <StyledInfo className="d-flex align-items-start" withMask={isCanceled}>
        <div className="flex-shrink-0 mr-4">
          {loadingCreator ? (
            <SkeletonCircle size="3rem" />
          ) : (
            <CustomRatioImage width="3rem" ratio={1} src={creator.avatarUrl || DefaultAvatar} shape="circle" />
          )}
        </div>
        <div className="flex-grow-1">
          {loadingAppointmentPlanPreview ? (
            <SkeletonText noOfLines={2} spacing="2" w="50%" mb="0.75rem" />
          ) : (
            <StyledTitle>{appointmentPlanPreview.title} </StyledTitle>
          )}
          <StyledMetaBlock className="d-flex justify-content-start">
            <div className="mr-3">
              <Icon as={CalendarOIcon} className="mr-1" />
              {orderProduct.startedAt && orderProduct.endedAt ? (
                <span>
                  {dateRangeFormatter({
                    startedAt: orderProduct.startedAt,
                    endedAt: orderProduct.endedAt,
                    dateFormat: 'MM/DD(dd)',
                  })}
                </span>
              ) : null}
            </div>
            <div className="d-none d-lg-block">
              <Icon as={UserOIcon} className="mr-1" />
              <span>{loadingCreator ? <Spinner boxSize="12px" /> : creator.name}</span>
            </div>
          </StyledMetaBlock>
        </div>
      </StyledInfo>

      <StyledStatusBar className="d-flex align-items-center">
        <Button
          variant="link"
          color="black"
          fontSize="14px"
          marginRight="16px"
          onClick={() => setIssueModalVisible(true)}
        >
          {formatMessage(appointmentMessages.AppointmentCard.appointmentIssue)}
        </Button>
        {isCanceled ? (
          <StyledCanceledText>
            {formatMessage(appointmentMessages.AppointmentCard.appointmentCanceledNotation, {
              time: moment(orderProduct.canceledAt).format('MM/DD(dd) HH:mm'),
            })}
          </StyledCanceledText>
        ) : isFinished ? (
          <StyledBadge>{formatMessage(appointmentMessages['*'].finished)}</StyledBadge>
        ) : (
          <>
            <Button
              variant="link"
              fontSize="14px"
              marginRight="16px"
              color="black"
              onClick={() =>
                window.open(
                  'https://calendar.google.com/calendar/event?action=TEMPLATE&text={{TITLE}}&dates={{STARTED_AT}}/{{ENDED_AT}}&details={{DETAILS}}'
                    .replace('{{TITLE}}', appointmentPlanPreview.title)
                    .replace('{{STARTED_AT}}', moment(orderProduct.startedAt).format('YYYYMMDDTHHmmss'))
                    .replace('{{ENDED_AT}}', moment(orderProduct.endedAt).format('YYYYMMDDTHHmmss'))
                    .replace('{{DETAILS}}', orderProduct.appointmentUrl),
                )
              }
            >
              {formatMessage(appointmentMessages.AppointmentCard.toCalendar)}
            </Button>

            {loadingAppointmentPlanPreview ? (
              <SkeletonText noOfLines={1} spacing="4" w="90px" />
            ) : !orderProduct.options?.joinUrl && appointmentPlanPreview.meetGenerationMethod === 'manual' ? (
              <StyledLabel>尚未設定連結</StyledLabel>
            ) : (
              <Button
                colorScheme="primary"
                onClick={async () => {
                  const joinUrl =
                    orderProduct.options?.joinUrl ||
                    `https://meet.jit.si/${orderProductId}#config.startWithVideoMuted=true&userInfo.displayName="${creator.name}", '_blank', 'noopener=yes,noreferrer=yes'`
                  if (enabledModules.meet_service && !orderProduct.options?.joinUrl) {
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
                      variables: { orderProductId: orderProductId },
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
                        .then(({ data: { code, message, data } }) =>
                          window.open(data.target, '_blank', 'noopener=yes,noreferrer=yes'),
                        )
                    } catch (error) {
                      console.log(`get meets error: ${error}`)
                      window.open(joinUrl)
                    }
                  } else {
                    window.open(joinUrl)
                  }
                }}
              >
                {formatMessage(appointmentMessages.AppointmentCard.attend)}
              </Button>
            )}
            <Dropdown
              overlay={
                <CustomMenu>
                  {appointmentPlan?.rescheduleAmount !== -1 && (
                    <Menu.Item onClick={() => setRescheduleModalVisible(true)}>
                      {formatMessage(appointmentMessages.AppointmentCard.rescheduleAppointment)}
                    </Menu.Item>
                  )}
                  <Menu.Item onClick={() => setCancelModalVisible(true)}>
                    {formatMessage(appointmentMessages.AppointmentCard.cancelAppointment)}
                  </Menu.Item>
                </CustomMenu>
              }
              trigger={['click']}
            >
              <AntdIcon type="more" className="ml-3" />
            </Dropdown>
          </>
        )}
      </StyledStatusBar>

      {/* issue modal */}
      <Modal width={660} visible={issueModalVisible} footer={null} onCancel={() => setIssueModalVisible(false)}>
        <StyledModalTitle className="mb-3">
          {formatMessage(appointmentMessages.AppointmentCard.appointmentIssue)}
        </StyledModalTitle>
        <StyledModalMetaBlock className="mb-3">
          <span className="mr-2">{formatMessage(appointmentMessages.AppointmentCard.appointmentDate)}</span>
          {orderProduct.startedAt && orderProduct.endedAt ? (
            <span>
              {dateRangeFormatter({
                startedAt: orderProduct.startedAt,
                endedAt: orderProduct.endedAt,
                dateFormat: 'MM/DD(dd)',
              })}
            </span>
          ) : null}
        </StyledModalMetaBlock>
        <div className="mb-3">
          <strong className="mb-2">{formatMessage(appointmentMessages.AppointmentCard.createAppointmentIssue)}</strong>
          <div>{formatMessage(appointmentMessages.AppointmentCard.appointmentIssueDescription)}</div>
        </div>

        <Form colon={false} className={isFinished || isCanceled ? 'd-none' : ''}>
          <Form.Item>
            {form.getFieldDecorator('appointmentIssue', {
              initialValue: BraftEditor.createEditorState(orderProduct.appointmentIssue),
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

        {isFinished && <BraftContent>{orderProduct.appointmentIssue}</BraftContent>}
        {isCanceled && <BraftContent>{orderProduct.appointmentIssue}</BraftContent>}
        {!isFinished && !isCanceled && (
          <ButtonGroup display="flex" marginTop="24px" justifyContent="flex-end">
            <Button variant="outline" marginRight="8px" onClick={() => setIssueModalVisible(false)}>
              {formatMessage(appointmentMessages['*'].cancel)}
            </Button>
            <Button isLoading={loading} colorScheme="primary" onClick={handleSubmit}>
              {formatMessage(appointmentMessages['*'].save)}
            </Button>
          </ButtonGroup>
        )}
      </Modal>

      {/* cancel modal */}
      <Modal
        width={384}
        centered
        visible={cancelModalVisible}
        onCancel={() => setCancelModalVisible(false)}
        footer={null}
      >
        <StyledModalTitle className="mb-4">
          {formatMessage(appointmentMessages.AppointmentCard.confirmCancelAlert)}
        </StyledModalTitle>
        <div className="mb-4">{formatMessage(appointmentMessages.AppointmentCard.confirmCancelNotation)}</div>
        <StyledModalSubTitle>{formatMessage(appointmentMessages.AppointmentCard.canceledReason)}</StyledModalSubTitle>
        <Textarea onChange={e => setCanceledReason(e.target.value)} />
        <ButtonGroup marginTop="24px" display="flex" justifyContent="flex-end">
          <Button variant="outline" marginRight="8px" onClick={() => setCancelModalVisible(false)}>
            {formatMessage(appointmentMessages['*'].back)}
          </Button>
          <Button isLoading={loading} disabled={!canceledReason} onClick={handleCancel} colorScheme="danger">
            {formatMessage(appointmentMessages.AppointmentCard.cancelAppointment)}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* reschedule modal */}
      <Modal
        width={384}
        centered
        visible={rescheduleModalVisible}
        footer={null}
        onCancel={() => setRescheduleModalVisible(false)}
      >
        <AppointmentCardCreatorBlock
          creator={creator}
          loadingAppointmentPlan={loadingAppointmentPlan}
          appointmentPlan={appointmentPlan}
        />
        {loadingAppointmentPlan ? (
          <SkeletonText noOfLines={1} spacing="4" w="90px" />
        ) : appointmentPlan?.periods.length === 0 ? (
          <StyledInfo>{formatMessage(appointmentMessages.AppointmentCard.notRescheduleAppointmentPeriod)}</StyledInfo>
        ) : (
          <>
            {appointmentPlan?.periods.map(period => (
              <div key={period.id}>
                <StyledScheduleTitle>{moment(period.startedAt).format('YYYY-MM-DD(dd)')}</StyledScheduleTitle>
                <AppointmentItem
                  id={period.id}
                  startedAt={period.startedAt}
                  isEnrolled={period.currentMemberBooked}
                  isExcluded={period.isBookedReachLimit || period.available}
                  onClick={() =>
                    !period.currentMemberBooked && !period.isBookedReachLimit && !period.available
                      ? setRescheduleAppointment({
                          rescheduleAppointment: true,
                          periodStartedAt: period.startedAt,
                          periodEndedAt: period.endedAt,
                          appointmentPlanId: appointmentPlanId,
                        })
                      : null
                  }
                />
              </div>
            ))}
          </>
        )}
        <ButtonGroup w="100%" display="flex" marginTop="24px" justifyContent="flex-end">
          <Button variant="outline" onClick={() => setRescheduleModalVisible(false)}>
            {formatMessage(appointmentMessages['*'].back)}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* rescheduleConfirm modal  */}
      <Modal
        width={384}
        centered
        visible={rescheduleAppointment?.rescheduleAppointment}
        footer={null}
        onCancel={handleRescheduleCancel}
      >
        <AppointmentCardCreatorBlock
          creator={creator}
          loadingAppointmentPlan={loadingAppointmentPlan}
          appointmentPlan={appointmentPlan}
        />
        <StyledInfo>{formatMessage(appointmentMessages.AppointmentCard.rescheduleOriginScheduled)}</StyledInfo>
        <StyledScheduleTitle>
          {orderProduct.startedAt && orderProduct.endedAt ? (
            <span>
              {dateRangeFormatter({
                startedAt: orderProduct.startedAt,
                endedAt: orderProduct.endedAt,
                dateFormat: 'MM/DD(dd)',
              })}
            </span>
          ) : null}
        </StyledScheduleTitle>
        <StyledInfo>{formatMessage(appointmentMessages.AppointmentCard.rescheduled)}</StyledInfo>
        <StyledScheduleTitle>
          {rescheduleAppointment?.periodStartedAt && rescheduleAppointment?.periodEndedAt ? (
            <span>
              {dateRangeFormatter({
                startedAt: rescheduleAppointment.periodStartedAt,
                endedAt: rescheduleAppointment.periodEndedAt,
                dateFormat: 'MM/DD(dd)',
              })}
            </span>
          ) : null}
        </StyledScheduleTitle>
        <Button variant="outline" marginRight="8px" width="100%" onClick={handleRescheduleCancel}>
          {formatMessage(appointmentMessages.AppointmentCard.rescheduleCancel)}
        </Button>
        <Button isLoading={loading} onClick={handleReschedule} width="100%" marginTop="16px" colorScheme="primary">
          {formatMessage(appointmentMessages.AppointmentCard.rescheduleConfirm)}
        </Button>
      </Modal>

      <Modal
        width={384}
        centered
        visible={confirm}
        bodyStyle={{ textAlign: 'center' }}
        footer={null}
        onCancel={() => setConfirm(false)}
      >
        <AntdIcon
          className="mb-5"
          type="check-circle"
          theme="twoTone"
          twoToneColor="#4ed1b3"
          style={{ fontSize: '4rem' }}
        />
        <StyledModalTitle className="mb-4">
          {formatMessage(appointmentMessages.AppointmentCard.rescheduleSuccess)}
        </StyledModalTitle>
        <StyledInfo>
          {formatMessage(appointmentMessages.AppointmentCard.rescheduleSuccessAppointmentPlanTitle, {
            title: appointmentPlan?.title,
          })}
        </StyledInfo>
        <StyledScheduleTitle>
          {orderProduct.startedAt && orderProduct.endedAt ? (
            <span>
              {dateRangeFormatter({
                startedAt: orderProduct.startedAt,
                endedAt: orderProduct.endedAt,
                dateFormat: 'MM/DD(dd)',
              })}
            </span>
          ) : null}
        </StyledScheduleTitle>
        <Button
          isLoading={loading}
          marginRight="8px"
          colorScheme="primary"
          width="100%"
          onClick={() => setConfirm(false)}
        >
          {formatMessage(appointmentMessages.AppointmentCard.confirm)}
        </Button>
      </Modal>
    </StyledCard>
  )
}

export default Form.create<AppointmentCardProps>()(AppointmentCard)

export const useAppointmentPlanPreview = (appointmentPlanId: string) => {
  const { loading, data } = useQuery<hasura.GetAppointmentPlanPreview, hasura.GetAppointmentPlanPreviewVariables>(
    gql`
      query GetAppointmentPlanPreview($appointmentPlanId: uuid!) {
        appointment_plan_by_pk(id: $appointmentPlanId) {
          id
          title
          creator_id
          meet_generation_method
        }
      }
    `,
    { variables: { appointmentPlanId } },
  )
  const appointmentPlanPreview: {
    id: string
    title: string
    creatorId: string
    meetGenerationMethod: string
  } = {
    id: data?.appointment_plan_by_pk?.id,
    title: data?.appointment_plan_by_pk?.title || '',
    creatorId: data?.appointment_plan_by_pk?.creator_id || '',
    meetGenerationMethod: data?.appointment_plan_by_pk?.meet_generation_method || 'auto',
  }
  return {
    loading,
    appointmentPlanPreview,
  }
}

const useUpdateAppointmentPeriod = (orderProductId: string, options: { rescheduleLog: [] }) => {
  const [updateAppointmentPeriod] = useMutation<
    hasura.UpdateAppointmentPeriod,
    hasura.UpdateAppointmentPeriodVariables
  >(gql`
    mutation UpdateAppointmentPeriod(
      $orderProductId: uuid!
      $startedAt: timestamptz!
      $endedAt: timestamptz!
      $data: jsonb
    ) {
      update_order_product(
        where: { id: { _eq: $orderProductId } }
        _set: { started_at: $startedAt, ended_at: $endedAt, updated_at: "NOW()", options: $data }
      ) {
        affected_rows
      }
    }
  `)

  return (startedAt: Date | null, endedAt: Date | null, originStartedAt: Date | null, currentMemberId: string) =>
    updateAppointmentPeriod({
      variables: {
        orderProductId,
        startedAt,
        endedAt,
        data: {
          ...options,
          rescheduleLog: [
            ...options.rescheduleLog,
            {
              rescheduledAt: new Date(),
              rescheduleMemberId: currentMemberId,
              originScheduledDatetime: originStartedAt,
              targetRescheduleDatetime: startedAt,
            },
          ],
        },
      },
    })
}

export const useOrderProduct = (orderProductId: string) => {
  const { loading, data, refetch } = useQuery<hasura.GetOrderProduct, hasura.GetOrderProductVariables>(
    gql`
      query GetOrderProduct($orderProductId: uuid!) {
        order_product_by_pk(id: $orderProductId) {
          id
          started_at
          ended_at
          deliverables
          options
        }
      }
    `,
    { variables: { orderProductId } },
  )

  const orderProduct: {
    id: string
    startedAt: Date | null
    endedAt: Date | null
    canceledAt: Date | null
    appointmentUrl: string
    appointmentIssue: string | null
    options: any
  } = {
    id: data?.order_product_by_pk?.id,
    startedAt: data?.order_product_by_pk?.started_at ? new Date(data?.order_product_by_pk.started_at) : null,
    endedAt: data?.order_product_by_pk?.ended_at ? new Date(data?.order_product_by_pk.ended_at) : null,
    options: data?.order_product_by_pk?.options,
    canceledAt: data?.order_product_by_pk?.options?.['appointmentCanceledAt']
      ? new Date(data?.order_product_by_pk?.options['appointmentCanceledAt'])
      : null,
    appointmentUrl: data?.order_product_by_pk?.deliverables?.['join_url']
      ? data?.order_product_by_pk?.deliverables['join_url']
      : null,
    appointmentIssue: data?.order_product_by_pk?.options?.['appointmentIssue']
      ? data?.order_product_by_pk?.options['appointmentIssue']
      : null,
  }

  return {
    loading,
    orderProduct,
    refetchOrderProduct: refetch,
  }
}

export const useCreator = (creatorId: string) => {
  const { loading, data } = useQuery<hasura.GetCreatorInfo, hasura.GetCreatorInfoVariables>(
    gql`
      query GetCreatorInfo($creatorId: String) {
        member_public(where: { id: { _eq: $creatorId } }) {
          id
          picture_url
          name
        }
      }
    `,
    { variables: { creatorId } },
  )
  const creator: { avatarUrl: string | null; name: string } = {
    avatarUrl: data?.member_public?.[0]?.picture_url || '',
    name: data?.member_public?.[0]?.name || '',
  }
  return {
    loading,
    creator,
  }
}

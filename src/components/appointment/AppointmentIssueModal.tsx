import { Button, ButtonGroup } from '@chakra-ui/react'
import { Form, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import 'braft-editor/dist/output.css'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common'
import StyledBraftEditor, { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { createUploadFn, dateRangeFormatter } from '../../helpers'
import appointmentMessages from './translation'

const StyledModalTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledModalMetaBlock = styled.div`
  padding: 0.75rem;
  background-color: var(--gray-lighter);
  border-radius: 4px;
`

type Props = {
  visible: boolean
  onClose: () => void
  loading: boolean
  isFinished: boolean
  isCanceled: boolean
  form: FormComponentProps['form']
  appointmentIssue: string | null
  orderProduct: { startedAt: Date | null; endedAt: Date | null }
  appId: string
  authToken: string | null
  onSubmit: () => void
}

const AppointmentIssueModal: React.FC<Props> = ({
  visible,
  onClose,
  loading,
  isFinished,
  isCanceled,
  form,
  appointmentIssue,
  orderProduct,
  appId,
  authToken,
  onSubmit,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Modal width={660} visible={visible} footer={null} onCancel={onClose}>
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
              media={{
                uploadFn: createUploadFn(appId, authToken),
                accepts: { video: false, audio: false },
                externals: { image: true, video: false, audio: false, embed: true },
              }}
            />,
          )}
        </Form.Item>
      </Form>

      {isFinished && <BraftContent>{appointmentIssue}</BraftContent>}
      {isCanceled && <BraftContent>{appointmentIssue}</BraftContent>}
      {!isFinished && !isCanceled && (
        <ButtonGroup display="flex" marginTop="24px" justifyContent="flex-end">
          <Button variant="outline" marginRight="8px" onClick={onClose}>
            {formatMessage(appointmentMessages['*'].cancel)}
          </Button>
          <Button isLoading={loading} colorScheme="primary" onClick={onSubmit}>
            {formatMessage(appointmentMessages['*'].save)}
          </Button>
        </ButtonGroup>
      )}
    </Modal>
  )
}

export default AppointmentIssueModal

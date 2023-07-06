import { Button, Textarea } from '@chakra-ui/react'
import { Form, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import BraftEditor from 'braft-editor'
import StyledBraftEditor from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { braftLanguageFn, handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useMember, useUpdateMember } from '../../hooks/member'
import AdminCard from '../common/AdminCard'
import profileMessages from './translation'

const StyledForm = styled(Form)`
  .ant-row {
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .ant-row {
      flex-direction: row;
    }
  }
`

type ProfileIntroBusinessCardProps = CardProps & FormComponentProps & { memberId: string }

const ProfileIntroBusinessCard: React.VFC<ProfileIntroBusinessCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { member, refetchMember } = useMember(memberId)
  const updateMember = useUpdateMember()

  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields(async (error, values) => {
      if (error || !member) {
        return
      }
      setLoading(true)
      try {
        await updateMember({
          variables: {
            memberId,
            email: member.email.trim().toLowerCase(),
            username: member.username,
            name: member.name,
            pictureUrl: member.pictureUrl,
            title: member.title,
            abstract: values.companyAbstract || '',
            description: values.companyIntro?.toRAW(),
          },
        })
        refetchMember?.()
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(profileMessages.ProfileIntroBusinessCard.basicInfo)}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        <Form.Item label={formatMessage(profileMessages.ProfileIntroBusinessCard.abstract)}>
          {form.getFieldDecorator('companyAbstract', {
            initialValue: (member && member.abstract) || '',
            rules: [{ max: 100 }],
          })(<Textarea rows={2} />)}
        </Form.Item>
        <Form.Item
          label={formatMessage(profileMessages.ProfileIntroBusinessCard.intro)}
          wrapperCol={{ md: { span: 20 } }}
        >
          {form.getFieldDecorator('companyIntro', {
            initialValue: member && BraftEditor.createEditorState(member.description),
          })(
            <StyledBraftEditor
              language={braftLanguageFn}
              controls={[
                'headings',
                'font-size',
                'line-height',
                'text-color',
                'bold',
                'italic',
                'underline',
                'strike-through',
                'remove-styles',
                'separator',
                'text-align',
                'separator',
                'list-ol',
                'list-ul',
                'blockquote',
                'code',
                'separator',
                'media',
                'link',
                'hr',
                'separator',
                'fullscreen',
              ]}
            ></StyledBraftEditor>,
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button variant="outline" className="mr-2" onClick={() => form.resetFields()}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" type="submit" disabled={loading} isLoading={loading} _hover={{}}>
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfileIntroBusinessCardProps>()(ProfileIntroBusinessCard)

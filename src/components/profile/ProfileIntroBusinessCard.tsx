import { Button } from '@chakra-ui/react'
import { Form, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import profileMessages from './translation'
import AdminCard from '../common/AdminCard'
import { StyledForm } from '../layout'
import { FormEvent, useState } from 'react'
import { braftLanguageFn, handleError } from '../../helpers'
import BraftEditor from 'braft-editor'
import { useMember, useUpdateMember } from '../../hooks/member'

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
            abstract: member.abstract,
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
        {formatMessage(profileMessages.ProfileIntroBusinessCard.intro)}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        <Form.Item>
          {form.getFieldDecorator('companyIntro', {
            initialValue: member && BraftEditor.createEditorState(member.description),
          })(
            <BraftEditor
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
            ></BraftEditor>,
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

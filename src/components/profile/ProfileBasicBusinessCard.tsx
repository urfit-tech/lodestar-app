import { useMutation } from '@apollo/react-hooks'
import { Button, Skeleton } from '@chakra-ui/react'
import { Form, message, Select, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import hasura from '../../hasura'
import { handleError, uploadFile } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useMember, useUpdateMember } from '../../hooks/member'
import AdminCard from '../common/AdminCard'
import ImageUploader from '../common/ImageUploader'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'
import {
  INSERT_MEMBER_PROPERTY,
  UPDATE_MEMBER_PROPERTY,
  useIsEditableProperty,
  useMemberPropertyCollection,
} from './ProfileOtherAdminCard'
import profileMessages from './translation'

const StyledFormItem = styled(Form.Item)`
  .ant-form-item-children {
    display: flex;
    align-items: center;
  }

  .ant-upload.ant-upload-select-picture-card {
    border: none;
    background: none;
  }
`

const StyledUploadWarning = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
  height: 100%;
`

type ProfileBasicBusinessCardProps = CardProps & FormComponentProps & { memberId: string }

const ProfileBasicBusinessCard: React.VFC<ProfileBasicBusinessCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const { authToken } = useAuth()
  const { properties, refetchProperties, errorProperties, loadingProperties } = useIsEditableProperty(true)
  const { loadingMemberProperties, errorMemberProperties, refetchMemberProperties, memberProperties } =
    useMemberPropertyCollection(memberId)
  const { member, refetchMember } = useMember(memberId)
  const updateMember = useUpdateMember()

  const [loading, setLoading] = useState<boolean>(false)
  const [avatarImageFile, setAvatarImageFile] = useState<File | null>(null)

  const [insertMemberProperty] = useMutation<hasura.INSERT_MEMBER_PROPERTY, hasura.INSERT_MEMBER_PROPERTYVariables>(
    INSERT_MEMBER_PROPERTY,
  )
  const [updateMemberProperty] = useMutation<hasura.UPDATE_MEMBER_PROPERTY, hasura.UPDATE_MEMBER_PROPERTYVariables>(
    UPDATE_MEMBER_PROPERTY,
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields(async (error, formValues) => {
      if (error || !member) {
        return
      }
      setLoading(true)
      try {
        const avatarId = uuid()
        if (avatarImageFile) {
          await uploadFile(`avatars/${appId}/${memberId}/${avatarId}`, avatarImageFile, authToken)
        }
        const companyShortNamePropertyId = Object.keys(formValues).filter(
          propertyId => propertyId === memberProperties.find(item => item.name === '公司簡稱')?.id,
        )?.[0]

        await updateMember({
          variables: {
            memberId,
            email: member.email.trim().toLowerCase(),
            username: member.username,
            name: formValues[companyShortNamePropertyId] || member.name,
            pictureUrl: avatarImageFile
              ? `https://${process.env.REACT_APP_S3_BUCKET}/avatars/${appId}/${memberId}/${avatarId}`
              : member.pictureUrl,
            title: member.title,
            abstract: member.abstract,
            description: member.description,
          },
        })
        const updateMemberPropertyArray =
          Object.keys(formValues)
            .filter(propertyId => memberProperties.find(item => item.id === propertyId))
            .filter(propertyId => formValues[propertyId])
            .map(propertyId => {
              return {
                where: { member_id: { _eq: memberId }, property_id: { _eq: propertyId } },
                _set: { value: formValues[propertyId] },
              }
            }) || []
        if (updateMemberPropertyArray.length > 0) {
          await updateMemberProperty({
            variables: {
              updateMemberProperties: updateMemberPropertyArray,
            },
          })
          refetchMemberProperties()
        }

        const insertMemberPropertyArray = Object.keys(formValues)
          .filter(propertyId => !memberProperties.some(item => item.id === propertyId))
          .filter(propertyId => formValues[propertyId])
          .map(propertyId => {
            return {
              member_id: memberId,
              property_id: propertyId,
              value: formValues[propertyId],
            }
          })
        if (insertMemberPropertyArray.length > 0) {
          await insertMemberProperty({
            variables: {
              memberProperties: insertMemberPropertyArray,
            },
          })
          refetchMemberProperties()
        }

        refetchMember?.()
        setAvatarImageFile(null)
        refetchProperties()
        message.success(formatMessage(commonMessages.event.successfullySaved))
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    })
  }

  if (errorProperties || errorMemberProperties) {
    handleError(errorProperties || errorMemberProperties)
  }

  if (loadingProperties || loadingMemberProperties) {
    return <Skeleton loading={loading} avatar active />
  }
  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(profileMessages.ProfileBasicBusinessCard.basicInfo)}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        <StyledFormItem label={formatMessage(profileMessages.ProfileBasicBusinessCard.companyPicture)}>
          {member && (
            <>
              <ImageUploader
                imgUrl={member.pictureUrl}
                file={avatarImageFile}
                customStyle={{ shape: 'circle', width: '128px', ratio: 1 }}
                customButtonStyle={{ width: '80%' }}
                onChange={file => setAvatarImageFile(file)}
              />
              {avatarImageFile && (
                <StyledUploadWarning className="ml-2">
                  * {formatMessage(profileMessages.ProfileBasicBusinessCard.notUploaded)}
                </StyledUploadWarning>
              )}
            </>
          )}
        </StyledFormItem>
        {properties.map(property => {
          let defaultValue = memberProperties.find(field => field.id === property.id)?.value || ''
          return (
            <Form.Item label={`${property.name}`} key={property.id}>
              {form.getFieldDecorator(`${property.id}`, {
                initialValue: defaultValue,
                rules: [
                  {
                    required: false,
                    message: formatMessage(profileMessages.ProfileOtherAdminCard.enter, {
                      enterlabel: property.name,
                    }),
                  },
                ],
              })(
                property?.placeholder?.includes('/') ? (
                  <Select disabled={loading}>
                    {property?.placeholder?.split('/').map((value: string, idx: number) => (
                      <Select.Option key={idx} value={value}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <MigrationInput type={property.id} disabled={loading} />
                ),
              )}
            </Form.Item>
          )
        })}
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

export default Form.create<ProfileBasicBusinessCardProps>()(ProfileBasicBusinessCard)

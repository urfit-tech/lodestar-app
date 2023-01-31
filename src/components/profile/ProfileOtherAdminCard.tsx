import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'

const GET_POHNE_ENABLE_SETTING = gql`
  query GET_POHNE_ENABLE_SETTING {
    setting(where: { key: { _eq: "profile_page.edit_phone.enable" } }) {
      key
      app_settings {
        id
        key
        value
      }
    }
  }
`
const GET_MEMBER_PHONE = gql`
  query GET_MEMBER_PHONE($memberId: String!) {
    member_phone(where: { member_id: { _eq: $memberId } }) {
      id
      member_id
      phone
    }
  }
`

const useProperty = () => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PROPERTY, hasura.GET_PROPERTYVariables>(
    gql`
      query GET_PROPERTY($type: String!) {
        property(where: { type: { _eq: $type }, is_editable: { _eq: true } }, order_by: { position: asc }) {
          id
          name
          placeholder
          is_editable
          member_properties {
            id
            member_id
            value
          }
        }
      }
    `,
    { variables: { type: 'member' } },
  )

  const properties =
    data?.property.map(v => ({
      id: v.id,
      name: v.name,
      placeholder: v.placeholder?.replace(/[()]/g, ''),
      isEditable: v.is_editable,
      memberProperties: v.member_properties,
    })) || []

  return {
    loadingProperties: loading,
    errorProperties: error,
    properties,
    refetchProperties: refetch,
  }
}
const useMemberPhoneEableSetting = (memberId: string) => {
  const phoneEnable = useQuery<hasura.GET_POHNE_ENABLE_SETTING>(GET_POHNE_ENABLE_SETTING)

  const phoneNumberData = useQuery<hasura.GET_MEMBER_PHONE, hasura.GET_MEMBER_PHONEVariables>(GET_MEMBER_PHONE, {
    variables: { memberId: memberId },
  })
  const phoneEnableStatus =
    phoneEnable.loading || phoneEnable.error || !phoneEnable.data
      ? null
      : phoneEnable.data.setting[0].app_settings[0].value
  const phoneNumber =
    phoneNumberData.loading || phoneNumberData.error || !phoneNumberData.data
      ? null
      : phoneNumberData.data.member_phone.find((item: { member_id: string }) => item.member_id === memberId)?.phone ||
        ''
  console.log(phoneNumber, phoneEnable, 'phonetest')
  return { phoneEnableStatus, phoneNumber }
}
const UPDATE_MEMBER_PROPERTY = gql`
  mutation UPDATE_MEMBER_PROPERTY($memberId: String!, $memberProperties: [member_property_insert_input!]!) {
    delete_member_property(where: { member_id: { _eq: $memberId } }) {
      affected_rows
    }
    insert_member_property(objects: $memberProperties) {
      affected_rows
    }
  }
`
const UPDATE_MEMBER_PHONE = gql`
  mutation UPDATE_MEMBER_PHONE($memberId: String!, $memberPhone: [member_phone_insert_input!]!) {
    delete_member_phone(where: { member_id: { _eq: $memberId } }) {
      affected_rows
    }
    insert_member_phone(objects: $memberPhone) {
      affected_rows
    }
  }
`

type ProfileOtherAdminCardProps = CardProps & FormComponentProps & { memberId: string }
const ProfileOtherAdminCard: React.VFC<ProfileOtherAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const { phoneEnableStatus, phoneNumber } = useMemberPhoneEableSetting(memberId)
  const { properties, refetchProperties, errorProperties, loadingProperties } = useProperty()
  const [updateMemberProperty] = useMutation<hasura.UPDATE_MEMBER_PROPERTY, hasura.UPDATE_MEMBER_PROPERTYVariables>(
    UPDATE_MEMBER_PROPERTY,
  )
  const [updateMemberPhone] = useMutation<hasura.UPDATE_MEMBER_PHONE, hasura.UPDATE_MEMBER_PHONEVariables>(
    UPDATE_MEMBER_PHONE,
  )
  console.log({ properties, memberId }, 'isPhoneEableStatus')
  // const validatorPhonenumber = (callback: (arg0: string | undefined) => void) => {
  //   let checkPhonenumber = form.getFieldValue('phone')
  //   const regex = /^\+?\(?[0-9]+\)?-?[0-9]+$/
  //   if (checkPhonenumber.match(regex)) {
  //     callback('請輸入正確格式手機號碼!')
  //   } else {
  //     callback('')
  //   }
  // }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, formValues) => {
      if (!error) {
        setLoading(true)
        if (formValues['phone']) {
          updateMemberPhone({
            variables: {
              memberId,
              memberPhone: Object.keys(formValues)
                .filter(propertyId => propertyId === 'phone')
                .map(() => ({
                  member_id: memberId,
                  phone: formValues['phone'],
                })),
            },
          })
            .then(() => {
              message.success(formatMessage(commonMessages.event.successfullySaved))
              refetchProperties()
            })
            .catch(handleError)

          delete formValues['phone']
        }
        debugger
        // console.log(`${property_id}: ${value}`)
        updateMemberProperty({
          variables: {
            memberId,
            memberProperties: Object.keys(formValues)
              .filter(propertyId => formValues[propertyId])
              .map(propertyId => ({
                member_id: memberId,
                property_id: propertyId,
                value: formValues[propertyId],
              })),
          },
        })
          .then(() => {
            message.success(formatMessage(commonMessages.event.successfullySaved))
            refetchProperties()
          })
          .catch(handleError)
          .finally(() => setLoading(false))
      }
    })
  }
  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {'其他資料'}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        {phoneEnableStatus ? (
          <Form.Item label={`手機號碼`}>
            {form.getFieldDecorator(`phone`, {
              initialValue: phoneNumber,
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: `請輸入手機號碼`,
                },
                {
                  validator: (value, callback) => {
                    // let checkPhonenumber = form.getFieldValue('phone')
                    const regex = /^\+?\(?[0-9]+\)?-?[0-9]+$/g
                    if (!form.getFieldValue('phone').match(regex)) {
                      callback('你就沒打正確的手機號碼! 為什麼還可以通過')
                    } else {
                      callback()
                    }
                  },
                },
              ],
            })(<MigrationInput type="phone" />)}
          </Form.Item>
        ) : (
          <></>
        )}
        {properties.map(item => {
          let defaultValue = item.memberProperties.find(item => item.member_id === memberId)?.value || ''
          console.log('defaultValue', defaultValue)
          return (
            <Form.Item label={`${item.name}`}>
              {form.getFieldDecorator(`${item.id}`, {
                initialValue: defaultValue,
                rules: [
                  // {
                  //   type: 'string',
                  //   message: `請輸入${item.name}`,
                  // },
                  {
                    required: true,
                    message: `請輸入${item.name}`,
                  },
                ],
              })(<MigrationInput type={item.id} />)}
            </Form.Item>
          )
        })}
        {/* <Form.Item label={formatMessage(settingsMessages.profile.form.label.currentPassword)}>
          {form.getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: formatMessage(profileMessages.form.message.currentPassword),
              },
            ],
          })(<MigrationInput type="password" />)}
        </Form.Item>
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.newPassword)}>
          {form.getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: formatMessage(settingsMessages.profile.form.message.newPassword),
              },
            ],
          })(<MigrationInput type="password" />)}
        </Form.Item>
        <Form.Item label={formatMessage(settingsMessages.profile.form.label.confirmation)}>
          {form.getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: formatMessage(settingsMessages.profile.form.message.confirmation),
              },
              {
                validator: (rule, value, callback) => {
                  if (value && form.getFieldValue('newPassword') !== value) {
                    callback(new Error(formatMessage(settingsMessages.profile.form.validator.password)))
                  }
                  callback()
                },
              },
            ],
          })(<MigrationInput type="password" />)}
        </Form.Item> */}
        <Form.Item wrapperCol={{ md: { offset: 4 } }}>
          <Button variant="outline" className="mr-2" onClick={() => form.resetFields()}>
            {formatMessage(commonMessages.ui.cancel)}
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            {formatMessage(commonMessages.button.save)}
          </Button>
        </Form.Item>
      </StyledForm>
    </AdminCard>
  )
}

export default Form.create<ProfileOtherAdminCardProps>()(ProfileOtherAdminCard)

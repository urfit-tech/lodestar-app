import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import { Form, message, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { FormEvent, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'
const messages = defineMessages({
  otherInfoTitle: { id: 'member.messages.ui.otherInfoTitle', defaultMessage: '其他資料' },
  phone: { id: 'member.messages.ui.phone', defaultMessage: '手機號碼' },
  enterPhone: { id: 'member.messages.ui.enterPhone', defaultMessage: '請輸入手機號碼' },
  enter: { id: 'member.messages.ui.enter', defaultMessage: '請輸入' },
})

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
    member_phone(where: { member_id: { _eq: $memberId } }, limit: 1, order_by: { updated_at: asc }) {
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
  let defaultPhoneNumber = null

  // ? null
  // : {
  //     id:
  //     value:
  //       phoneNumberData.data.member_phone.find((item: { member_id: string }) => item.member_id === memberId)
  //         ?.phone || '',
  //   }

  if (phoneNumberData.loading || phoneNumberData.error || !phoneNumberData.data) {
    defaultPhoneNumber = null
  } else {
    let data = phoneNumberData.data.member_phone.find((item: { member_id: string }) => item.member_id === memberId) || {
      id: '',
      phone: '',
    }
    defaultPhoneNumber = {
      id: data?.id,
      value: data?.phone,
    }
  }
  return { phoneEnableStatus, defaultPhoneNumber, refetchPhoneMember: phoneNumberData.refetch }
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
  mutation UPDATE_MEMBER_PHONE($phoneId: uuid!, $phoneValue: String!) {
    update_member_phone(where: { id: { _eq: $phoneId } }, _set: { phone: $phoneValue }) {
      affected_rows
    }
  }
`
const INSERT_MEMBER_PHONE = gql`
  mutation INSERT_MEMBER_PHONE($memberPhone: [member_phone_insert_input!]!) {
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
  const { phoneEnableStatus, defaultPhoneNumber, refetchPhoneMember } = useMemberPhoneEableSetting(memberId)
  const { properties, refetchProperties, errorProperties, loadingProperties } = useProperty()
  const [updateMemberProperty] = useMutation<hasura.UPDATE_MEMBER_PROPERTY, hasura.UPDATE_MEMBER_PROPERTYVariables>(
    UPDATE_MEMBER_PROPERTY,
  )
  const [updateMemberPhone] = useMutation<hasura.UPDATE_MEMBER_PHONE, hasura.UPDATE_MEMBER_PHONEVariables>(
    UPDATE_MEMBER_PHONE,
  )
  const [insertMemberPhone] = useMutation<hasura.INSERT_MEMBER_PHONE, hasura.INSERT_MEMBER_PHONEVariables>(
    INSERT_MEMBER_PHONE,
  )
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields((error, formValues) => {
      if (!error) {
        setLoading(true)
        try {
          if (formValues['phone']) {
            if (defaultPhoneNumber?.value === '') {
              insertMemberPhone({
                variables: {
                  memberPhone: Object.keys(formValues)
                    .filter(propertyId => propertyId === 'phone')
                    .map(() => ({
                      member_id: memberId,
                      phone: formValues['phone'],
                    })),
                },
              })
            } else {
              updateMemberPhone({
                variables: {
                  phoneId: defaultPhoneNumber?.id,
                  phoneValue: formValues['phone'] || defaultPhoneNumber?.value,
                },
              })
            }

            delete formValues['phone']
          }
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
          refetchPhoneMember()
          refetchProperties()
          message.success(formatMessage(commonMessages.event.successfullySaved))
        } catch (err) {
          handleError(err)
        } finally {
          setLoading(false)
        }
      }
    })
  }
  return (
    <AdminCard {...cardProps}>
      <Typography.Title className="mb-4" level={4}>
        {formatMessage(messages.otherInfoTitle)}
      </Typography.Title>
      <StyledForm
        labelCol={{ span: 24, md: { span: 4 } }}
        wrapperCol={{ span: 24, md: { span: 8 } }}
        onSubmit={handleSubmit}
      >
        {phoneEnableStatus ? (
          <Form.Item label={formatMessage(messages.phone)}>
            {form.getFieldDecorator(`phone`, {
              initialValue: defaultPhoneNumber?.value,
              validateTrigger: 'onSubmit',
              rules: [
                {
                  required: true,
                  message: formatMessage(messages.enterPhone),
                },
                {
                  validator: (rule, value, callback) => {
                    const regex = /^\+?\(?[0-9]+\)?-?[0-9]+$/g
                    if (!form.getFieldValue('phone').match(regex)) {
                      callback(formatMessage(messages.enterPhone))
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
          return (
            <Form.Item label={`${item.name}`}>
              {form.getFieldDecorator(`${item.id}`, {
                initialValue: defaultValue,
                rules: [
                  {
                    required: true,
                    message: `${formatMessage(messages.enter)}${item.name}`,
                  },
                ],
              })(<MigrationInput type={item.id} />)}
            </Form.Item>
          )
        })}
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

import { useMutation, useQuery } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import { Form, message, Select, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import gql from 'graphql-tag'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'
import profileMessages from './translation'
const useIsEditableProperty = () => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_EDITABLE_PROPERTY,
    hasura.GET_EDITABLE_PROPERTYVariables
  >(
    gql`
      query GET_EDITABLE_PROPERTY($type: String!) {
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
const useMemberPropertyCollection = (memberId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_MEMBER_PROPERTY_COLLECTION,
    hasura.GET_MEMBER_PROPERTY_COLLECTIONVariables
  >(
    gql`
      query GET_MEMBER_PROPERTY_COLLECTION($memberId: String!) {
        member_property(where: { member_id: { _eq: $memberId } }) {
          id
          property {
            id
            name
          }
          value
        }
      }
    `,
    {
      variables: {
        memberId,
      },
    },
  )

  const memberProperties: { id: String; name: String; value: String }[] =
    loading || error || !data
      ? []
      : data?.member_property.map(v => ({
          id: v.property.id,
          name: v.property.name,
          value: v.value,
        }))
  return {
    loadingMemberProperties: loading,
    errorMemberProperties: error,
    memberProperties,
    refetchMemberProperties: refetch,
  }
}
const useMemberPhoneEnableSetting = (memberId: string) => {
  const phoneNumberData = useQuery<hasura.GET_MEMBER_PHONE, hasura.GET_MEMBER_PHONEVariables>(GET_MEMBER_PHONE, {
    variables: { memberId: memberId },
  })
  let defaultPhoneNumber = null
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
  return { defaultPhoneNumber, refetchPhoneMember: phoneNumberData.refetch }
}

type ProfileOtherAdminCardProps = CardProps & FormComponentProps & { memberId: string }
const ProfileOtherAdminCard: React.VFC<ProfileOtherAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const { authToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const { defaultPhoneNumber, refetchPhoneMember } = useMemberPhoneEnableSetting(memberId)
  const { properties, refetchProperties, errorProperties, loadingProperties } = useIsEditableProperty()
  const { loadingMemberProperties, errorMemberProperties, memberProperties } = useMemberPropertyCollection(memberId)

  if (errorProperties || errorMemberProperties) {
    handleError(errorProperties || errorMemberProperties)
  }
  const [updateMemberProperty] = useMutation<hasura.UPDATE_MEMBER_PROPERTY, hasura.UPDATE_MEMBER_PROPERTYVariables>(
    UPDATE_MEMBER_PROPERTY,
  )
  const [insertMemberProperty] = useMutation<hasura.INSERT_MEMBER_PROPERTY, hasura.INSERT_MEMBER_PROPERTYVariables>(
    INSERT_MEMBER_PROPERTY,
  )
  const { settings } = useApp()
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
          let updateMemberPropertyArray =
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
            updateMemberProperty({
              variables: {
                updateMemberProperties: updateMemberPropertyArray,
              },
            })
          }

          let insertMemberPropertyArray = Object.keys(formValues)
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
            insertMemberProperty({
              variables: {
                memberProperties: insertMemberPropertyArray,
              },
            })
          }
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
  let phoneEnableCheck = settings['profile_page.edit_phone.enable'] === '1'
  if (phoneEnableCheck || properties.length > 0) {
    return (
      <AdminCard {...cardProps}>
        <Typography.Title className="mb-4" level={4}>
          {formatMessage(profileMessages.ProfileOtherAdminCard.otherInfoTitle)}
        </Typography.Title>
        <StyledForm
          labelCol={{ span: 24, md: { span: 4 } }}
          wrapperCol={{ span: 24, md: { span: 8 } }}
          onSubmit={handleSubmit}
        >
          {settings['profile_page.edit_phone.enable'] === '1' ? (
            <Form.Item label={formatMessage(profileMessages.ProfileOtherAdminCard.phone)}>
              {form.getFieldDecorator(`phone`, {
                initialValue: defaultPhoneNumber?.value,
                validateTrigger: 'onSubmit',
                rules: [
                  {
                    required: true,
                    message: formatMessage(profileMessages.ProfileOtherAdminCard.enterPhone),
                  },
                  {
                    validator: (rule, value, callback) => {
                      const regex = /^\+?\(?[0-9]+\)?-?[0-9]+$/g
                      if (!form.getFieldValue('phone').match(regex)) {
                        callback(formatMessage(profileMessages.ProfileOtherAdminCard.entercorrectPhone))
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
                    <Select>
                      {property?.placeholder?.split('/').map((value: string, idx: number) => (
                        <Select.Option key={idx} value={value}>
                          {value}
                        </Select.Option>
                      ))}
                    </Select>
                  ) : (
                    <MigrationInput type={property.id} />
                  ),
                )}
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
  } else {
    return <></>
  }
}
export default Form.create<ProfileOtherAdminCardProps>()(ProfileOtherAdminCard)
const GET_MEMBER_PHONE = gql`
  query GET_MEMBER_PHONE($memberId: String!) {
    member_phone(where: { member_id: { _eq: $memberId } }, limit: 1, order_by: { updated_at: asc }) {
      id
      member_id
      phone
    }
  }
`

const INSERT_MEMBER_PROPERTY = gql`
  mutation INSERT_MEMBER_PROPERTY($memberProperties: [member_property_insert_input!]!) {
    insert_member_property(objects: $memberProperties) {
      affected_rows
    }
  }
`
const UPDATE_MEMBER_PROPERTY = gql`
  mutation UPDATE_MEMBER_PROPERTY($updateMemberProperties: [member_property_updates!]!) {
    update_member_property(updates: $updateMemberProperties) {
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

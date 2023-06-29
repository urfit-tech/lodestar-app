import { gql, useMutation, useQuery } from '@apollo/client'
import { Button, Skeleton } from '@chakra-ui/react'
import { Form, message, Select, Typography } from 'antd'
import { CardProps } from 'antd/lib/card'
import { FormComponentProps } from 'antd/lib/form'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { FormEvent, useState } from 'react'
import { useIntl } from 'react-intl'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import AdminCard from '../common/AdminCard'
import MigrationInput from '../common/MigrationInput'
import { StyledForm } from '../layout'
import profileMessages from './translation'

type ProfileOtherAdminCardProps = CardProps & FormComponentProps & { memberId: string }

const ProfileOtherAdminCard: React.VFC<ProfileOtherAdminCardProps> = ({ form, memberId, ...cardProps }) => {
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const { defaultPhoneNumber, refetchPhoneMember } = useMemberPhoneEnableSetting(memberId)
  const { properties, refetchProperties, errorProperties, loadingProperties } = useIsEditableProperty()
  const { loadingMemberProperties, errorMemberProperties, refetchMemberProperties, memberProperties } =
    useMemberPropertyCollection(memberId)

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
    form.validateFields(async (error, formValues) => {
      if (!error) {
        setLoading(true)
        try {
          if (formValues['phone']) {
            if (defaultPhoneNumber?.phone === '') {
              await insertMemberPhone({
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
              await updateMemberPhone({
                variables: {
                  phoneId: defaultPhoneNumber?.id,
                  phoneValue: formValues['phone'] || defaultPhoneNumber?.phone,
                },
              })
            }
            refetchPhoneMember()
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
            await updateMemberProperty({
              variables: {
                updateMemberProperties: updateMemberPropertyArray,
              },
            })

            refetchMemberProperties()
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
            await insertMemberProperty({
              variables: {
                memberProperties: insertMemberPropertyArray,
              },
            })

            refetchMemberProperties()
          }
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

  if (errorProperties || errorMemberProperties) {
    handleError(errorProperties || errorMemberProperties)
  }

  if (loadingProperties || loadingMemberProperties) {
    return <Skeleton loading={loading} avatar active />
  }

  if (settings['profile_page.edit_phone.enable'] === '1' || properties.length > 0) {
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
                initialValue: defaultPhoneNumber?.phone,
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
                        callback(formatMessage(profileMessages.ProfileOtherAdminCard.enterCorrectPhone))
                      } else {
                        callback()
                      }
                    },
                  },
                ],
              })(<MigrationInput type="phone" disabled={loading} />)}
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
                      required: property.isRequired,
                      message: formatMessage(profileMessages.ProfileOtherAdminCard.enter, {
                        enterLabel: property.name,
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
  } else {
    return <></>
  }
}
export default Form.create<ProfileOtherAdminCardProps>()(ProfileOtherAdminCard)

export const useIsEditableProperty = (isBusiness: boolean = false) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_EDITABLE_PROPERTY,
    hasura.GET_EDITABLE_PROPERTYVariables
  >(
    gql`
      query GET_EDITABLE_PROPERTY($type: String!, $isBusiness: Boolean!) {
        property(
          where: { type: { _eq: $type }, is_editable: { _eq: true }, is_business: { _eq: $isBusiness } }
          order_by: { position: asc }
        ) {
          id
          name
          placeholder
          is_editable
          is_required
          member_properties {
            id
            member_id
            value
          }
        }
      }
    `,
    { variables: { type: 'member', isBusiness } },
  )

  const properties =
    data?.property.map(v => ({
      id: v.id,
      name: v.name,
      placeholder: v.placeholder?.replace(/[()]/g, ''),
      isEditable: v.is_editable,
      isRequired: v.is_required,
      memberProperties: v.member_properties,
    })) || []

  return {
    loadingProperties: loading,
    errorProperties: error,
    properties,
    refetchProperties: refetch,
  }
}
export const useMemberPropertyCollection = (memberId: string) => {
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
    data?.member_property.map(v => ({
      id: v.property.id,
      name: v.property.name,
      value: v.value,
    })) || []

  return {
    loadingMemberProperties: loading,
    errorMemberProperties: error,
    memberProperties,
    refetchMemberProperties: refetch,
  }
}
const useMemberPhoneEnableSetting = (memberId: string) => {
  const { data, refetch } = useQuery<hasura.GET_MEMBER_PHONE, hasura.GET_MEMBER_PHONEVariables>(GET_MEMBER_PHONE, {
    variables: { memberId: memberId },
  })

  const defaultPhoneNumber = {
    id: data?.member_phone?.[0]?.id || '',
    phone: data?.member_phone?.[0]?.phone || '',
  }

  return { defaultPhoneNumber, refetchPhoneMember: refetch }
}

const GET_MEMBER_PHONE = gql`
  query GET_MEMBER_PHONE($memberId: String!) {
    member_phone(where: { member_id: { _eq: $memberId } }, limit: 1, order_by: { updated_at: desc }) {
      id
      member_id
      phone
    }
  }
`

export const INSERT_MEMBER_PROPERTY = gql`
  mutation INSERT_MEMBER_PROPERTY($memberProperties: [member_property_insert_input!]!) {
    insert_member_property(objects: $memberProperties) {
      affected_rows
    }
  }
`
export const UPDATE_MEMBER_PROPERTY = gql`
  mutation UPDATE_MEMBER_PROPERTY($updateMemberProperties: [member_property_updates!]!) {
    update_member_property_many(updates: $updateMemberProperties) {
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

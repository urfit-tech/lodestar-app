import { Button } from '@chakra-ui/react'
import { Form, Input, Skeleton } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import Axios from 'axios'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { handleError } from 'lodestar-app-element/src/helpers'
import { SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import { useMemberSignUpProperty, useSignUpProperty } from '../../hooks/common'
import SignupForm from './SignupForm'
import commonMessages from './translation'

type SignPropertySectionProps = FormComponentProps & {
  onModalVisible?: React.Dispatch<SetStateAction<boolean>>
}

const SignupPropertySection: React.VFC<SignPropertySectionProps> = ({ form, onModalVisible }) => {
  const { currentMemberId, authToken } = useAuth()
  const { formatMessage } = useIntl()
  const [loading, setLoading] = useState(false)
  const { loadingSignUpProperty, signUpProperties, errorSignUpProperty } = useSignUpProperty()
  const {
    loading: loadingMemberSignUpProperty,
    error: errorMemberSignUpProperty,
    memberSignUpProperties,
    memberName,
  } = useMemberSignUpProperty(
    signUpProperties.map(v => v.propertyId),
    currentMemberId || '',
  )

  if (loadingSignUpProperty || loadingMemberSignUpProperty) return <Skeleton active />
  if (errorSignUpProperty || errorMemberSignUpProperty) return <>{formatMessage(commonMessages['*'].fetchError)}</>

  return (
    <SignupForm
      form={form}
      signUpProperties={signUpProperties}
      memberSignUpProperties={memberSignUpProperties}
      renderDefaultProperty={
        <Form.Item key="name" label={formatMessage(commonMessages.SignupPropertySection.name)}>
          {form.getFieldDecorator('name', {
            initialValue: memberName,
            rules: [
              {
                required: true,
                message: formatMessage(commonMessages.SignupPropertySection.enterName),
              },
            ],
          })(<Input placeholder={formatMessage(commonMessages.SignupPropertySection.nameFieldWarning)} />)}
        </Form.Item>
      }
      renderSubmitButton={
        <Form.Item>
          <Button loading={loading} colorScheme="primary" type="submit" isFullWidth block="true">
            {formatMessage(commonMessages['*'].save)}
          </Button>
        </Form.Item>
      }
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        form.validateFieldsAndScroll(
          {
            scroll: {
              offsetTop: 35,
            },
          },
          (error, values) => {
            if (error) return
            const signPropertyTypes: { [key: string]: string } = {}
            signUpProperties.forEach(p => (signPropertyTypes[p.id] = p.type))
            const signupInfos = Object.keys(values).map(id => {
              let value = values[id] || ''
              if (signPropertyTypes[id] === 'input') {
                value = value.trim()
              }
              return {
                id: id,
                value: value,
              }
            })
            process.env.REACT_APP_GRAPHQL_ENDPOINT &&
              Axios.post(
                process.env.REACT_APP_GRAPHQL_ENDPOINT,
                {
                  query: `mutation UPDATE_MEMBER_INFO($memberId: String!, $name: String, $memberProperties: [member_property_insert_input!]!) {
                    update_member(where: {id: {_eq: $memberId}}, _set: {name: $name}) {
                      affected_rows
                    }
                    insert_member_property(objects: $memberProperties, on_conflict: {constraint: member_property_member_id_property_id_key, update_columns: [value]}) {
                      affected_rows
                    }
                  }
                  `,
                  variables: {
                    memberId: currentMemberId,
                    name: signupInfos?.find(v => v.id === 'name')?.value || '',
                    memberProperties:
                      signupInfos
                        ?.filter(v => v.id !== 'name')
                        ?.map(v => ({
                          member_id: currentMemberId,
                          property_id: v.id,
                          value: v?.value.toString() || '',
                        })) || [],
                  },
                },
                { headers: { Authorization: `Bearer ${authToken}` } },
              )
                .then(() => {})
                .catch(error => handleError(error))
                .finally(() => {
                  setLoading(false)
                  onModalVisible?.(false)
                })
          },
        )
      }}
    />
  )
}

export default Form.create<SignPropertySectionProps>()(SignupPropertySection)

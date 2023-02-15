import { Button } from '@chakra-ui/react'
import { Checkbox, Col, Form, Input, Row, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { SignupProperty } from '../auth/RegisterSection'
import commonMessages from './translation'

const StyledCheckboxGroup = styled(Checkbox.Group)`
  && .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${props => props.theme['@primary-color']};
    border-color: ${props => props.theme['@primary-color']};
  }
`

const SignupForm: React.VFC<
  FormComponentProps & {
    defaultPropertyRender?: React.ReactNode
    signupProperties: SignupProperty[]
    onSubmit?: (e: any) => void
  }
> = ({ form, defaultPropertyRender, signupProperties, onSubmit }) => {
  const { formatMessage } = useIntl()

  return (
    <>
      {defaultPropertyRender}
      <Form layout="vertical" onSubmit={e => onSubmit?.(e)}>
        {signupProperties.map(signupProperty => {
          switch (signupProperty.type) {
            case 'input':
              return (
                <Form.Item key={signupProperty.propertyId} label={signupProperty.name}>
                  {form.getFieldDecorator(signupProperty.propertyId, {
                    rules: [
                      {
                        required: signupProperty.isRequired,
                        message:
                          signupProperty.ruleMessage ||
                          formatMessage(commonMessages['*'].isRequiredWarning, { name: signupProperty.name }),
                      },
                    ],
                  })(<Input placeholder={signupProperty.placeHolder} />)}
                </Form.Item>
              )
            case 'checkbox':
              return (
                <Form.Item key={signupProperty.propertyId} label={signupProperty.name}>
                  {form.getFieldDecorator(signupProperty.propertyId, {
                    valuePropName: 'checked',
                    rules: [
                      {
                        required: signupProperty.isRequired,
                        message:
                          signupProperty.ruleMessage ||
                          formatMessage(commonMessages['*'].isRequiredWarning, { name: signupProperty.name }),
                      },
                    ],
                  })(
                    <StyledCheckboxGroup className="StyledCheckboxGroup">
                      <Row>
                        {signupProperty.selectOptions?.map(selectOption => (
                          <Col className="mb-2" span={Math.floor(24 / (signupProperty?.rowAmount || 1))}>
                            <Checkbox value={selectOption}>{selectOption}</Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </StyledCheckboxGroup>,
                  )}
                </Form.Item>
              )
            case 'select':
              return (
                <Form.Item key={signupProperty.propertyId} label={signupProperty.name}>
                  {form.getFieldDecorator(signupProperty.propertyId, {
                    rules: [
                      {
                        required: signupProperty.isRequired,
                        message:
                          signupProperty.ruleMessage ||
                          formatMessage(commonMessages['*'].isRequiredWarning, { name: signupProperty.name }),
                      },
                    ],
                  })(
                    <Select placeholder={signupProperty.placeHolder}>
                      {signupProperty.selectOptions?.map(selectOption => (
                        <Select.Option value={selectOption}>{selectOption}</Select.Option>
                      ))}
                    </Select>,
                  )}
                </Form.Item>
              )
            // TODO: finish it
            case 'radio':
              return <></>
            // TODO: finish it
            case 'textArea':
              return <></>
            default:
              return <></>
          }
        })}

        <Form.Item>
          <Button colorScheme="primary" type="submit" isFullWidth block="true">
            {formatMessage(commonMessages['*'].nextStep)}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default SignupForm

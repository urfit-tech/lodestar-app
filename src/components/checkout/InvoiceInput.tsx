import { Checkbox, Form, Input, Select, Skeleton } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { validationRegExp } from '../../helpers'
import { checkoutMessages } from '../../helpers/translation'
import { CommonTitleMixin } from '../common'
import { ShippingProps } from './ShippingInput'

const StyledWrapper = styled.div`
  .ant-select {
    width: 100%;
  }
`
const StyledTitle = styled.div`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
const StyledDescription = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledRemark = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.18px;
`

export type InvoiceProps = {
  name: string
  phone: string
  email: string
  phoneBarCode?: string
  citizenCode?: string
  uniformNumber?: string
  uniformTitle?: string
  donationCode?: string
  postCode?: string
  address?: string
  referrerEmail?: string
}

type InvoiceType = 'electronic' | 'uniform-number' | 'donation' | 'hardcopy' | 'hardcopy-uniform-number'
type InvoiceOption = 'send-to-email' | 'use-phone-bar-code' | 'citizen-digital-certificate'

export const validateInvoice: (invoice: InvoiceProps) => string[] = invoice => {
  const errorFields: string[] = []
  for (const fieldId in invoice) {
    const fieldValue =
      fieldId === 'phone'
        ? invoice[fieldId as keyof InvoiceProps]?.replace(/-/g, '')
        : invoice[fieldId as keyof InvoiceProps]
    if (
      typeof fieldValue === 'string' &&
      (!fieldValue || (validationRegExp[fieldId] && !validationRegExp[fieldId].test(fieldValue)))
    ) {
      errorFields.push(fieldId)
    }
  }
  return errorFields
}

const InvoiceInput: React.VFC<{
  value?: InvoiceProps
  onChange?: (value: InvoiceProps) => void
  isValidating?: boolean
  shouldSameToShippingCheckboxDisplay?: boolean
}> = ({ value, onChange, isValidating, shouldSameToShippingCheckboxDisplay }) => {
  const { formatMessage } = useIntl()
  const { loading, enabledModules } = useApp()

  const nameRef = useRef<Input | null>(null)
  const phoneRef = useRef<Input | null>(null)
  const emailRef = useRef<Input | null>(null)
  const phoneBarCodeRef = useRef<Input | null>(null)
  const citizenCodeRef = useRef<Input | null>(null)
  const uniformNumberRef = useRef<Input | null>(null)
  const uniformTitleRef = useRef<Input | null>(null)
  const postCodeRef = useRef<Input | null>(null)
  const addressRef = useRef<Input | null>(null)

  const [selectedType, setSelectedType] = useState<InvoiceType | null>(null)
  const [selectedOption, setSelectedOption] = useState<InvoiceOption | null>(null)
  const [selectedCharity, setSelectedCharity] = useState('5380')

  const errorFields = isValidating && value ? validateInvoice(value) : []

  useEffect(() => {
    if (loading) {
      return
    }

    if (enabledModules.invoice) {
      setSelectedType('donation')
    } else {
      setSelectedType('hardcopy')
    }

    try {
      const cachedInvoiceRaw = localStorage.getItem('kolable.cart.invoice')
      if (!cachedInvoiceRaw) {
        return
      }

      const cachedInvoice: {
        type?: InvoiceType
        option?: InvoiceOption
        value?: InvoiceProps
      } = JSON.parse(cachedInvoiceRaw)

      cachedInvoice.type && setSelectedType(cachedInvoice.type)
      cachedInvoice.option && setSelectedOption(cachedInvoice.option)
    } catch (error) {}
  }, [loading, enabledModules.invoice])

  if (loading) {
    return <Skeleton active />
  }

  const handleChange: (props: {
    invoiceType?: InvoiceType | null
    invoiceOption?: InvoiceOption | null
    invoiceCharity?: string
    shippingName?: string
    shippingPhone?: string
    shippingAddress?: string
  }) => void = ({ invoiceType, invoiceOption, invoiceCharity, shippingName, shippingPhone, shippingAddress }) => {
    const currentInvoiceType = typeof invoiceType === 'undefined' ? selectedType : invoiceType
    const currentInvoiceOption = typeof invoiceOption === 'undefined' ? selectedOption : invoiceOption
    const currentSelectedCharity = typeof invoiceCharity === 'undefined' ? selectedCharity : invoiceCharity

    typeof invoiceType !== 'undefined' && setSelectedType(invoiceType)
    typeof invoiceOption !== 'undefined' && setSelectedOption(invoiceOption)
    typeof invoiceCharity !== 'undefined' && setSelectedCharity(invoiceCharity)

    const currentValue: InvoiceProps = {
      name: shippingName || nameRef.current?.input.value || '',
      phone: shippingPhone || phoneRef.current?.input.value || '',
      email: emailRef.current?.input.value || '',
      phoneBarCode:
        currentInvoiceOption === 'use-phone-bar-code' ? phoneBarCodeRef.current?.input.value || '' : undefined,
      citizenCode:
        currentInvoiceOption === 'citizen-digital-certificate' ? citizenCodeRef.current?.input.value || '' : undefined,
      uniformNumber:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformNumberRef.current?.input.value || ''
          : undefined,
      uniformTitle:
        currentInvoiceType === 'uniform-number' || currentInvoiceType === 'hardcopy-uniform-number'
          ? uniformTitleRef.current?.input.value || ''
          : undefined,
      donationCode: currentInvoiceType === 'donation' ? currentSelectedCharity : undefined,
      postCode: currentInvoiceType === 'hardcopy-uniform-number' ? postCodeRef.current?.input.value || '' : undefined,
      address:
        currentInvoiceType === 'hardcopy-uniform-number'
          ? shippingAddress || addressRef.current?.input.value || ''
          : undefined,
    }

    localStorage.setItem(
      'kolable.cart.invoice',
      JSON.stringify({
        type: currentInvoiceType,
        option: currentInvoiceOption,
        value: currentValue,
      }),
    )

    onChange && onChange(currentValue)
  }

  const syncWithShipping = async () => {
    try {
      const cachedShipping = JSON.parse(localStorage.getItem('kolable.cart.shipping') || '') as ShippingProps

      nameRef.current?.setValue(cachedShipping?.name || '')
      phoneRef.current?.setValue(cachedShipping?.phone || '')
      addressRef.current?.setValue(cachedShipping?.address || '')

      handleChange({
        invoiceType: selectedType,
        invoiceOption: selectedOption,
        invoiceCharity: selectedCharity,
        shippingName: cachedShipping.name,
        shippingPhone: cachedShipping.phone,
        shippingAddress: cachedShipping.address,
      })
    } catch (error) {
      handleChange({
        invoiceType: selectedType,
        invoiceOption: selectedOption,
        invoiceCharity: selectedCharity,
      })
    }
  }

  return (
    <StyledWrapper>
      <StyledTitle>{formatMessage(checkoutMessages.form.label.invoice)}</StyledTitle>
      <StyledDescription className="mb-4">
        {enabledModules.invoice
          ? formatMessage(checkoutMessages.form.message.warningEmail)
          : formatMessage(checkoutMessages.form.message.warningHardcopy)}
      </StyledDescription>

      {shouldSameToShippingCheckboxDisplay && (
        <div className="mb-4">
          <Checkbox onChange={event => event.target.checked && syncWithShipping()}>
            {formatMessage(checkoutMessages.form.message.sameToShipping)}
          </Checkbox>
        </div>
      )}

      <div className="row">
        <div className="col-12 col-lg-3">
          <Form.Item
            label={formatMessage(checkoutMessages.form.label.name)}
            required
            validateStatus={isValidating && errorFields.includes('name') ? 'error' : undefined}
            help={errorFields.includes('name') && formatMessage(checkoutMessages.form.message.errorName)}
          >
            <Input
              ref={nameRef}
              placeholder={formatMessage(checkoutMessages.form.message.nameText)}
              defaultValue={value ? value.name : ''}
              onBlur={() => handleChange({})}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-lg-3">
          <Form.Item
            label={formatMessage(checkoutMessages.form.label.phone)}
            required
            validateStatus={isValidating && errorFields.includes('phone') ? 'error' : undefined}
            help={errorFields.includes('phone') && formatMessage(checkoutMessages.form.message.errorPhone)}
          >
            <Input
              ref={phoneRef}
              placeholder={formatMessage(checkoutMessages.form.message.phone)}
              defaultValue={value ? value.phone : ''}
              onBlur={() => handleChange({})}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-lg-6">
          <Form.Item
            label={formatMessage(checkoutMessages.form.label.email)}
            required
            validateStatus={isValidating && errorFields.includes('email') ? 'error' : undefined}
            help={errorFields.includes('email') && formatMessage(checkoutMessages.form.message.errorEmail)}
          >
            <Input
              ref={emailRef}
              placeholder={formatMessage(checkoutMessages.form.message.emailText)}
              defaultValue={value ? value.email : ''}
              onBlur={() => handleChange({})}
            />
          </Form.Item>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-lg-6">
          {enabledModules.invoice ? (
            <Select<InvoiceType | null>
              value={selectedType}
              onChange={v =>
                handleChange({
                  invoiceType: v,
                  invoiceOption: v === 'electronic' ? 'send-to-email' : null,
                })
              }
            >
              <Select.Option value="donation">{formatMessage(checkoutMessages.form.label.donateInvoice)}</Select.Option>
              <Select.Option value="electronic">
                {formatMessage(checkoutMessages.form.label.electronicInvoice)}
              </Select.Option>
              <Select.Option value="uniform-number">
                {formatMessage(checkoutMessages.form.label.uniformNumber)}
              </Select.Option>
            </Select>
          ) : (
            <Select<InvoiceType | null> value={selectedType} onChange={v => handleChange({ invoiceType: v })}>
              <Select.Option value="hardcopy">
                {formatMessage(checkoutMessages.form.label.hardcopyInvoice)}
              </Select.Option>
              <Select.Option value="hardcopy-uniform-number">
                {formatMessage(checkoutMessages.form.label.hardcopyUniformNumberInvoice)}
              </Select.Option>
            </Select>
          )}
        </div>
        <div className="col-12 col-lg-6">
          {selectedType === 'donation' && (
            <Select<string> value={selectedCharity} onChange={v => handleChange({ invoiceCharity: v })}>
              <Select.Option value="5380">5380 社團法人台灣失智症協會</Select.Option>
              <Select.Option value="8957282">8957282 財團法人流浪動物之家基金會</Select.Option>
              <Select.Option value="25885">25885 財團法人伊甸社會福利基金會</Select.Option>
            </Select>
          )}

          {selectedType === 'electronic' && (
            <Select<InvoiceOption | null> value={selectedOption} onChange={v => handleChange({ invoiceOption: v })}>
              <Select.Option value="send-to-email">
                {formatMessage(checkoutMessages.form.label.sendToEmail)}
              </Select.Option>
              <Select.Option value="use-phone-bar-code">
                {formatMessage(checkoutMessages.form.label.usePhoneBarCode)}
              </Select.Option>
              <Select.Option value="citizen-digital-certificate">
                {formatMessage(checkoutMessages.form.label.citizenCode)}
              </Select.Option>
            </Select>
          )}
        </div>
      </div>

      {selectedOption === 'use-phone-bar-code' && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.form.label.phoneBarCode)}
              required
              validateStatus={isValidating && errorFields.includes('phoneBarCode') ? 'error' : undefined}
              help={formatMessage(checkoutMessages.form.message.phoneBarCodeText)}
            >
              <Input
                ref={phoneBarCodeRef}
                defaultValue={value ? value.phoneBarCode : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {selectedOption === 'citizen-digital-certificate' && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.form.label.citizenCode)}
              required
              validateStatus={isValidating && errorFields.includes('citizenCode') ? 'error' : undefined}
              help={formatMessage(checkoutMessages.form.message.citizenCodeText)}
            >
              <Input
                ref={citizenCodeRef}
                defaultValue={value ? value.citizenCode : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
        </div>
      )}

      {(selectedType === 'uniform-number' || selectedType === 'hardcopy-uniform-number') && (
        <div className="row">
          <div className="col-12 col-lg-6">
            <Form.Item
              label={formatMessage(checkoutMessages.form.label.uniformNumber)}
              required
              validateStatus={isValidating && errorFields.includes('uniformNumber') ? 'error' : undefined}
            >
              <Input
                ref={uniformNumberRef}
                placeholder={formatMessage(checkoutMessages.form.message.uniformNumberText)}
                defaultValue={value ? value.uniformNumber : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
          <div className="col-12 col-lg-6">
            <Form.Item
              label={formatMessage(checkoutMessages.form.label.uniformTitle)}
              required
              validateStatus={isValidating && errorFields.includes('uniformTitle') ? 'error' : undefined}
            >
              <Input
                ref={uniformTitleRef}
                placeholder={formatMessage(checkoutMessages.form.message.uniformTitleText)}
                defaultValue={value ? value.uniformTitle : undefined}
                onBlur={() => handleChange({})}
              />
            </Form.Item>
          </div>
          <div className="col-12">
            {selectedType === 'uniform-number' && (
              <StyledRemark>{formatMessage(checkoutMessages.form.message.uniformNumberRemark)}</StyledRemark>
            )}
          </div>
        </div>
      )}

      {selectedType === 'hardcopy-uniform-number' && (
        <div className="row">
          <div className="col-12">
            <Form.Item
              label={formatMessage(checkoutMessages.form.label.receiverAddress)}
              required
              validateStatus={
                isValidating && (errorFields.includes('post') || errorFields.includes('address')) ? 'error' : undefined
              }
            >
              <div className="row no-gutters">
                <div className="col-4 pr-3">
                  <Input
                    ref={postCodeRef}
                    placeholder={formatMessage(checkoutMessages.form.label.postCode)}
                    defaultValue={value ? value.postCode : undefined}
                    onBlur={() => handleChange({})}
                  />
                </div>
                <div className="col-8">
                  <Input
                    ref={addressRef}
                    placeholder={formatMessage(checkoutMessages.form.label.receiverAddress)}
                    defaultValue={value ? value.address : undefined}
                    onBlur={() => handleChange({})}
                  />
                </div>
              </div>
            </Form.Item>
          </div>
        </div>
      )}
    </StyledWrapper>
  )
}

export default InvoiceInput

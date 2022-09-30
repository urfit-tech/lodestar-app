import { Button, Checkbox, Form, Input, Radio, Select } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { camelCase } from 'lodash'
import { CommonTitleMixin } from 'lodestar-app-element/src/components/common/index'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { cities, districts, useTwZipCode } from 'use-tw-zipcode'
import { checkoutMessages } from '../../helpers/translation'
import { ShippingOptionProps, ShippingProps } from '../../types/checkout'

export const csvShippingMethods = ['seven-eleven', 'family-mart', 'ok-mart', 'hi-life']

const StyledTitle = styled.div`
  ${CommonTitleMixin}
`

const GiftPlanDeliverNoticeBlock = styled.div`
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledPriceTag = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: ${props => props.theme['@primary-color']};
`

const StyledCheckBox = styled(Checkbox)`
  margin-top: 24px;
  font-size: 16px;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

type cvsOptionsProps = {
  cvsType: string
  storeId: string
  storeName: string
  storeAddress: string
}

export const validateShipping: (shipping: ShippingProps) => boolean = shipping => {
  return [shipping.name, shipping.phone, shipping.address].every(value => !!value)
}

const ShippingInput: React.VFC<{
  value?: ShippingProps
  onChange?: (value: ShippingProps) => void
  isValidating?: boolean
  shippingMethods?: ShippingOptionProps[]
  isGiftPlanDeliverable?: boolean
}> = ({ value, onChange, isValidating, shippingMethods, isGiftPlanDeliverable }) => {
  const { formatMessage } = useIntl()
  const { currencyId: appCurrencyId, settings } = useApp()
  const { city, district, zipCode, handleCityChange, handleDistrictChange } = useTwZipCode()
  const [isCitySelectorChange, setIsCitySelectorChange] = useState(false)
  const [isOutsideTaiwanIsland, setIsOutsideTaiwanIsland] = useState(value?.isOutsideTaiwanIsland === 'true')

  const nameRef = useRef<Input | null>(null)
  const phoneRef = useRef<Input | null>(null)
  const addressRef = useRef<Input | null>(null)
  const specificationRef = useRef<TextArea | null>(null)

  const cachedCvsOptions = localStorage.getItem('kolable.cart.shippingOptions')
  const [currentCvsOptions, setCurrentCvsOptions] = useState<{ [key: string]: cvsOptionsProps }>(
    cachedCvsOptions ? JSON.parse(cachedCvsOptions) : {},
  )

  const handleChange = (key: keyof ShippingProps, inputValue: string) => {
    let newShippingOption = {}

    if (key === 'shippingMethod' && currentCvsOptions[inputValue]) {
      const { storeId, storeName, storeAddress } = currentCvsOptions[inputValue]
      newShippingOption = {
        storeId,
        storeName,
        address: storeAddress,
      }
      localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newShippingOption))
    }

    const newValue: ShippingProps = {
      name: value?.name || '',
      phone: value?.phone || '',
      zipCode: value?.zipCode || '',
      city: value?.city || '',
      district: value?.district || '',
      address: value?.address || '',
      isOutsideTaiwanIsland: value?.isOutsideTaiwanIsland || 'false',
      shippingMethod: value?.shippingMethod || 'home-delivery',
      specification: value?.specification || '',
      storeId: value?.storeId || '',
      storeName: value?.storeName || '',
      ...newShippingOption,
    }
    newValue[key] = inputValue

    if (!newValue['city']) {
      newValue['city'] = city
    }

    if (!newValue['district']) {
      newValue['district'] = district
    }

    if (key === 'city') {
      newValue['district'] = districts[inputValue][0]
      handleDistrictChange(districts[inputValue][0])
    } else if (key === 'isOutsideTaiwanIsland' && inputValue === 'true') {
      newValue['shippingMethod'] = ''
    }

    localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue))
    onChange && onChange(newValue)
  }

  ;(window as any).callCvsPopupCallback = (params: cvsOptionsProps) => {
    const { cvsType, storeId, storeName, storeAddress } = params

    if (value?.shippingMethod) {
      const newCvsOptions = {
        ...currentCvsOptions,
        [cvsType || value.shippingMethod]: params,
      }
      setCurrentCvsOptions(newCvsOptions)
      localStorage.setItem('kolable.cart.shippingOptions', JSON.stringify(newCvsOptions))
    }

    const newValue = {
      name: value?.name || '',
      phone: value?.phone || '',
      specification: value?.specification || '',
      ...value,
      storeId,
      storeName,
      address: storeAddress || '',
      shippingMethod: cvsType || value?.shippingMethod || 'home-delivery',
    }
    localStorage.setItem('kolable.cart.shipping', JSON.stringify(newValue))
    onChange && onChange(newValue)
  }

  const handleStoreSelect = () => {
    if (!process.env.REACT_APP_API_BASE_ROOT) {
      return
    }
    let apiUrl: string
    try {
      apiUrl = new URL(process.env.REACT_APP_API_BASE_ROOT).href
    } catch {
      apiUrl = window.location.origin + process.env.REACT_APP_API_BASE_ROOT
    }
    const cvsSelectionBackUrl = encodeURIComponent(
      `${apiUrl}/payment/cvs-proxy/${value?.shippingMethod}?callbackUrl=${window.location.origin}/cvs`,
    )
    let cvsSelectionUrl

    switch (value?.shippingMethod) {
      case 'seven-eleven':
        cvsSelectionUrl = `https://emap.pcsc.com.tw/ecmap/default.aspx?eshopparid=935&eshopid=001&eshoppwd=presco123&tempvar=&sid=1&storecategory=3&showtype=1&storeid=&url=${cvsSelectionBackUrl}`
        break
      case 'ok-mart':
        cvsSelectionUrl = `https://ecservice.okmart.com.tw/ECMapInquiry/ShowStore?userip=&cvsid=1592042616368&cvstemp=${cvsSelectionBackUrl}`
        break
      case 'hi-life':
      case 'family-mart':
        cvsSelectionUrl = `https://map.ezship.com.tw/ezship_map_web_2014.jsp?rtURL=${cvsSelectionBackUrl}`
        break
      default:
        break
    }
    window.open(cvsSelectionUrl)
  }

  return (
    <div>
      <StyledTitle className="mb-4">{formatMessage(checkoutMessages.shipping.shippingInput)}</StyledTitle>

      {isGiftPlanDeliverable && (
        <GiftPlanDeliverNoticeBlock className="mb-4">
          <p>{formatMessage(checkoutMessages.shipping.giftPlanDeliverNotice1)}</p>
          <p>{formatMessage(checkoutMessages.shipping.giftPlanDeliverNotice2)}</p>
          <p>{formatMessage(checkoutMessages.shipping.giftPlanDeliverNotice3)}</p>
        </GiftPlanDeliverNoticeBlock>
      )}

      {shippingMethods && (
        <Form.Item required label={formatMessage(checkoutMessages.shipping.shippingMethod)}>
          <Radio.Group
            value={value?.shippingMethod || 'home-delivery'}
            onChange={event => handleChange('shippingMethod', event.target.value)}
          >
            {shippingMethods
              .filter(shippingMethod => shippingMethod.enabled)
              .map(shippingMethod => {
                const formattedShippingMethod =
                  checkoutMessages.shipping[camelCase(shippingMethod.id) as keyof typeof checkoutMessages.shipping]
                return (
                  <Radio key={shippingMethod.id} value={shippingMethod.id} className="d-block mt-4">
                    <span className="align-middle mr-2">{formatMessage(formattedShippingMethod)}</span>
                    <StyledPriceTag className="mr-2">
                      <PriceLabel listPrice={shippingMethod.fee} currencyId={appCurrencyId} />
                    </StyledPriceTag>
                    {csvShippingMethods.includes(shippingMethod.id) && value?.shippingMethod === shippingMethod.id && (
                      <>
                        <span className="mr-2">
                          <Button onClick={() => handleStoreSelect()}>
                            {formatMessage(checkoutMessages.shipping.selectStore)}
                          </Button>
                        </span>

                        {currentCvsOptions[value?.shippingMethod] && (
                          <span>{currentCvsOptions[value?.shippingMethod].storeName}</span>
                        )}
                      </>
                    )}
                  </Radio>
                )
              })}
          </Radio.Group>
        </Form.Item>
      )}

      <div className="row">
        <div className="col-12 col-lg-6">
          <Form.Item
            required
            label={formatMessage(checkoutMessages.form.label.receiverName)}
            validateStatus={isValidating && nameRef.current?.input.value === '' ? 'error' : undefined}
          >
            <Input
              ref={nameRef}
              placeholder={formatMessage(checkoutMessages.form.message.nameText)}
              defaultValue={value?.name || ''}
              onBlur={event => handleChange('name', event.target.value)}
            />
          </Form.Item>
        </div>
        <div className="col-12 col-lg-6">
          <Form.Item
            required
            label={formatMessage(checkoutMessages.form.label.receiverPhone)}
            validateStatus={isValidating && phoneRef.current?.input.value === '' ? 'error' : undefined}
          >
            <Input
              ref={phoneRef}
              placeholder={formatMessage(checkoutMessages.form.message.phone)}
              defaultValue={value?.phone || ''}
              onBlur={event => handleChange('phone', event.target.value)}
            />
          </Form.Item>
        </div>
      </div>

      {!!Number(settings['checkout.taiwan_shipping_selector']) ? (
        <Form.Item
          required
          label={formatMessage(checkoutMessages.form.label.receiverAddress)}
          validateStatus={isValidating && addressRef.current?.input.value === '' ? 'error' : undefined}
        >
          <div className="row">
            <div className="col-12 col-lg-2">
              <Select
                className="col-12"
                disabled
                value={isCitySelectorChange || !value?.zipCode ? zipCode : value?.zipCode}
              ></Select>
            </div>
            <div className="col-12 col-lg-2">
              <Select
                className="col-12"
                value={value?.city || city}
                onChange={(v: string) => {
                  handleChange('city', v)
                  handleCityChange(v)
                  setIsCitySelectorChange(true)
                }}
                onBlur={() => handleChange('zipCode', zipCode)}
                disabled={isOutsideTaiwanIsland}
              >
                {cities
                  ?.filter(city => ['澎湖縣', '金門縣', '連江縣'].includes(city) === false)
                  .map(city => {
                    return <Select.Option key={city}>{city}</Select.Option>
                  })}
              </Select>
            </div>
            <div className="col-12 col-lg-2">
              <Select
                className="col-12"
                value={value?.district || district}
                onChange={(w: string) => {
                  handleChange('district', w)
                  handleDistrictChange(w)
                  setIsCitySelectorChange(true)
                }}
                onBlur={() => handleChange('zipCode', zipCode)}
                disabled={isOutsideTaiwanIsland}
              >
                {isCitySelectorChange || value?.city
                  ? districts[value?.city || '']
                      .filter(
                        district =>
                          ['釣魚台列嶼', '綠島鄉', '蘭嶼鄉', '東沙群島', '南沙群島'].includes(district) === false,
                      )
                      .map(district => {
                        return <Select.Option key={district}>{district}</Select.Option>
                      })
                  : districts[city]
                      .filter(
                        district =>
                          ['釣魚台列嶼', '綠島鄉', '蘭嶼鄉', '東沙群島', '南沙群島'].includes(district) === false,
                      )
                      .map(district => {
                        return <Select.Option key={district}>{district}</Select.Option>
                      })}
              </Select>
            </div>
            <div className="col-12 col-lg-6">
              <Input
                ref={addressRef}
                placeholder={formatMessage(checkoutMessages.form.message.addressText)}
                defaultValue={value?.address || ''}
                value={value?.address}
                onBlur={event => handleChange('address', event.target.value)}
                onChange={event => handleChange('address', event.target.value)}
                disabled={isOutsideTaiwanIsland}
              />
            </div>
          </div>
          <StyledCheckBox
            defaultChecked={value?.isOutsideTaiwanIsland === 'true'}
            onChange={() => {
              setIsOutsideTaiwanIsland(!isOutsideTaiwanIsland)
              handleChange('isOutsideTaiwanIsland', (!isOutsideTaiwanIsland).toString())
            }}
          >
            {formatMessage(checkoutMessages.shipping.outsideTaiwanIslandNoShipping)}
          </StyledCheckBox>
        </Form.Item>
      ) : (
        <Form.Item
          required
          label={formatMessage(checkoutMessages.form.label.receiverAddress)}
          validateStatus={isValidating && addressRef.current?.input.value === '' ? 'error' : undefined}
        >
          <Input
            ref={addressRef}
            placeholder={formatMessage(checkoutMessages.form.message.addressText)}
            defaultValue={value?.address || ''}
            value={value?.address}
            onBlur={event => handleChange('address', event.target.value)}
            onChange={event => handleChange('address', event.target.value)}
          />
        </Form.Item>
      )}

      <Form.Item label={formatMessage(checkoutMessages.shipping.specification)}>
        <Input.TextArea
          ref={specificationRef}
          rows={5}
          defaultValue={value?.specification || ''}
          onBlur={event => handleChange('specification', event.target.value)}
        />
      </Form.Item>
    </div>
  )
}

export default ShippingInput

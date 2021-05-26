import { Button } from '@chakra-ui/react'
import { Dropdown, Icon, Menu, Select } from 'antd'
import { max, min } from 'lodash'
import { repeat } from 'ramda'
import React, { useContext, useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import CartContext from '../../contexts/CartContext'
import { desktopViewMixin } from '../../helpers'
import { commonMessages, voucherMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { MerchandiseProps } from '../../types/merchandise'
import { CommonTitleMixin } from '../common'
import CountDownTimeBlock from '../common/CountDownTimeBlock'
import { CustomRatioImage } from '../common/Image'
import PriceLabel from '../common/PriceLabel'
import QuantityInput from '../common/QuantityInput'
import { BREAK_POINT } from '../common/Responsive'
import ShippingMethodLabel from '../common/ShippingMethodLabel'
import { BraftContent } from '../common/StyledBraftEditor'
import MerchandisePaymentButton from './MerchandisePaymentButton'

const messages = defineMessages({
  specification: { id: 'product.merchandise.ui.specification', defaultMessage: '規格' },
  fare: { id: 'product.merchandise.ui.fare', defaultMessage: '運費' },
  shippingInDays: { id: 'merchandise.label.shippingInDays', defaultMessage: '到貨約 {days} 天' },
  remain: { id: 'product.merchandise.ui.remain', defaultMessage: '剩餘' },
})

const StyledThumbnailTrack = styled.div<{ page: number }>`
  overflow: hidden;

  > div {
    white-space: nowrap;
    transition: transform 0.2s ease-in-out;
    transform: translateX(calc(${props => (props.page < 2 ? 0 : -2 + props.page)} * -25%));
  }

  ${props =>
    desktopViewMixin(css`
      > div {
        transform: translateX(calc(${props.page < 3 ? 0 : -3 + props.page} * -20%));
      }
    `)}
`
const StyledThumbnailBlock = styled.div`
  display: inline-block;
  padding: 0.5rem;
  width: 25%;

  ${desktopViewMixin(css`
    width: 20%;
  `)}
`
const StyledTag = styled.span`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  line-height: 1.57;
  letter-spacing: 0.4px;
`
const StyledTitle = styled.div`
  margin-bottom: 0.75rem;
  ${CommonTitleMixin}
`
const StyledInfo = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
`
const StyledInfoText = styled.span`
  color: var(--gray-dark);
  font-size: 14px;
`
const StyledAbstract = styled.div`
  white-space: pre-wrap;
`
const StyledButton = styled(Button)`
  color: var(--gray-darker);
`
const StyledMenu = styled(Menu)`
  width: 15rem;
`
const StyledMenuItem = styled(Menu.Item)`
  .duration {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.6px;
    color: var(--gray-dark);
  }
`
const StyledButtonBlock = styled.div`
  @media (max-width: ${BREAK_POINT - 1}px) {
    padding: 0.75rem 2rem;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background: white;
  }
`
const StyledDescription = styled.div`
  padding-bottom: 4rem;

  ${desktopViewMixin(css`
    max-height: 18rem;
    padding-right: 1rem;
    padding-bottom: 0;
    overflow: auto;
  `)}
`

const MerchandiseBlock: React.VFC<{
  merchandise: MerchandiseProps
  withPaymentButton?: boolean
  showDescription?: boolean
}> = ({ merchandise, withPaymentButton, showDescription }) => {
  const { formatMessage } = useIntl()
  const { getCartProduct } = useContext(CartContext)
  const [imageIndex, setImageIndex] = useState(0)
  const [selectedSpec, setSelectedSpec] = useState(merchandise.specs[0])
  const [quantity, setQuantity] = useState(1)

  const inCartQuantity = getCartProduct?.(`MerchandiseSpec_${selectedSpec.id}`)?.options?.quantity || 0
  const remainQuantity = (selectedSpec.buyableQuantity || 0) - inCartQuantity

  return (
    <div className="row justify-content-between">
      <div className="col-12 col-lg-4 mb-5 mb-lg-0">
        {merchandise.images && merchandise.images.length > 0 ? (
          <>
            <CustomRatioImage
              width="100%"
              ratio={1}
              src={merchandise.images[imageIndex % merchandise.images.length]?.url || EmptyCover}
              className="mb-4"
              shape="rounded"
            />
            <StyledThumbnailTrack page={imageIndex}>
              <div>
                {repeat(
                  merchandise.images,
                  merchandise.images.length < 5 ? 1 : Math.ceil((imageIndex + 1) / merchandise.images.length) + 1,
                )
                  .flat()
                  .map((image, index) => (
                    <StyledThumbnailBlock key={`${image.url}_${index}`}>
                      <CustomRatioImage
                        width="100%"
                        ratio={1}
                        src={image.url}
                        shape="rounded"
                        className="cursor-pointer"
                        onClick={() => setImageIndex(index)}
                      />
                    </StyledThumbnailBlock>
                  ))}
              </div>
            </StyledThumbnailTrack>
          </>
        ) : (
          <CustomRatioImage width="100%" ratio={1} src={EmptyCover} className="mb-4" shape="rounded" />
        )}
      </div>

      <div className="col-12 col-lg-7">
        <div className="mb-1">
          {merchandise.tags?.map(tag => (
            <Link key={tag} to={`/merchandises?tag=${tag}`} className="mr-2">
              <StyledTag key={tag}>#{tag}</StyledTag>
            </Link>
          ))}
        </div>
        <StyledTitle>{merchandise.title}</StyledTitle>
        <div className="mb-4">
          <PriceLabel
            variant="inline"
            listPrice={selectedSpec.listPrice}
            salePrice={(merchandise.soldAt?.getTime() || 0) > Date.now() ? selectedSpec.salePrice : undefined}
          />
        </div>

        {merchandise.isCountdownTimerVisible && merchandise.soldAt && merchandise.soldAt.getTime() > Date.now() && (
          <div className="mb-3">
            <CountDownTimeBlock expiredAt={merchandise.soldAt} icon />
          </div>
        )}

        {merchandise.abstract && (
          <StyledAbstract className="mb-4">
            <div>{merchandise.abstract}</div>
          </StyledAbstract>
        )}

        {merchandise.isPhysical && merchandise.memberShop?.shippingMethods && (
          <StyledInfo className="mb-4">
            <div className="mr-4 d-inline-block">{formatMessage(messages.fare)}</div>
            <Dropdown
              trigger={['click']}
              overlay={
                <StyledMenu>
                  {merchandise.memberShop.shippingMethods.map(shippingMethod => (
                    <StyledMenuItem key={shippingMethod.id} className="d-flex justify-content-between">
                      <div className="d-flex flex-column">
                        <span>
                          <ShippingMethodLabel shippingMethodId={shippingMethod.id} />
                        </span>
                        <StyledInfoText className="duration">
                          {formatMessage(messages.shippingInDays, { days: shippingMethod.days })}
                        </StyledInfoText>
                      </div>
                      <span>
                        <PriceLabel listPrice={shippingMethod.fee} />
                      </span>
                    </StyledMenuItem>
                  ))}
                </StyledMenu>
              }
            >
              <StyledButton variant="link">
                <span>
                  <PriceLabel
                    listPrice={
                      min(merchandise.memberShop.shippingMethods.map(shippingMethod => shippingMethod.fee)) || 0
                    }
                  />
                  {' ~ '}
                  <PriceLabel
                    listPrice={
                      max(merchandise.memberShop.shippingMethods.map(shippingMethod => shippingMethod.fee)) || 0
                    }
                  />
                </span>
                <Icon type="down" />
              </StyledButton>
            </Dropdown>
          </StyledInfo>
        )}

        <StyledInfo className="d-flex align-items-center mb-4">
          <div className="d-inline-block mr-4 flex-shrink-0">{formatMessage(messages.specification)}</div>
          <div className="flex-grow-1">
            <Select<string>
              value={selectedSpec.id}
              onChange={value => {
                const target = merchandise.specs.find(spec => spec.id === value)
                target && setSelectedSpec(target)
              }}
              style={{ width: '100%' }}
            >
              {merchandise.specs.map(spec => (
                <Select.Option key={spec.id} value={spec.id}>
                  {spec.title}
                </Select.Option>
              ))}
            </Select>
          </div>
        </StyledInfo>

        {merchandise.isPhysical && !merchandise.isCustomized && (
          <StyledInfo className="d-flex align-items-center mb-4">
            <div className="mr-4 d-inline-block">{formatMessage(voucherMessages.content.amount)}</div>
            <QuantityInput value={quantity} min={0} max={remainQuantity} onChange={value => setQuantity(value || 0)} />
            <span className="ml-3">
              {formatMessage(messages.remain)} {remainQuantity}
            </span>
          </StyledInfo>
        )}

        {withPaymentButton ? (
          <MerchandisePaymentButton merchandise={merchandise} merchandiseSpec={selectedSpec} quantity={quantity} />
        ) : (
          <StyledButtonBlock>
            <Link to={`/merchandises/${merchandise.id}`}>
              <StyledButton colorScheme="primary">{formatMessage(commonMessages.button.purchase)}</StyledButton>
            </Link>
          </StyledButtonBlock>
        )}

        {showDescription && (
          <StyledDescription>
            <BraftContent>{merchandise.description}</BraftContent>
          </StyledDescription>
        )}
      </div>
    </div>
  )
}

export default MerchandiseBlock

import { Icon } from '@chakra-ui/icons'
import { Modal } from 'antd'
import { ModalProps } from 'antd/lib/modal'
import BraftEditor, { EditorState } from 'braft-editor'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { ReactComponent as CheckIcon } from '../../images/check.svg'
import { CouponProps } from '../../types/checkout'
import ProductItem from '../common/ProductItem'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'

const messages = defineMessages({
  couponPlanCode: { id: 'promotion.label.couponPlanCode', defaultMessage: '折扣代碼' },
  rules: { id: 'promotion.label.rules', defaultMessage: '使用規則' },
  constraints: { id: 'promotion.text.constraints', defaultMessage: '消費滿 {total} 折抵 {discount}' },
  directly: { id: 'promotion.text.directly', defaultMessage: '直接折抵 {discount}' },
  discountTarget: { id: 'promotion.text.discountTarget', defaultMessage: '折抵項目' },
  description: { id: 'promotion.text.description', defaultMessage: '使用描述' },

  allScope: { id: 'common.product.allScope', defaultMessage: '全站折抵' },
  allProgramPlan: { id: 'common.product.allProgramPlan', defaultMessage: '全部課程方案' },
  allActivityTicket: { id: 'common.product.allActivityTicket', defaultMessage: '全部活動' },
  allPodcastProgram: { id: 'common.product.allPodcastProgram', defaultMessage: '全部廣播' },
  allPodcastPlan: { id: 'common.product.allPodcastPlan', defaultMessage: '全部廣播訂閱頻道' },
  allAppointmentPlan: { id: 'common.product.allAppointmentPlan', defaultMessage: '全部預約' },
  allMerchandise: { id: 'common.product.allMerchandise', defaultMessage: '全部商品' },
  allProjectPlan: { id: 'common.product.allProjectPlan', defaultMessage: '全部專案' },
  allProgramPackagePlan: { id: 'common.product.allProgramPackagePlan', defaultMessage: '全部課程組合' },
  otherSpecificProduct: { id: 'common.product.otherSpecificProduct', defaultMessage: '其他特定項目' },
})

const StyledModal = styled(Modal)`
  color: ${props => props.theme['@normal-color']};
  .ant-modal-header {
    border-bottom: 0px solid #e8e8e8;
    padding: 24px 24px;
  }
  .ant-modal-title {
    font-weight: bold;
  }
  .ant-modal-body {
    font-size: 14px;
    line-height: 1.57;
    letter-spacing: 0.18px;
    color: var(--gray-darker);
  }
  .ant-modal-close-x {
    color: #9b9b9b;
  }
`
const StyledTitle = styled.div`
  margin-bottom: 0.75rem;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const CouponDescriptionModal: React.VFC<
  ModalProps & {
    coupon: CouponProps
  }
> = ({ coupon, ...modalProps }) => {
  const { formatMessage } = useIntl()
  const withDescription = !(
    BraftEditor.createEditorState(coupon.couponCode.couponPlan.description || '') as EditorState
  ).isEmpty()
  return (
    <StyledModal title={null} footer={null} {...modalProps}>
      <StyledTitle>{coupon.couponCode.couponPlan.title}</StyledTitle>
      <div className="mb-4">
        {/* {currentUserRole === 'app-owner' && `${formatMessage(messages.couponPlanCode)} ${coupon.couponCode.code}`} */}
      </div>

      <StyledTitle>{formatMessage(messages.rules)}</StyledTitle>
      <div className="mb-4">
        {coupon.couponCode.couponPlan.constraint
          ? formatMessage(messages.constraints, {
              total: <PriceLabel listPrice={coupon.couponCode.couponPlan.constraint} />,
              discount:
                coupon.couponCode.couponPlan.type === 'cash' ? (
                  <PriceLabel listPrice={coupon.couponCode.couponPlan.amount} />
                ) : (
                  `${coupon.couponCode.couponPlan.amount}%`
                ),
            })
          : formatMessage(messages.directly, {
              discount:
                coupon.couponCode.couponPlan.type === 'cash' ? (
                  <PriceLabel listPrice={coupon.couponCode.couponPlan.amount} />
                ) : (
                  `${coupon.couponCode.couponPlan.amount}%`
                ),
            })}
      </div>

      <StyledTitle>{formatMessage(messages.discountTarget)}</StyledTitle>
      <div className="mb-4">
        {coupon.couponCode.couponPlan.scope === null && <div>{formatMessage(messages.allScope)}</div>}
        {coupon.couponCode.couponPlan.scope?.includes('ProgramPlan') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allProgramPlan)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('ActivityTicket') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allActivityTicket)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('PodcastProgram') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allPodcastProgram)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('PodcastPlan') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allPodcastPlan)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('AppointmentPlan') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allAppointmentPlan)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('MerchandiseSpec') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allMerchandise)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('ProjectPlan') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allProjectPlan)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.scope?.includes('ProgramPackagePlan') && (
          <div className="mb-2">
            <Icon as={CheckIcon} className="mr-2" />
            <span>{formatMessage(messages.allProgramPackagePlan)}</span>
          </div>
        )}
        {coupon.couponCode.couponPlan.productIds && coupon.couponCode.couponPlan.productIds.length > 0 && (
          <>
            <div className="mb-2">
              <Icon as={CheckIcon} className="mr-2" />
              <span>{formatMessage(messages.otherSpecificProduct)}</span>
            </div>
            <div className="pl-4">
              {coupon.couponCode.couponPlan.productIds.map(productId => (
                <ProductItem key={productId} id={productId} variant="coupon-product" />
              ))}
            </div>
          </>
        )}
      </div>

      {withDescription && (
        <>
          <StyledTitle>{formatMessage(messages.description)}</StyledTitle>
          <BraftContent>{coupon.couponCode.couponPlan.description}</BraftContent>
        </>
      )}
    </StyledModal>
  )
}

export default CouponDescriptionModal

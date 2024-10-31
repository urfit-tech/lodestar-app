import { InvoiceProps, ShippingProps } from 'lodestar-app-element/src/types/checkout'
import { ShippingMethodProps } from 'lodestar-app-element/src/types/merchandise'

export type MultiPeriodProductDetail = {
  startedAt: Date
  endedAt: Date
  quantity: number
  discountId?: string
}

export type CheckoutPeriodsModalProps = {
  defaultProductId: string
  defaultProductDetails: Array<MultiPeriodProductDetail>
  isCheckOutModalOpen: boolean
  onCheckOutModalOpen: () => void
  onCheckOutModalClose: () => void
  warningText?: string
  shippingMethods?: ShippingMethodProps[]
  isModalDisable?: boolean
  isFieldsValidate?: (fieldsValue: { invoice: InvoiceProps; shipping: ShippingProps }) => {
    isValidInvoice: boolean
    isValidShipping: boolean
  }
  renderInvoice?: (props: {
    invoice: InvoiceProps
    setInvoice: React.Dispatch<React.SetStateAction<InvoiceProps>>
    isValidating: boolean
  }) => React.ReactNode
  renderTerms?: () => React.ReactElement
  setIsModalDisable?: (disable: boolean) => void
  setIsOrderCheckLoading?: (isOrderCheckLoading: boolean) => void
}

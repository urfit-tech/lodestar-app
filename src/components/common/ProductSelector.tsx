import { Spinner } from '@chakra-ui/react'
import { TreeSelect } from 'antd'
import { keys } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'

type ProductSelectorProps = {
  loading?: boolean
  error?: Error
  products: {
    id: string
    title: string
    type: string
  }[]
  value?: string[]
  onChange?: (value: string[]) => void
}
const ProductSelector: React.VFC<ProductSelectorProps> = ({ loading, error, products, value, onChange }) => {
  const { formatMessage } = useIntl()
  const ProductTypeLabel: Record<
    'Program' | 'ProgramPlan' | 'ProgramContent' | 'Card' | 'ActivityTicket' | 'Merchandise',
    string
  > = {
    Program: formatMessage(commonMessages.ui.allPrograms),
    ProgramPlan: formatMessage(commonMessages.ui.allSubscriptions),
    ProgramContent: formatMessage(commonMessages.ui.allCourseContents),
    Card: formatMessage(commonMessages.ui.allMemberCards),
    ActivityTicket: formatMessage(commonMessages.ui.allActivities),
    Merchandise: formatMessage(commonMessages.ui.allMerchandise),
  }

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <div>{formatMessage(commonMessages.status.loadingProductError)}</div>
  }

  const treeData = keys(ProductTypeLabel)
    .filter(
      productType => ProductTypeLabel[productType] && products.filter(product => product.type === productType).length,
    )
    .map(productType => ({
      title: ProductTypeLabel[productType],
      value: productType,
      key: productType,
      children: products
        .filter(product => product.type === productType)
        .map(product => {
          return {
            title: product.title,
            value: product.id,
            key: product.id,
          }
        }),
    }))

  return (
    <TreeSelect
      value={value}
      onChange={onChange}
      treeData={treeData}
      treeCheckable
      showCheckedStrategy="SHOW_PARENT"
      searchPlaceholder={formatMessage(commonMessages.form.placeholder.search)}
      treeNodeFilterProp="title"
      dropdownStyle={{
        maxHeight: '30vh',
      }}
    />
  )
}

export default ProductSelector

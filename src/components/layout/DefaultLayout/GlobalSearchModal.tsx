import { useQuery } from '@apollo/react-hooks'
import { Button, Checkbox, Input } from '@chakra-ui/react'
import { ApolloError } from 'apollo-client'
import decamelize from 'decamelize'
import gql from 'graphql-tag'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { ProductType } from 'lodestar-app-element/src/types/product'
import React, { useRef, useState } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import { commonMessages } from '../../../helpers/translation'
import { SearchBlock } from './DefaultLayout.styled'

const GlobalSearchModal: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const [isOpen, setIsModalOpen] = useState(true)
  const searchInputRef = useRef()
  const searchFilterRef = useRef()

  return (
    <CommonModal title="" isOpen={isOpen} onClose={() => {}}>
      <SearchBlock>
        <div className="d-flex">
          <Input
            className="flex-grow-1"
            placeholder={formatMessage(defineMessage({ id: 'common.ui.enterKeyword', defaultMessage: '輸入關鍵字' }))}
          />
          <Button className="flex-shrink-0" colorScheme="primary" onClick={() => {}}>
            {formatMessage(commonMessages.ui.search)}
          </Button>
        </div>
        <GlobalSearchFilter />
      </SearchBlock>
    </CommonModal>
  )
}

const GlobalSearchFilter: React.VFC<{
  productType?: ProductType
  onChange?: () => void
}> = ({ productType, onChange }) => {
  const { formatMessage } = useIntl()
  const data = useProductFilterOptionsGet(productType)

  return (
    <div>
      <div>
        <h3>{formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選分類' }))}</h3>
        <div>
          <Checkbox></Checkbox>
          <Button colorScheme="primary" variant="outline">
            categroy
          </Button>
        </div>
      </div>
      <div>
        <h3>{formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選條件' }))}</h3>
      </div>
      <div>
        <h3>{formatMessage(defineMessage({ id: 'common.ui.advancedCondition', defaultMessage: '進階條件' }))}</h3>

        <div>
          <h4>{formatMessage(defineMessage({ id: 'common.ui.duration', defaultMessage: '時長' }))}</h4>
          <Button colorScheme="primary" variant="outline">
            categroy
          </Button>
        </div>
        <div>
          <h4>{formatMessage(defineMessage({ id: 'common.ui.score', defaultMessage: '評分' }))}</h4>
          <Button colorScheme="primary" variant="outline">
            &gt; 4.8
          </Button>
          <Button colorScheme="primary" variant="outline">
            &gt; 4.5
          </Button>
          <Button colorScheme="primary" variant="outline">
            &gt; 4.0
          </Button>
        </div>
      </div>
    </div>
  )
}

const useProductFilterOptionsGet: (productType?: ProductType) => {
  isLoading: boolean
  error?: ApolloError
} = productType => {
  const decamelizeProductType = decamelize(productType || 'Program')

  const { loading, data, error } = useQuery(gql`
    query GET_PRODUCT_FILTER_OPTIONS {
      ${decamelizeProductType}_category(where: {category: {name: {_is_null: false}}}, distinct_on: category_id) {
        id
        category {
          id
          name
        }
      }
      ${decamelizeProductType}_tag {
        id
        tag_name
      }
    }
  `)

  return {
    isLoading: loading,
    error,
  }
}

export default GlobalSearchModal

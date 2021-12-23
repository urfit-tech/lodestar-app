import { HStack, useRadioGroup } from '@chakra-ui/react'
import { flatten, uniqBy } from 'ramda'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, useQueryParam } from 'use-query-params'
import { commonMessages } from '../../helpers/translation'
import { MerchandiseBriefProps } from '../../types/merchandise'
import MerchandiseCard from '../merchandise/MerchandiseCard'
import RadioCard from '../RadioCard'

const StyledCategoryList = styled.ul`
  list-style-type: none;

  li {
    cursor: pointer;
    transition: 0.3s;
    &.active {
      color: ${props => props.theme['@primary-color']};
    }
    &:hover {
      color: ${props => props.theme['@primary-color']};
    }
  }
`

const MerchandiseCollectionBlock: React.VFC<{ merchandises: MerchandiseBriefProps[] }> = ({ merchandises }) => {
  const { formatMessage } = useIntl()
  const [isPhysical] = useQueryParam('isPhysical', BooleanParam)
  const [selectCategory, setSelectCategory] = useState<string | null>(null)
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const filteredMerchandises = merchandises.filter(merchandise =>
    selectCategory
      ? selectCategory === 'isPhysical'
        ? merchandise.isPhysical === true
        : merchandise.isPhysical === false
      : merchandise,
  )

  const merchandiseCategories = uniqBy(
    category => category.id,
    flatten(filteredMerchandises.map(merchandise => merchandise.categories || [])),
  )

  const options = [
    formatMessage(commonMessages.ui.all),
    formatMessage(commonMessages.ui.physical),
    formatMessage(commonMessages.ui.virtual),
  ]

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'isPhysical',
    defaultValue:
      isPhysical === undefined
        ? formatMessage(commonMessages.ui.all)
        : isPhysical
        ? formatMessage(commonMessages.ui.physical)
        : formatMessage(commonMessages.ui.virtual),
    onChange: v => {
      const url = new URL(window.location.href)
      if (v === formatMessage(commonMessages.ui.all)) {
        url.searchParams.delete('isPhysical')
        setSelectCategory(null)
      } else if (v === formatMessage(commonMessages.ui.physical)) {
        url.searchParams.set('isPhysical', '1')
        setSelectCategory('isPhysical')
      } else {
        url.searchParams.set('isPhysical', '0')
        setSelectCategory('virtual')
      }
      window.history.pushState({}, '', url.toString())
    },
  })

  const group = getRootProps()

  return (
    <div className="d-flex flex-wrap flex-lg-row-reverse">
      <div className="col-lg-4 col-12 mb-4 mb-lg-0">
        <HStack className="mb-4" {...group}>
          {options.map(value => {
            const radio = getRadioProps({ value })
            return (
              <RadioCard key={value} size="md" {...radio}>
                {value}
              </RadioCard>
            )
          })}
        </HStack>
        <StyledCategoryList>
          <li className={(categoryId === null ? 'active ' : '') + 'mb-2'} onClick={() => setCategoryId(null)}>
            {formatMessage(commonMessages.ui.allCategory)} ({filteredMerchandises.length})
          </li>
          {merchandiseCategories.map(merchandiseCategory => {
            const count = filteredMerchandises.filter(merchandise =>
              merchandise.categories?.map(category => category.id).includes(merchandiseCategory.id),
            ).length

            return (
              <li
                className={(categoryId === merchandiseCategory.id ? 'active ' : '') + 'mb-2'}
                key={merchandiseCategory.id}
                onClick={() => setCategoryId(merchandiseCategory.id)}
              >
                {merchandiseCategory.name} ({count})
              </li>
            )
          })}
        </StyledCategoryList>
      </div>
      <div className="d-flex flex-wrap px-0 col-lg-8 col-12">
        {filteredMerchandises
          .filter(
            merchandise => !categoryId || merchandise.categories?.map(category => category.id).includes(categoryId),
          )
          .map(merchandise => (
            <div key={merchandise.id} className="col-lg-4 col-12 mb-5">
              <Link to={`/merchandises/${merchandise.id}`}>
                <MerchandiseCard {...merchandise} />
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}

export default MerchandiseCollectionBlock

import { Icon } from '@chakra-ui/icons'
import { Input } from 'antd'
import { flatten, uniqBy } from 'ramda'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCard from '../components/merchandise/MerchandiseCard'
import { commonMessages, productMessages } from '../helpers/translation'
import { useMerchandiseCollection } from '../hooks/merchandise'
import { ReactComponent as ShopIcon } from '../images/shop.svg'

const messages = defineMessages({
  keywordSearch: { id: 'product.merchandise.placeholder.keywordSearch', defaultMessage: '關鍵字搜尋' },
})

const StyledSearchBlock = styled.div`
  max-width: 835px;
  width: 100%;
  margin: 0 auto;
`
const StyledTagGroup = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.57;
  letter-spacing: 0.4px;
`
const StyledCategoryList = styled.ul`
  list-style-type: none;

  li {
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      color: ${props => props.theme['@primary-color']};
    }
  }
`

const MerchandiseCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const [tag] = useQueryParam('tag', StringParam)
  const [keyword, setKeyword] = useQueryParam('keyword', StringParam)
  const { merchandises, merchandiseTags } = useMerchandiseCollection(keyword)

  const [categoryId, setCategoryId] = useState<string | null>()

  const filteredMerchandises = merchandises.filter(merchandise => !tag || merchandise.tags?.includes(tag))
  const merchandiseCategories = uniqBy(
    category => category.id,
    flatten(filteredMerchandises.map(merchandise => merchandise.categories || [])),
  )

  useEffect(() => {
    if (merchandises) {
      let index = 1
      for (let merchandise of merchandises) {
        for (let spec of merchandise.specs) {
          ReactGA.plugin.execute('ec', 'addImpression', {
            id: spec.id,
            name: `${merchandise.title} - ${spec.title}`,
            category: 'MerchandiseSpec',
            price: `${spec.listPrice}`,
            position: index,
          })
          index += 1
          if (index % 20 === 0) ReactGA.ga('send', 'pageview')
        }
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [merchandises])

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            {tag ? (
              <>#{tag}</>
            ) : (
              <>
                <Icon as={ShopIcon} className="mr-3" />
                <span>{formatMessage(productMessages.merchandise.title.mall)}</span>
              </>
            )}
          </StyledBannerTitle>

          {!tag && (
            <StyledSearchBlock>
              <Input.Search
                className="mb-2"
                placeholder={formatMessage(messages.keywordSearch)}
                onSearch={keyword => {
                  setKeyword(keyword)
                  setCategoryId(null)
                }}
              />
              <StyledTagGroup>
                {merchandiseTags.map(merchandiseTag => (
                  <Link
                    key={merchandiseTag}
                    to={`/merchandises?tag=${merchandiseTag}`}
                    onClick={() => {
                      setKeyword('')
                      setCategoryId(null)
                    }}
                    className="mr-2"
                  >
                    #{merchandiseTag}
                  </Link>
                ))}
              </StyledTagGroup>
            </StyledSearchBlock>
          )}
        </div>
      </StyledBanner>

      <StyledCollection className="container">
        <div className="row">
          <div className={tag ? 'col-12' : 'col-lg-8 col-12'}>
            <div className="row">
              {filteredMerchandises
                .filter(
                  merchandise =>
                    !categoryId || merchandise.categories?.map(category => category.id).includes(categoryId),
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

          {!tag && (
            <div className="col-lg-4 col-12">
              <StyledCategoryList>
                <li className="mb-2" onClick={() => setCategoryId(null)}>
                  {formatMessage(commonMessages.ui.all)} ({filteredMerchandises.length})
                </li>
                {merchandiseCategories.map(merchandiseCategory => {
                  const count = filteredMerchandises.filter(merchandise =>
                    merchandise.categories?.map(category => category.id).includes(merchandiseCategory.id),
                  ).length

                  return (
                    <li
                      className="mb-2"
                      key={merchandiseCategory.id}
                      onClick={() => setCategoryId(merchandiseCategory.id)}
                    >
                      {merchandiseCategory.name} ({count})
                    </li>
                  )
                })}
              </StyledCategoryList>
            </div>
          )}
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default MerchandiseCollectionPage

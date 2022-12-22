import { Icon } from '@chakra-ui/icons'
import { HStack, useRadioGroup } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { flatten, prop, sortBy, uniqBy } from 'ramda'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import PageHelmet from '../components/common/PageHelmet'
import Responsive from '../components/common/Responsive'
import SearchInput from '../components/common/SearchInput'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseCollection from '../components/merchandise/MerchandiseCollection'
import RadioCard from '../components/RadioCard'
import { commonMessages, productMessages, usersMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
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

enum MerchandiseType {
  Physical = 'isPhysical',
  Virtual = 'virtual',
}

const MerchandiseCollectionPage: React.VFC = () => {
  const { loading: loadingApp, navs } = useApp()
  const { formatMessage } = useIntl()
  const [tag] = useQueryParam('tag', StringParam)
  const [keyword, setKeyword] = useQueryParam('keyword', StringParam)
  const [categories] = useQueryParam('categories', StringParam)
  const [isPhysical] = useQueryParam('isPhysical', BooleanParam)
  const { merchandises, merchandiseTags } = useMerchandiseCollection({
    search: keyword || '',
    categories: categories ? categories : undefined,
  })
  const { pageTitle } = useNav()

  const [selectedMerchandiseType, setSelectedMerchandiseType] = useState<MerchandiseType | null>(
    isPhysical === undefined || isPhysical === null
      ? null
      : isPhysical
      ? MerchandiseType.Physical
      : MerchandiseType.Virtual,
  )
  const [categoryId, setCategoryId] = useState<string | null>()

  const hasPhysical = merchandises.some(m => m.isPhysical)
  const hasVirtual = merchandises.some(m => !m.isPhysical)
  const hasDifferentMerchandiseType = hasPhysical && hasVirtual

  const filteredMerchandises = merchandises
    .filter(merchandise => !tag || merchandise.tags?.includes(tag))
    .filter(merchandise =>
      selectedMerchandiseType !== null && hasDifferentMerchandiseType
        ? selectedMerchandiseType === MerchandiseType.Physical
          ? merchandise.isPhysical === true
          : merchandise.isPhysical === false
        : merchandise,
    )

  const merchandiseCategories = sortBy(prop('position'))(
    uniqBy(category => category.id, flatten(filteredMerchandises.map(merchandise => merchandise.categories || []))),
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
      setCategoryId(null)

      const url = new URL(window.location.href)
      if (v === formatMessage(commonMessages.ui.all)) {
        url.searchParams.delete('isPhysical')
        setSelectedMerchandiseType(null)
      } else if (v === formatMessage(commonMessages.ui.physical)) {
        url.searchParams.set('isPhysical', '1')
        setSelectedMerchandiseType(MerchandiseType.Physical)
      } else {
        url.searchParams.set('isPhysical', '0')
        setSelectedMerchandiseType(MerchandiseType.Virtual)
      }
      window.history.pushState({}, '', url.toString())
    },
  })

  const group = getRootProps()

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
      {/* // TODO: need to extend page helmet */}
      {!loadingApp && (
        <PageHelmet
          title={
            navs.filter(nav => nav.block === 'header').find(nav => nav.href === window.location.pathname)?.label ||
            formatMessage(usersMessages.tab.merchandises)
          }
        />
      )}
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            {tag ? (
              <>#{tag}</>
            ) : (
              <>
                <Icon as={ShopIcon} className="mr-3" />
                <span>{pageTitle || formatMessage(productMessages.merchandise.title.mall)}</span>
              </>
            )}
          </StyledBannerTitle>

          {!tag && (
            <StyledSearchBlock>
              <SearchInput
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
            {!tag && (
              <Responsive.Default>
                <div className="col-lg-4 mb-4">
                  <HStack className="mb-4" {...group}>
                    {hasDifferentMerchandiseType &&
                      options.map(value => {
                        const radio = getRadioProps({ value })
                        return (
                          <RadioCard key={value} size="md" {...radio}>
                            {value}
                          </RadioCard>
                        )
                      })}
                  </HStack>
                  <StyledCategoryList>
                    <li className="mb-2" onClick={() => setCategoryId(null)}>
                      {formatMessage(commonMessages.ui.allCategory)} ({filteredMerchandises.length})
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
              </Responsive.Default>
            )}

            <div className="row">
              <MerchandiseCollection
                merchandises={filteredMerchandises.filter(
                  merchandise =>
                    !categoryId || merchandise.categories?.map(category => category.id).includes(categoryId),
                )}
              />
            </div>
          </div>

          {!tag && (
            <Responsive.Desktop>
              <div className="col-lg-4">
                <HStack className="mb-4" {...group}>
                  {hasDifferentMerchandiseType &&
                    options.map(value => {
                      const radio = getRadioProps({ value })
                      return (
                        <RadioCard key={value} size="md" {...radio}>
                          {value}
                        </RadioCard>
                      )
                    })}
                </HStack>
                <StyledCategoryList>
                  <li className="mb-2" onClick={() => setCategoryId(null)}>
                    {formatMessage(commonMessages.ui.allCategory)} ({filteredMerchandises.length})
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
            </Responsive.Desktop>
          )}
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default MerchandiseCollectionPage

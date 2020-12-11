import { useQuery } from '@apollo/react-hooks'
import { Button, Icon } from 'antd'
import gql from 'graphql-tag'
import { flatten, uniqBy } from 'ramda'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CustomRatioImage } from '../components/common/Image'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { notEmpty } from '../helpers'
import { commonMessages } from '../helpers/translation'
import DefaultAvatar from '../images/avatar.svg'
import types from '../types'
import LoadingPage from './LoadingPage'
import NotFoundPage from './NotFoundPage'

const messages = defineMessages({
  creatorDisplay: { id: 'creator.term.creatorDisplay', defaultMessage: '講師牆' },
})

const StyledCreatorName = styled.h2`
  height: 20px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.77px;
  color: var(--gray-darker);
`

const StyledCreatorTitle = styled.h3`
  height: 14px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`

const StyledCreatorAbstract = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

export const StyledCreatorTag = styled.span`
  &:before {
    content: '#';
    margin-right: 2px;
  }

  margin-bottom: 0.5rem;
  border-radius: 2px;
  padding: 4px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
  color: ${props => props.theme['@primary-color']};
  background-color: ${props => props.theme['@primary-color']}22;

  &:not(last-child) {
    margin-right: 0.4rem;
  }
`

const CreatorDisplayedPage: React.FC<{}> = () => {
  const { loading, enabledModules } = useApp()
  const { formatMessage } = useIntl()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { loadingCreators, errorCreators, creators } = usePublishedCreator()

  if (loading || loadingCreators) {
    return <LoadingPage />
  }

  if (!enabledModules.creator_display || errorCreators) {
    return <NotFoundPage />
  }

  const categories = uniqBy(v => v.name, flatten(creators.map(v => v.categories).filter(notEmpty)))

  const filteredCreators = creators.filter(
    v => !selectedCategoryId || v.categories.map(w => w.id).includes(selectedCategoryId),
  )

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle className="d-flex align-items-center">
            <Icon type="appstore" theme="filled" className="mr-3" />
            <span>{formatMessage(messages.creatorDisplay)}</span>
          </StyledBannerTitle>

          <Button
            type={selectedCategoryId === null ? 'primary' : 'default'}
            shape="round"
            className="mb-2"
            onClick={() => setSelectedCategoryId(null)}
          >
            {formatMessage(commonMessages.button.allCategory)}
          </Button>

          {categories.map(v => (
            <Button
              key={v.id}
              type={selectedCategoryId === v.id ? 'primary' : 'default'}
              shape="round"
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(v.id)}
            >
              {v.name}
            </Button>
          ))}
        </div>
      </StyledBanner>

      <StyledCollection>
        <div className="container">
          <div className="row">
            {filteredCreators.map(v => (
              <div className="col-12 col-md-6 col-lg-3 mb-4">
                <Link to={`/creators/${v.id}`}>
                  <CustomRatioImage
                    width="100%"
                    ratio={1}
                    src={v.pictureUrl || DefaultAvatar}
                    className="mb-3"
                    shape="rounded"
                  />
                  <StyledCreatorName className="mb-2">{v.name}</StyledCreatorName>
                  <StyledCreatorTitle className="mb-3">{v.title}</StyledCreatorTitle>
                  <StyledCreatorAbstract className="mb-3">{v.abstract}</StyledCreatorAbstract>
                  <div className="d-flex flex-wrap">
                    {v.specialtyNames.map(w => (
                      <StyledCreatorTag>{w}</StyledCreatorTag>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

const usePublishedCreator = () => {
  const { loading, error, data, refetch } = useQuery<types.GET_PUBLISHED_CREATOR>(gql`
    query GET_PUBLISHED_CREATOR {
      creator(where: { published_at: { _is_null: false } }, order_by: { published_at: desc, position: asc }) {
        id
        name
        picture_url
        member {
          title
          abstract
        }
        creator_categories {
          id
          category {
            id
            name
          }
        }
        member_specialities(limit: 3) {
          id
          tag_name
        }
      }
    }
  `)

  const creators: {
    id: string | null
    name: string | null
    title: string | null
    pictureUrl: string | null
    abstract: string | null
    categories: {
      id: string
      name: string
    }[]
    specialtyNames: string[]
  }[] =
    loading || error || !data
      ? []
      : data.creator.map(v => ({
          id: v.id,
          name: v.name,
          pictureUrl: v.picture_url,
          title: v.member?.title || null,
          abstract: v.member?.abstract || null,
          categories: v.creator_categories.map(w => ({
            id: w.category.id,
            name: w.category.name,
          })),
          specialtyNames: v.member_specialities.map(w => w.tag_name),
        }))

  return {
    loadingCreators: loading,
    errorCreators: error,
    creators,
    refetchCreators: refetch,
  }
}

export default CreatorDisplayedPage

import { Button } from '@chakra-ui/react'
import { Icon, Skeleton } from 'antd'
import { uniqBy, unnest } from 'ramda'
import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Activity from '../components/activity/Activity'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import LanguageContext from '../contexts/LanguageContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { usePublishedActivityCollection } from '../hooks/activity'
import { useNav } from '../hooks/data'

const StyledButton = styled(Button)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

const ActivityCollectionPage = () => {
  const { currentLanguage } = useContext(LanguageContext)
  const { loadingActivities, errorActivities, activities } = usePublishedActivityCollection()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { formatMessage } = useIntl()
  const { pageTitle } = useNav()

  const categories: {
    id: string
    name: string
  }[] = uniqBy(category => category.id, unnest(activities.map(activity => activity.categories)))

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon type="appstore" theme="filled" className="mr-3" />
            <span>{pageTitle || formatMessage(productMessages.activity.title.default)}</span>
          </StyledBannerTitle>

          <StyledButton
            colorScheme="primary"
            variant={selectedCategoryId === null ? 'solid' : 'outline'}
            className="mb-2"
            onClick={() => setSelectedCategoryId(null)}
          >
            {formatMessage(commonMessages.button.allCategory)}
          </StyledButton>
          {categories.map(category => (
            <StyledButton
              key={category.id}
              colorScheme="primary"
              variant={selectedCategoryId === category.id ? 'solid' : 'outline'}
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </StyledButton>
          ))}
        </div>
      </StyledBanner>

      <StyledCollection>
        <div className="container">
          {loadingActivities && <Skeleton />}
          {errorActivities && <div>{formatMessage(commonMessages.status.readingError)}</div>}

          <div className="row">
            {activities
              .filter(
                activity =>
                  selectedCategoryId === null ||
                  activity.categories.some(category => category.id === selectedCategoryId),
              )
              .filter(
                activity =>
                  !activity.supportLocales || activity.supportLocales.find(locale => locale === currentLanguage),
              )
              .map(activity => (
                <div key={activity.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <Activity {...activity} />
                </div>
              ))}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default ActivityCollectionPage

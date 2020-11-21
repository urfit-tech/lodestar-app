import { Button, Icon, Skeleton } from 'antd'
import { uniqBy, unnest } from 'ramda'
import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import Activity from '../components/activity/Activity'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import LanguageContext from '../contexts/LanguageContext'
import { commonMessages, productMessages } from '../helpers/translation'
import { usePublishedActivityCollection } from '../hooks/activity'
import { useNav } from '../hooks/data'

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

          <Button
            type={selectedCategoryId === null ? 'primary' : 'default'}
            shape="round"
            onClick={() => setSelectedCategoryId(null)}
            className="mb-2"
          >
            {formatMessage(commonMessages.button.allCategory)}
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              type={selectedCategoryId === category.id ? 'primary' : 'default'}
              shape="round"
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(category.id)}
            >
              {category.name}
            </Button>
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

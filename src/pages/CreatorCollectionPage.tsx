import { Icon, Skeleton } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'
import CreatorBriefCard from '../components/appointment/CreatorBriefCard'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useApp } from '../containers/common/AppContext'
import { desktopViewMixin } from '../helpers'
import { commonMessages, usersMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { useCreatorCollection } from '../hooks/member'

const StyledSection = styled.div`
  background: #f7f8f8;
`
const StyledCollectionBlock = styled.section`
  background: white;
  padding: 2rem 0;

  @media (min-width: ${BREAK_POINT}px) {
    padding: 56px;
  }
`
const StyledTitle = styled.h1`
  margin-bottom: 32px;
  color: var(--gray-darker);
  font-size: 24px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;

  @media (min-width: ${BREAK_POINT}px) {
    margin-bottom: 40px;
  }
`
const StyledCreatorBlock = styled.div`
  width: 50%;

  ${desktopViewMixin(css`
    width: 20%;
  `)}
`

const CreatorCollectionPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const { pageTitle } = useNav()
  const { loadingCreators, errorCreators, creators } = useCreatorCollection()

  let seoMeta:
    | {
        title?: string
        description?: string
      }
    | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta'])?.CreatorCollectionPage
  } catch (error) {}

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: seoMeta?.title,
    description: seoMeta?.description,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: settings['seo.name'],
      description: settings['open_graph.description'],
    },
  })

  return (
    <DefaultLayout>
      <Helmet>
        <title>{seoMeta?.title}</title>
        <meta name="description" content={seoMeta?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoMeta?.title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content={seoMeta?.description} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <StyledSection>
        <div className="py-5 container">
          <StyledTitle>
            <Icon type="appstore" theme="filled" className="mr-3" />
            <span>{pageTitle || formatMessage(usersMessages.content.creatorList)}</span>
          </StyledTitle>
        </div>
      </StyledSection>

      <StyledCollectionBlock>
        <div className="container">
          <StyledTitle>{formatMessage(usersMessages.content.recommend)}</StyledTitle>
          {loadingCreators ? (
            <Skeleton avatar active />
          ) : !!errorCreators ? (
            <div>{formatMessage(commonMessages.status.readingError)}</div>
          ) : (
            <div className="row">
              {creators.slice(0, 4).map(creator => (
                <div key={creator.id} className="col-6 col-lg-3 mb-4 p-4">
                  <Link to={`/creators/${creator.id}`}>
                    <CreatorBriefCard
                      variant="featuring"
                      imageUrl={creator.avatarUrl}
                      title={creator.name}
                      meta={creator.title}
                      description={creator.abstract}
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}

          <StyledTitle>{formatMessage(usersMessages.content.allCreators)}</StyledTitle>
          {loadingCreators ? (
            <Skeleton avatar active />
          ) : !!errorCreators ? (
            <div>{formatMessage(commonMessages.status.readingError)}</div>
          ) : (
            <div className="row">
              {creators.map(creator => (
                <StyledCreatorBlock key={creator.id} className="mb-4 p-4">
                  <Link to={`/creators/${creator.id}`}>
                    <CreatorBriefCard imageUrl={creator.avatarUrl} title={creator.name} meta={creator.abstract} />
                  </Link>
                </StyledCreatorBlock>
              ))}
            </div>
          )}
        </div>
      </StyledCollectionBlock>
    </DefaultLayout>
  )
}

export default CreatorCollectionPage

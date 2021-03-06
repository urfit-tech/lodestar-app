import { Button as ChakraButton, SkeletonText } from '@chakra-ui/react'
import { Icon } from 'antd'
import { flatten, uniqBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { Helmet } from 'react-helmet'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import ProgramCard from '../components/program/ProgramCard'
import ProgramCollectionBanner from '../components/program/ProgramCollectionBanner'
import { useApp } from '../containers/common/AppContext'
import LanguageContext from '../contexts/LanguageContext'
import { notEmpty } from '../helpers'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { useEnrolledProgramIds, usePublishedProgramCollection } from '../hooks/program'
import { CategoryProps } from '../types/general'

const StyledButton = styled(ChakraButton)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

const ProgramCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()

  const [defaultActive] = useQueryParam('active', StringParam)
  const [type] = useQueryParam('type', StringParam)
  const [title] = useQueryParam('title', StringParam)
  const [noPrice] = useQueryParam('noPrice', BooleanParam)
  const [noMeta] = useQueryParam('noMeta', BooleanParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)
  const [noBanner] = useQueryParam('noBanner', BooleanParam)
  const [permitted] = useQueryParam('permitted', BooleanParam)

  const { currentMemberId } = useAuth()
  const { settings } = useApp()
  const { pageTitle } = useNav()
  const { currentLanguage } = useContext(LanguageContext)

  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: permitted ? undefined : false,
    categoryId: defaultActive || undefined,
  })
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(defaultActive || null)

  const categories: CategoryProps[] = uniqBy(
    category => category.id,
    flatten(programs.map(program => program.categories).filter(notEmpty)),
  )

  useEffect(() => {
    if (programs) {
      programs.forEach((program, index) => {
        const listPrice =
          program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0
        const salePrice =
          program.isSubscription && program.plans.length > 0 && (program.plans[0].soldAt?.getTime() || 0) > Date.now()
            ? program.plans[0].salePrice
            : (program.soldAt?.getTime() || 0) > Date.now()
            ? program.salePrice
            : undefined
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: program.id,
          name: program.title,
          category: 'Program',
          price: `${salePrice || listPrice}`,
          position: index + 1,
        })
      })
      ReactGA.ga('send', 'pageview')
    }
  }, [programs])

  let seoMeta:
    | {
        title?: string
        description?: string
      }
    | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ProgramCollectionPage
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
    <DefaultLayout white>
      <Helmet>
        <title>{seoMeta?.title}</title>
        <meta name="description" content={seoMeta?.description} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoMeta?.title} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:description" content={seoMeta?.description} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon type="appstore" theme="filled" className="mr-3" />
            <span>{title || pageTitle || formatMessage(productMessages.program.title.explore)}</span>
          </StyledBannerTitle>
          {!noSelector && (
            <StyledButton
              colorScheme="primary"
              variant={selectedCategoryId === null ? 'solid' : 'outline'}
              className="mb-2"
              onClick={() => setSelectedCategoryId(null)}
            >
              {formatMessage(commonMessages.button.allCategory)}
            </StyledButton>
          )}
          {!noSelector &&
            categories.map(category => (
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
          {!noBanner && settings['program_collection_banner.enabled'] === 'true' && (
            <ProgramCollectionBanner
              link={settings['program_collection_banner.link']}
              imgUrls={{
                0: settings['program_collection_banner.img_url@0'],
                425: settings['program_collection_banner.img_url@425'],
              }}
            />
          )}
          <div className="row">
            {loadingPrograms ? (
              <SkeletonText mt="1" noOfLines={4} spacing="4" />
            ) : !!errorPrograms ? (
              <div>{formatMessage(commonMessages.status.readingFail)}</div>
            ) : (
              programs
                .filter(
                  program =>
                    (!selectedCategoryId || program.categories?.some(category => category.id === selectedCategoryId)) &&
                    (!program.supportLocales || program.supportLocales.find(locale => locale === currentLanguage)),
                )
                .map(program => (
                  <div key={program.id} className="col-12 col-md-6 col-lg-4 mb-4">
                    <ProgramCard
                      program={program}
                      programType={type}
                      isEnrolled={enrolledProgramIds.includes(program.id)}
                      noPrice={!!noPrice}
                      withMeta={!noMeta}
                    />
                  </div>
                ))
            )}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default ProgramCollectionPage

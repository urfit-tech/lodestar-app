import { Button as ChakraButton, Icon, SkeletonText } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { flatten, uniqBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import ProgramCard from '../components/program/ProgramCard'
import ProgramCollectionBanner from '../components/program/ProgramCollectionBanner'
import LanguageContext from '../contexts/LanguageContext'
import { notEmpty } from '../helpers'
import { commonMessages, productMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { useEnrolledProgramIds, usePublishedProgramCollection } from '../hooks/program'
import { Category } from '../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../types/program'

const StyledButton = styled(ChakraButton)`
  && {
    height: 2.75rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    border-radius: 2rem;
  }
`

const ProgramCollectionPage: React.VFC = () => {
  const tracking = useTracking()
  const { formatMessage } = useIntl()

  const [defaultActive] = useQueryParam('active', StringParam)
  const [title] = useQueryParam('title', StringParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)
  const [noBanner] = useQueryParam('noBanner', BooleanParam)
  const [permitted] = useQueryParam('permitted', BooleanParam)

  const { currentMemberId } = useAuth()
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { pageTitle } = useNav()
  const { currentLanguage } = useContext(LanguageContext)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: permitted ? undefined : false,
    categoryId: defaultActive || undefined,
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(defaultActive || null)

  const categories: Category[] = uniqBy(
    category => category.id,
    flatten(programs.map(program => program.categories).filter(notEmpty)),
  )

  const filteredPrograms = programs.filter(
    program =>
      (!selectedCategoryId || program.categories?.some(category => category.id === selectedCategoryId)) &&
      (!program.supportLocales || program.supportLocales.find(locale => locale === currentLanguage)),
  )

  useEffect(() => {
    if (defaultActive) {
      setSelectedCategoryId(defaultActive)
    }
  }, [defaultActive])

  useEffect(() => {
    ReactGA.ga('send', 'pageview')
  }, [])

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
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon as={AiFillAppstore} className="mr-3" />
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
          {loadingPrograms ? (
            <SkeletonText mt="1" noOfLines={4} spacing="4" />
          ) : !!errorPrograms ? (
            <div>{formatMessage(commonMessages.status.readingFail)}</div>
          ) : (
            <ProgramCollection programs={filteredPrograms} enrolledProgramIds={enrolledProgramIds} />
          )}
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

const ProgramCollection: React.FC<{
  programs: (ProgramBriefProps & {
    supportLocales: string[] | null
    categories: Category[]
    roles: ProgramRole[]
    plans: ProgramPlan[]
  })[]
  enrolledProgramIds: string[]
}> = ({ programs, enrolledProgramIds }) => {
  const { id: appId } = useApp()
  const tracking = useTracking()
  const [type] = useQueryParam('type', StringParam)
  const [noPrice] = useQueryParam('noPrice', BooleanParam)
  const [noMeta] = useQueryParam('noMeta', BooleanParam)

  const { resourceCollection } = useResourceCollection(
    appId ? programs.map(program => `${appId}:program:${program.id}`) : [],
  )

  return (
    <div className="row">
      <Tracking.Impression resources={resourceCollection} />
      {programs.map((program, idx) => (
        <div key={program.id} className="col-12 col-md-6 col-lg-4 mb-4">
          <ProgramCard
            program={program}
            programType={type}
            isEnrolled={enrolledProgramIds.includes(program.id)}
            noPrice={!!noPrice}
            withMeta={!noMeta}
            onClick={() => {
              const resource = resourceCollection[idx]
              resource && tracking.click(resource, { position: idx + 1 })
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default ProgramCollectionPage

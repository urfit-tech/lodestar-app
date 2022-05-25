import { Button as ChakraButton, Icon, SkeletonText } from '@chakra-ui/react'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { flatten, prop, sortBy, uniqBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../../components/layout'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProgramCard from '../../components/program/ProgramCard'
import ProgramCollectionBanner from '../../components/program/ProgramCollectionBanner'
import LocaleContext from '../../contexts/LocaleContext'
import { notEmpty } from '../../helpers'
import { commonMessages, productMessages } from '../../helpers/translation'
import { useNav } from '../../hooks/data'
import { usePublishedProgramCollection } from '../../hooks/program'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'
import ProgramCollectionPageHelmet from './ProgramCollectionPageHelmet'

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
  const [queryTitle] = useQueryParam('title', StringParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)
  const [noBanner] = useQueryParam('noBanner', BooleanParam)
  const [permitted] = useQueryParam('permitted', BooleanParam)

  const { settings } = useApp()
  const { pageTitle } = useNav()
  const { currentLocale } = useContext(LocaleContext)

  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: permitted ? undefined : false,
    categoryId: defaultActive || undefined,
  })

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(defaultActive || null)

  const categories: Category[] = sortBy(prop('position'))(
    uniqBy(category => category.id, flatten(programs.map(program => program.categories).filter(notEmpty))),
  )

  const filteredPrograms = programs.filter(
    program =>
      (!selectedCategoryId || program.categories?.some(category => category.id === selectedCategoryId)) &&
      (!program.supportLocales || program.supportLocales.find(locale => locale === currentLocale)),
  )

  useEffect(() => {
    if (defaultActive) {
      setSelectedCategoryId(defaultActive)
    }
  }, [defaultActive])

  useEffect(() => {
    ReactGA.ga('send', 'pageview')
  }, [])

  const programCollectionPageTitle = queryTitle || pageTitle || formatMessage(productMessages.program.title.explore)

  return (
    <DefaultLayout white>
      <ProgramCollectionPageHelmet title={programCollectionPageTitle} programs={filteredPrograms} />
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle>
            <Icon as={AiFillAppstore} className="mr-3" />
            <span>{programCollectionPageTitle}</span>
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
            <ProgramCollection programs={filteredPrograms} />
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
}> = ({ programs }) => {
  const { id: appId } = useApp()
  const tracking = useTracking()
  const [type] = useQueryParam('type', StringParam)
  const [noPrice] = useQueryParam('noPrice', BooleanParam)
  const [noMeta] = useQueryParam('noMeta', BooleanParam)

  const { resourceCollection } = useResourceCollection(
    appId ? programs.map(program => `${appId}:program:${program.id}`) : [],
    true,
  )

  return (
    <div className="row">
      <Tracking.Impression resources={resourceCollection} />
      {programs.map((program, idx) => (
        <div key={program.id} className="col-12 col-md-6 col-lg-4 mb-4">
          <ProgramCard
            program={program}
            programType={type}
            noPrice={!!noPrice}
            withMeta={!noMeta}
            onClick={() => {
              const resource = resourceCollection[idx]
              resource && tracking.click(resource, { position: idx + 1 })
            }}
            previousPage={`programs`}
          />
        </div>
      ))}
    </div>
  )
}

export default ProgramCollectionPage

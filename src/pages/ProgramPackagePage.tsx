import { Button } from '@chakra-ui/react'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import React, { createRef, useEffect } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { BraftContent } from '../components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import ProgramCollection from '../components/package/ProgramCollection'
import ProgramPackageBanner from '../components/package/ProgramPackageBanner'
import ProgramPackagePlanCard from '../components/package/ProgramPackagePlanCard'
import { ProgramDisplayedCard } from '../components/program/ProgramDisplayedCard'
import { ProgramDisplayedListItem } from '../components/program/ProgramDisplayedListItem'
import { desktopViewMixin } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { useEnrolledProgramIds } from '../hooks/program'
import { useEnrolledProgramPackagePlanIds, useProgramPackageIntroduction } from '../hooks/programPackage'
import NotFoundPage from './NotFoundPage'

const StyledTitle = styled.h2`
  ${CommonLargeTitleMixin}
`
const StyledFixedBlock = styled.div`
  z-index: 100;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 0.5rem 0.75rem;
  background: white;

  ${desktopViewMixin(css`
    display: none;
  `)}
`

const messages = defineMessages({
  introduction: { id: 'programPackage.label.introduction', defaultMessage: '介紹' },
  includedItems: { id: 'programPackage.label.includedItems', defaultMessage: '包含項目' },
  checkPlans: { id: 'programPackage.ui.checkPlans', defaultMessage: '查看購買方案' },
})

const ProgramPackagePage: React.VFC = () => {
  const tracking = useTracking()
  const { formatMessage } = useIntl()
  const { programPackageId } = useParams<{ programPackageId: string }>()
  const { currentMemberId } = useAuth()
  const { loadingProgramPackage, errorProgramPackage, programPackageIntroduction } =
    useProgramPackageIntroduction(programPackageId)
  const { loadingProgramPackageIds, enrolledProgramPackagePlanIds } = useEnrolledProgramPackagePlanIds(
    currentMemberId || '',
  )
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const planBlockRef = createRef<HTMLDivElement>()

  useEffect(() => {
    tracking.detail({
      type: 'ProgramPackage',
      id: programPackageId,
    })
  }, [programPackageId, tracking])

  useEffect(() => {
    if (programPackageIntroduction) {
      programPackageIntroduction.programPackagePlans.forEach((programPackagePlan, index) => {
        ReactGA.plugin.execute('ec', 'addProduct', {
          id: programPackagePlan.id,
          name: programPackagePlan.title,
          category: 'ProgramPackage',
          price: `${programPackagePlan.listPrice}`,
          quantity: '1',
          currency: 'TWD',
        })
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: programPackagePlan.id,
          name: programPackagePlan.title,
          category: 'ProgramPackage',
          price: `${programPackagePlan.listPrice}`,
          position: index + 1,
        })
      })
      ReactGA.plugin.execute('ec', 'setAction', 'detail')
      ReactGA.ga('send', 'pageview')
    }
  }, [programPackageIntroduction])

  if (!loadingProgramPackage && !programPackageIntroduction.id) {
    return <NotFoundPage />
  }

  if (errorProgramPackage) {
    return <>{formatMessage(commonMessages.status.readingError)}</>
  }

  return (
    <DefaultLayout white footerBottomSpace="4rem">
      <ProgramPackageBanner
        title={programPackageIntroduction.title}
        coverUrl={programPackageIntroduction.coverUrl}
        programPackageId={programPackageIntroduction.id}
      />

      <div className="container">
        <div className="row">
          {programPackageIntroduction.programPackagePlans.length > 0 ? (
            <>
              <div className="col-12 col-lg-8 pt-5">
                <StyledTitle className="mb-4">{formatMessage(messages.introduction)}</StyledTitle>
                <div className="mb-5">
                  <BraftContent>{programPackageIntroduction.description}</BraftContent>
                </div>

                <StyledTitle className="mb-4">{formatMessage(messages.includedItems)}</StyledTitle>
                <ProgramCollection
                  programs={programPackageIntroduction.includedPrograms}
                  renderItem={({ displayType, program }) => {
                    const isEnrolled = enrolledProgramIds.includes(program.id)
                    return displayType === 'grid' ? (
                      <div className="col-12 col-md-6 col-lg-6 mb-4">
                        <Link to={`/programs/${program.id}${isEnrolled ? '/contents' : ''}`}>
                          <ProgramDisplayedCard key={program.id} program={program} />
                        </Link>
                      </div>
                    ) : displayType === 'list' ? (
                      <div className="col-12">
                        <Link to={`/programs/${program.id}${isEnrolled ? '/contents' : ''}`}>
                          <ProgramDisplayedListItem key={program.id} program={program} />
                        </Link>
                      </div>
                    ) : null
                  }}
                />
              </div>
              <div ref={planBlockRef} className="col-12 col-lg-4 pt-5">
                {programPackageIntroduction.programPackagePlans.map(programPackagePlan => (
                  <div key={programPackagePlan.id} className="mb-4">
                    <ProgramPackagePlanCard
                      programPackageId={programPackageId}
                      {...programPackagePlan}
                      loading={loadingProgramPackageIds}
                      isEnrolled={enrolledProgramPackagePlanIds.includes(programPackagePlan.id)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="col-12 col-lg-12 pt-5">
              <StyledTitle className="mb-4">{formatMessage(messages.introduction)}</StyledTitle>
              <div className="mb-5">
                <BraftContent>{programPackageIntroduction.description}</BraftContent>
              </div>

              <StyledTitle className="mb-4">{formatMessage(messages.includedItems)}</StyledTitle>
              <ProgramCollection
                programs={programPackageIntroduction.includedPrograms}
                renderItem={({ displayType, program }) =>
                  displayType === 'grid' ? (
                    <div className="col-12 col-md-6 col-lg-4">
                      <ProgramDisplayedCard key={program.id} program={program} />
                    </div>
                  ) : displayType === 'list' ? (
                    <div className="col-12">
                      <ProgramDisplayedListItem key={program.id} program={program} />
                    </div>
                  ) : null
                }
              />
            </div>
          )}
        </div>
      </div>

      <StyledFixedBlock>
        <Button
          variant="primary"
          isFullWidth
          onClick={() => planBlockRef.current?.scrollIntoView({ behavior: 'smooth' })}
        >
          {formatMessage(messages.checkPlans)}
        </Button>
      </StyledFixedBlock>
    </DefaultLayout>
  )
}

export default ProgramPackagePage

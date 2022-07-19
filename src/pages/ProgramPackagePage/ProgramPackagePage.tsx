import { Button } from '@chakra-ui/react'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import React, { createRef, useEffect } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import ClassCouponBlock from '../../components/ClassCouponBlock'
import Responsive from '../../components/common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProgramCollection from '../../components/package/ProgramCollection'
import ProgramPackageBanner from '../../components/package/ProgramPackageBanner'
import ProgramPackagePlanCard from '../../components/package/ProgramPackagePlanCard'
import { ProgramDisplayedCard } from '../../components/program/ProgramDisplayedCard'
import { ProgramDisplayedListItem } from '../../components/program/ProgramDisplayedListItem'
import CWLBreadcrumb from '../../components/common/CWLBreadcrumb'
import { desktopViewMixin } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useEnrolledProgramPackagePlanIds, useProgramPackageIntroduction } from '../../hooks/programPackage'
import NotFoundPage from '../NotFoundPage'
import ProgramPackagePageHelmet from './ProgramPackagePageHelmet'

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
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  const { programPackageId } = useParams<{ programPackageId: string }>()
  const { resourceCollection } = useResourceCollection([`${appId}:program_package:${programPackageId}`], true)
  const { currentMemberId } = useAuth()
  const { loadingProgramPackage, errorProgramPackage, programPackageIntroduction } =
    useProgramPackageIntroduction(programPackageId)
  const { loadingProgramPackageIds, enrolledProgramPackagePlanIds } = useEnrolledProgramPackagePlanIds(
    currentMemberId || '',
  )

  const planBlockRef = createRef<HTMLDivElement>()

  useEffect(() => {
    if (programPackageIntroduction) {
      programPackageIntroduction.plans.forEach((programPackagePlan, index) => {
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
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      {programPackageIntroduction && <ProgramPackagePageHelmet programPackage={programPackageIntroduction} />}
      <ProgramPackageBanner
        title={programPackageIntroduction.title}
        coverUrl={programPackageIntroduction.coverUrl}
        programPackageId={programPackageIntroduction.id}
      />

      <CWLBreadcrumb programPackage={resourceCollection[0]} />

      <div className="container">
        <div className="row">
          {programPackageIntroduction.plans.length > 0 ? (
            <>
              <div className="col-12 col-lg-8 pt-5">
                <Responsive.Default>
                  <ClassCouponBlock />
                </Responsive.Default>

                <StyledTitle className="mb-4">套裝內課程</StyledTitle>
                <ProgramCollection
                  programs={programPackageIntroduction.programs}
                  renderItem={({ displayType, program }) => {
                    return displayType === 'grid' ? (
                      <div className="col-12 col-md-6 col-lg-6 mb-4">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          to={`/programs/${program.id}?back=program-packages_${programPackageId}`}
                        >
                          <ProgramDisplayedCard key={program.id} program={program} />
                        </Link>
                      </div>
                    ) : displayType === 'list' ? (
                      <div className="col-12">
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          to={`/programs/${program.id}?back=program-packages_${programPackageId}`}
                        >
                          <ProgramDisplayedListItem key={program.id} program={program} />
                        </Link>
                      </div>
                    ) : null
                  }}
                />
                <StyledTitle className="mb-4">{formatMessage(messages.introduction)}</StyledTitle>
                <div className="mb-5">
                  <BraftContent>{programPackageIntroduction.description}</BraftContent>
                </div>
              </div>
              <div ref={planBlockRef} className="col-12 col-lg-4 pt-5">
                <Responsive.Desktop>
                  <ClassCouponBlock />
                </Responsive.Desktop>
                {programPackageIntroduction.plans.map(programPackagePlan => (
                  <div key={programPackagePlan.id} className={ programPackageIntroduction.plans.length <= 1 ? 'mb-4 positionSticky' : 'mb-4' }>
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
                programs={programPackageIntroduction.programs}
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

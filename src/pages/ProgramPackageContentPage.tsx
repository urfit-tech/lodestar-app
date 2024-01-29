import { SkeletonText } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import DefaultLayout from '../components/layout/DefaultLayout'
import ProgramCollection from '../components/package/ProgramCollection'
import ProgramPackageBanner from '../components/package/ProgramPackageBanner'
import { ProgramDisplayedCard } from '../components/program/ProgramDisplayedCard'
import { ProgramDisplayedListItem } from '../components/program/ProgramDisplayedListItem'
import { useProgramPackage } from '../hooks/programPackage'

const ProgramPackageContentPage: React.VFC = () => {
  const { programPackageId } = useParams<{ programPackageId: string }>()
  const [specificMemberId] = useQueryParam('memberId', StringParam)
  const { currentMemberId, currentUserRole } = useAuth()
  const memberId = specificMemberId || currentMemberId
  const { loading, error, data: programPackage } = useProgramPackage(programPackageId, memberId)

  if (loading || !currentUserRole) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (!programPackage) {
    return <Redirect to={`/program-packages/${programPackageId}`} />
  }

  return (
    <DefaultLayout>
      <div>
        <ProgramPackageBanner
          programPackageId={programPackageId}
          title={programPackage.title}
          coverUrl={programPackage.coverUrl}
          isEnrolled
        />
        <div className="py-5">
          <ProgramCollection
            programs={programPackage.programs}
            renderItem={({ program, displayType }) =>
              displayType === 'grid' ? (
                <Link
                  className="col-12 col-md-6 col-lg-4"
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`/programs/${program.id}/contents?back=program-packages_${programPackageId}`}
                >
                  <ProgramDisplayedCard key={program.id} program={program} memberId={memberId} />
                </Link>
              ) : displayType === 'list' ? (
                <Link
                  className="col-12"
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`/programs/${program.id}/contents?back=program-packages_${programPackageId}`}
                >
                  <ProgramDisplayedListItem key={program.id} program={program} memberId={memberId} />
                </Link>
              ) : null
            }
          />
        </div>
      </div>
    </DefaultLayout>
  )
}

export default ProgramPackageContentPage

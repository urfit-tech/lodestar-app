import { SkeletonText } from '@chakra-ui/react'
import React from 'react'
import { Link, Redirect, useParams } from 'react-router-dom'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
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
  const { loading, error, programPackage, programs } = useProgramPackage(programPackageId, memberId)

  if (loading || error || !currentUserRole || !programPackage) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (currentUserRole === 'general-member' && !programPackage.isEnrolled) {
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
            programs={programs}
            renderItem={({ program, displayType }) =>
              displayType === 'grid' ? (
                <Link
                  className="col-12 col-md-6 col-lg-4"
                  to={`/programs/${program.id}/contents?back=program-package_${programPackageId}`}
                >
                  <ProgramDisplayedCard key={program.id} program={program} memberId={memberId} />
                </Link>
              ) : displayType === 'list' ? (
                <Link
                  className="col-12"
                  to={`/programs/${program.id}/contents?back=program-package_${programPackageId}`}
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

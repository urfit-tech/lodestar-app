import { SkeletonText } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import PracticeAdminCard from '../../components/practice/PracticeAdminCard'
import { EnrolledProgramSelector } from '../../components/program/ProgramSelector'
import { commonMessages } from '../../helpers/translation'
import { usePracticeCollection } from '../../hooks/practice'
import { ReactComponent as BookIcon } from '../../images/book.svg'

const PracticeCollectionAdminPage = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const [selectedProgramId, setSelectedProgramId] = useState('all')

  return (
    <MemberAdminLayout content={{ icon: BookIcon, title: formatMessage(commonMessages.content.practiceManagement) }}>
      <div className="row no-gutters mb-4">
        <div className="col-12">
          {currentMemberId && (
            <EnrolledProgramSelector
              value={selectedProgramId}
              memberId={currentMemberId}
              onChange={key => setSelectedProgramId(key)}
            />
          )}
        </div>
      </div>
      {currentMemberId && <PracticeCollectionBlock memberId={currentMemberId} selectedProgramId={selectedProgramId} />}
    </MemberAdminLayout>
  )
}

const PracticeCollectionBlock: React.VFC<{
  memberId: string
  selectedProgramId: string
}> = ({ memberId, selectedProgramId }) => {
  const { formatMessage } = useIntl()
  const { loadingPracticeCollection, errorPracticeCollection, practiceCollection } = usePracticeCollection({
    memberId,
    programId: selectedProgramId === 'all' ? undefined : selectedProgramId,
  })
  if (loadingPracticeCollection) {
    return <SkeletonText mt="1" noOfLines={4} spacing="4" />
  }

  if (errorPracticeCollection || !practiceCollection) {
    return <div>{formatMessage(commonMessages.status.readingError)}</div>
  }
  return (
    <div className="row">
      {practiceCollection.length ? (
        practiceCollection.map(v => (
          <div key={v.id} className="col-12 col-lg-3 mb-4">
            <PracticeAdminCard
              id={v.id}
              title={v.title}
              coverUrl={v.coverUrl}
              memberId={v.memberId}
              suggestCount={v.suggestCount}
              reactedMemberIds={v.reactedMemberIds}
              reactedMemberIdsCount={v.reactedMemberIdsCount}
              isCoverRequired={v.isCoverRequired}
            />
          </div>
        ))
      ) : (
        <p>沒有作業唷，可以去課程裡繳交作業，之後來這查看。</p>
      )}
    </div>
  )
}

export default PracticeCollectionAdminPage

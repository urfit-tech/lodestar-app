import { Icon } from '@chakra-ui/icons'
import { Skeleton, Typography } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
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
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={BookIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.content.practiceManagement)}</span>
      </Typography.Title>
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

const PracticeCollectionBlock: React.FC<{
  memberId: string
  selectedProgramId: string
}> = ({ memberId, selectedProgramId }) => {
  const { formatMessage } = useIntl()
  const { loadingPracticeCollection, errorPracticeCollection, practiceCollection } = usePracticeCollection({
    memberId,
    programId: selectedProgramId === 'all' ? undefined : selectedProgramId,
  })
  if (loadingPracticeCollection) {
    return <Skeleton active />
  }

  if (errorPracticeCollection || !practiceCollection) {
    return <div>{formatMessage(commonMessages.status.readingError)}</div>
  }
  return (
    <div className="row">
      {practiceCollection.length ? (
        practiceCollection.map((v: any) => (
          <div key={v.id} className="col-12 col-lg-3 mb-4">
            <PracticeAdminCard
              id={v.id}
              title={v.title}
              coverUrl={v.coverUrl}
              memberId={v.memberId}
              suggestCount={v.suggestCount}
              reactedMemberIds={v.reactedMemberIds}
              reactedMemberIdsCount={v.reactedMemberIdsCount}
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

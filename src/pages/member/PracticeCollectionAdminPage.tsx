import { Icon } from '@chakra-ui/icons'
import { Typography } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { useAuth } from '../../components/auth/AuthContext'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import PracticeAdminCard from '../../components/practice/PracticeAdminCard'
import { EnrolledProgramSelector } from '../../components/program/ProgramSelector'
import { commonMessages } from '../../helpers/translation'
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
}> = () => {
  // FIXME: Fake data
  const practiceCollection = new Array(11).fill({
    id: 'practiceId',
    coverUrl: null,
    title: 'title title title title title title title title title title title title title title',
    memberId: '8cc92266-3c88-4860-b347-2e6a6cf3e8dd',
    suggestCount: 20,
    reactedMemberIds: ['Amy', 'Ben', 'Ken'],
    reactedMemberIdsCount: 10,
  })

  return (
    <div className="row">
      {practiceCollection.map(v => (
        <div key={v.id} className="col-12 col-lg-3 mb-3">
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
      ))}
    </div>
  )
}

export default PracticeCollectionAdminPage

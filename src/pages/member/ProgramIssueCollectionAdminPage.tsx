import { gql, useQuery } from '@apollo/client'
import { Select, SkeletonText } from '@chakra-ui/react'
import { Checkbox } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import IssueAdminCard from '../../components/issue/IssueAdminCard'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { EnrolledProgramSelector } from '../../components/program/ProgramSelector'
import hasura from '../../hasura'
import { commonMessages, productMessages } from '../../helpers/translation'
import { ReactComponent as BookIcon } from '../../images/book.svg'

const ProgramIssueCollectionAdminPage = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const [selectedProgramId, setSelectedProgramId] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('unsolved')
  const [allowOthersIssue, setAllowOthersIssue] = useState(false)

  return (
    <MemberAdminLayout
      content={{ icon: BookIcon, title: formatMessage(productMessages.program.content.programProblem) }}
    >
      <div className="row no-gutters mb-4">
        <div className="col-12 col-sm-2 pr-sm-3 mb-3 mb-sm-0">
          <Select
            bg="white"
            style={{ width: '100%' }}
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
          >
            <option key="unsolved">{formatMessage(commonMessages.form.option.unsolved)}</option>
            <option key="solved">{formatMessage(commonMessages.form.option.solved)}</option>
            <option key="all">{formatMessage(commonMessages.form.option.all)}</option>
          </Select>
        </div>
        <div className="col-12 col-sm-8 pr-sm-3 mb-3 mb-sm-0">
          {currentMemberId && (
            <EnrolledProgramSelector
              value={selectedProgramId}
              memberId={currentMemberId}
              onChange={key => setSelectedProgramId(key)}
            />
          )}
        </div>
        <div className="col-12 col-sm-2 d-flex align-items-center">
          <Checkbox onChange={e => setAllowOthersIssue(e.target.checked)}>
            {formatMessage(commonMessages.checkbox.viewAllQuestion)}
          </Checkbox>
        </div>
      </div>

      {currentMemberId && (
        <AllProgramIssueCollectionBlock
          memberId={currentMemberId}
          selectedProgramId={selectedProgramId}
          selectedStatus={selectedStatus}
          allowOthersIssue={allowOthersIssue}
        />
      )}
    </MemberAdminLayout>
  )
}

const AllProgramIssueCollectionBlock: React.VFC<{
  memberId: string
  selectedProgramId: string
  selectedStatus: string
  allowOthersIssue?: boolean
}> = ({ memberId, selectedProgramId, selectedStatus, allowOthersIssue }) => {
  const { id: appId } = useApp()
  const { formatMessage } = useIntl()
  let unsolved: boolean | undefined
  switch (selectedStatus) {
    case 'unsolved':
      unsolved = true
      break
    case 'solved':
      unsolved = false
      break
    default:
      unsolved = undefined
      break
  }

  const { loading, error, data, refetch } = useQuery<
    hasura.GET_MEMBER_PROGRAM_ISSUES,
    hasura.GET_MEMBER_PROGRAM_ISSUESVariables
  >(GET_MEMBER_PROGRAM_ISSUES, {
    variables: {
      memberId: memberId,
      appId,
      threadIdLike: selectedProgramId === 'all' ? undefined : `/programs/${selectedProgramId}/contents/%`,
      unsolved,
    },
    fetchPolicy: 'no-cache',
  })

  return (
    <div>
      {loading || !data ? (
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      ) : error ? (
        formatMessage(commonMessages.status.programError)
      ) : !data.issue || data.issue.length === 0 ? (
        formatMessage(commonMessages.status.noProgramError)
      ) : (
        data.issue
          .filter(value => (allowOthersIssue ? true : value.member_id === memberId))
          .map(value => {
            const [, , programId] = value.thread_id.split('/')
            return (
              <IssueAdminCard
                key={value.id}
                threadId={value.thread_id}
                programId={programId}
                issueId={value.id}
                title={value.title}
                description={value.description}
                reactedMemberIds={value.issue_reactions.map((value: any) => value.member_id)}
                numReplies={value.issue_replies_aggregate.aggregate?.count || 0}
                createdAt={new Date(value.created_at)}
                memberId={value.member_id}
                solvedAt={value.solved_at && new Date(value.solved_at)}
                onRefetch={refetch}
              />
            )
          })
          .flat()
      )}
    </div>
  )
}

const GET_MEMBER_PROGRAM_ISSUES = gql`
  query GET_MEMBER_PROGRAM_ISSUES($appId: String!, $threadIdLike: String, $unsolved: Boolean, $memberId: String) {
    issue(
      where: {
        app_id: { _eq: $appId }
        thread_id: { _like: $threadIdLike }
        solved_at: { _is_null: $unsolved }
        issue_enrollment: { program: { program_content_enrollments: { member_id: { _eq: $memberId } } } }
      }
      order_by: [
        { created_at: desc }
        # { issue_reactions_aggregate: { count: desc } }
      ]
    ) {
      id
      title
      thread_id
      description
      solved_at
      created_at
      member_id
      issue_reactions {
        member_id
      }
      issue_replies_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export default ProgramIssueCollectionAdminPage

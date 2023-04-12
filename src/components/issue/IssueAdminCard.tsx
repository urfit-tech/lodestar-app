import { useMutation } from '@apollo/client'
import { Button, Checkbox, Modal } from 'antd'
import { CardProps } from 'antd/lib/card'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { commonMessages, issueMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import AdminCard from '../common/AdminCard'
import IssueItem from './IssueItem'

const StyledAdminCard = styled(AdminCard)`
  position: relative;

  .mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: pointer;
    content: '';
    z-index: 998;
  }
`
const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 999;
`

type IssueAdminCardProps = CardProps & {
  threadId: string
  programId: string
  issueId: string
  title: string
  description: string
  reactedMemberIds: string[]
  numReplies: number
  createdAt: Date
  memberId: string
  solvedAt: Date
  onRefetch?: () => void
}
const IssueAdminCard: React.VFC<IssueAdminCardProps> = ({
  threadId,
  programId,
  issueId,
  title,
  description,
  reactedMemberIds,
  numReplies,
  createdAt,
  memberId,
  solvedAt,
  onRefetch,
  ...cardProps
}) => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { program } = useProgram(programId)
  const [updateIssueStatus] = useMutation<hasura.UPDATE_ISSUE_STATUS, hasura.UPDATE_ISSUE_STATUSVariables>(
    UPDATE_ISSUE_STATUS,
  )

  const [solved, setSolved] = useState(!!solvedAt)
  const [modalVisible, setModalVisible] = useState(false)

  const programTitle = program ? program.title || formatMessage(issueMessages.title.program) : ''

  return (
    <>
      <StyledAdminCard className="mb-3" {...cardProps}>
        <IssueItem
          programRoles={program?.roles || []}
          issueId={issueId}
          title={title}
          description={description}
          reactedMemberIds={reactedMemberIds}
          numReplies={numReplies}
          createdAt={createdAt}
          memberId={memberId}
          solvedAt={solvedAt}
          onRefetch={onRefetch}
          showSolvedCheckbox
        />

        <div className="mask" onClick={() => setModalVisible(true)} />

        {currentMemberId === memberId ||
          (program?.roles.some(
            role => role.memberId === currentMemberId && (role.name === 'instructor' || role.name === 'assistant'),
          ) && (
            <StyledCheckbox
              checked={solved}
              onChange={e => {
                const updatedSolved = e.target.checked
                updateIssueStatus({
                  variables: {
                    issueId,
                    solvedAt: updatedSolved ? new Date() : null,
                  },
                }).then(() => {
                  setSolved(updatedSolved)
                  onRefetch && onRefetch()
                })
              }}
            >
              {solvedAt ? formatMessage(commonMessages.status.unsolved) : formatMessage(commonMessages.status.solving)}
            </StyledCheckbox>
          ))}
      </StyledAdminCard>

      <Modal
        footer={null}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={
          <div>
            <span>{programTitle}</span>
            <Button type="link" onClick={() => window.open(threadId)}>
              {formatMessage(commonMessages.button.viewCourse)}
            </Button>
          </div>
        }
      >
        <IssueItem
          programRoles={program?.roles || []}
          issueId={issueId}
          title={title}
          description={description}
          reactedMemberIds={reactedMemberIds}
          numReplies={numReplies}
          createdAt={createdAt}
          memberId={memberId}
          solvedAt={solvedAt}
          onRefetch={onRefetch}
          defaultRepliesVisible
        />
      </Modal>
    </>
  )
}

const UPDATE_ISSUE_STATUS = gql`
  mutation UPDATE_ISSUE_STATUS($issueId: uuid!, $solvedAt: timestamptz) {
    update_issue(where: { id: { _eq: $issueId } }, _set: { solved_at: $solvedAt }) {
      affected_rows
    }
  }
`

export default IssueAdminCard

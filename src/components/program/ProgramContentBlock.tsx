import { Skeleton, Tabs } from 'antd'
import BraftEditor from 'braft-editor'
import { flatten } from 'ramda'
import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import { productMessages, programMessages } from '../../helpers/translation'
import { usePublicMember } from '../../hooks/member'
import { useProgramContent } from '../../hooks/program'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps, ProgramRoleProps } from '../../types/program'
import CreatorCard from '../common/CreatorCard'
import { BraftContent } from '../common/StyledBraftEditor'
import IssueThreadBlock from '../issue/IssueThreadBlock'
import ProgramContentMaterialBlock from './ProgramContentMaterialBlock'
import ProgramContentPlayer from './ProgramContentPlayer'

const StyledContentBlock = styled.div`
  padding: 1.25rem;
  background-color: white;
`
const StyledTitle = styled.h3`
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #e8e8e8;
  font-size: 20px;
`

const ProgramContentBlock: React.FC<{
  program: ProgramProps & {
    roles: ProgramRoleProps[]
    contentSections: (ProgramContentSectionProps & { contents: ProgramContentProps[] })[]
  }
  programContentId: string
}> = ({ program, programContentId }) => {
  const { formatMessage } = useIntl()
  const { programContentProgress, refetchProgress, insertProgress } = useContext(ProgressContext)
  const { loadingProgramContent, programContent } = useProgramContent(programContentId)

  const instructor = program.roles.filter(role => role.name === 'instructor')[0]
  const { loadingMember, member } = usePublicMember(instructor?.memberId || '')

  const programContentBodyType = programContent?.programContentBody?.type
  const initialProgress =
    programContentProgress.find(progress => progress.programContentId === programContentId)?.progress || 0

  const nextProgramContent = flatten(program.contentSections.map(v => v.contents)).find(
    (_, i, contents) => contents[i - 1]?.id === programContentId,
  )

  useEffect(() => {
    if (!loadingProgramContent && programContentBodyType !== 'video' && insertProgress) {
      insertProgress(programContentId, {
        progress: 1,
        lastProgress: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProgramContent, programContentBodyType, programContentId])

  if (!programContent || !insertProgress || !refetchProgress) {
    return <Skeleton active />
  }

  return (
    <div id="program_content_block" className="pt-4 p-sm-4">
      {!programContent.programContentBody && formatMessage(productMessages.program.content.unpurchased)}

      {programContent.programContentBody?.type === 'video' && (
        <ProgramContentPlayer
          programContentId={programContent.id}
          programContentBody={programContent.programContentBody}
          nextProgramContent={nextProgramContent}
          lastProgress={
            programContentProgress.find(progress => progress.programContentId === programContentId)?.lastProgress || 0
          }
          onProgress={({ played }) => {
            const currentProgress = Math.ceil(played * 20) / 20 // every 5% as a tick
            insertProgress(programContentId, {
              progress: currentProgress > 1 ? 1 : currentProgress > initialProgress ? currentProgress : initialProgress,
              lastProgress: played,
            }).then(() => refetchProgress())
          }}
          onEnded={() => {
            setTimeout(() => {
              insertProgress(programContentId, {
                progress: 1,
                lastProgress: 1,
              })
            }, 3000)
          }}
        />
      )}

      <StyledContentBlock className="mb-3">
        <StyledTitle className="mb-4 text-center">{programContent.title}</StyledTitle>

        {programContent.programContentBody &&
          !BraftEditor.createEditorState(programContent.programContentBody.description).isEmpty() && (
            <BraftContent>{programContent.programContentBody.description}</BraftContent>
          )}
      </StyledContentBlock>

      <div className="mb-3">
        {loadingMember ? (
          <Skeleton active avatar />
        ) : member ? (
          <CreatorCard
            id={member.id}
            avatarUrl={member.pictureUrl}
            title={member.name || member.username}
            labels={[{ id: 'instructor', name: 'instructor' }]}
            jobTitle={member.title}
            description={member.abstract}
            withProgram
            withPodcast
            withAppointment
            withBlog
          />
        ) : null}
      </div>

      {program.isIssuesOpen && (
        <StyledContentBlock>
          <Tabs defaultActiveKey="issue">
            <Tabs.TabPane tab={formatMessage(productMessages.program.tab.discussion)} key="issue" className="py-3">
              <IssueThreadBlock
                programRoles={program.roles || []}
                threadId={`/programs/${program.id}/contents/${programContentId}`}
              />
            </Tabs.TabPane>
            {programContent.materials.length !== 0 && (
              <Tabs.TabPane key="materials" tab={formatMessage(programMessages.tab.downloadMaterials)} className="py-3">
                {<ProgramContentMaterialBlock programContentId={programContentId} />}
              </Tabs.TabPane>
            )}
          </Tabs>
        </StyledContentBlock>
      )}
    </div>
  )
}

export default ProgramContentBlock

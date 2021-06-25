import { Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import IssueThreadBlock from '../../components/issue/IssueThreadBlock'
import PracticeDisplayedCollection from '../../components/practice/PracticeDisplayedCollection'
import ProgramContentMaterialBlock from '../../components/program/ProgramContentMaterialBlock'
import { useApp } from '../../containers/common/AppContext'
import { programMessages } from '../../helpers/translation'
import {
  ProgramContentAttachmentProps,
  ProgramContentBodyProps,
  ProgramContentMaterialProps,
  ProgramContentProps,
  ProgramProps,
  ProgramRoleProps,
} from '../../types/program'
import { StyledContentBlock } from './index.styled'

const ProgramContentTabs: React.VFC<{
  program: ProgramProps & { roles: ProgramRoleProps[] }
  programContent: ProgramContentProps & {
    programContentBody: ProgramContentBodyProps | null
    materials: ProgramContentMaterialProps[]
    attachments: ProgramContentAttachmentProps[]
  }
}> = ({ program, programContent }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const [activeKey, setActiveKey] = useState('issue')

  const isIssueThreadVisible = program.isIssuesOpen
  const isPracticesVisible = enabledModules.practice && programContent.programContentBody?.type === 'practice'
  const isMaterialVisible = programContent.materials.length !== 0

  useEffect(() => {
    if (isPracticesVisible) {
      setActiveKey('practice')
    } else if (isMaterialVisible) {
      setActiveKey('material')
    } else {
      setActiveKey('issue')
    }
  }, [isMaterialVisible, isPracticesVisible])

  if (!isIssueThreadVisible && !isPracticesVisible && !isMaterialVisible) {
    return null
  }

  return (
    <StyledContentBlock className="mb-3">
      <Tabs
        defaultActiveKey={isPracticesVisible ? 'practice' : isMaterialVisible ? 'material' : 'issue'}
        activeKey={activeKey}
        onChange={key => setActiveKey(key)}
      >
        {isIssueThreadVisible && (
          <Tabs.TabPane tab={formatMessage(programMessages.label.discussion)} key="issue" className="py-3">
            <IssueThreadBlock
              programRoles={program.roles || []}
              threadId={`/programs/${program.id}/contents/${programContent.id}`}
            />
          </Tabs.TabPane>
        )}

        {isPracticesVisible && (
          <Tabs.TabPane tab={formatMessage(programMessages.label.practiceUpload)} key="practice" className="p-4">
            <PracticeDisplayedCollection
              isPrivate={programContent.metadata?.private || false}
              programContentId={programContent.id}
            />
          </Tabs.TabPane>
        )}

        {isMaterialVisible && (
          <Tabs.TabPane key="material" tab={formatMessage(programMessages.tab.downloadMaterials)} className="py-3">
            {<ProgramContentMaterialBlock programContentId={programContent.id} />}
          </Tabs.TabPane>
        )}
      </Tabs>
    </StyledContentBlock>
  )
}

export default ProgramContentTabs

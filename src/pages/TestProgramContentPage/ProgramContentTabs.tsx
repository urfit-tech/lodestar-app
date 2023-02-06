import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import IssueThreadBlock from '../../components/issue/IssueThreadBlock'
import PracticeDisplayedCollection from '../../components/practice/PracticeDisplayedCollection'
import ProgramContentMaterialBlock from '../../components/program/ProgramContentMaterialBlock'
import { programMessages } from '../../helpers/translation'
import {
  ProgramContent,
  ProgramContentAttachmentProps,
  ProgramContentBodyProps,
  ProgramContentMaterialProps,
  ProgramRole,
} from '../../types/program'
import { StyledContentBlock } from './index.styled'

export const StyledTabList = styled(TabList)`
  && {
    padding-bottom: 1px;
    border-bottom: 1px solid var(--gray);
  }
`

export const StyledTabPanel = styled(TabPanel)`
  && {
    padding: 24px 0;
  }
`

const ProgramContentTabs: React.VFC<{
  programId: string
  programRoles: ProgramRole[]
  programContent: ProgramContent & {
    programContentBody: ProgramContentBodyProps | null
    materials: ProgramContentMaterialProps[]
    attachments: ProgramContentAttachmentProps[]
  }
  issueEnabled?: boolean
}> = ({ programId, programRoles, programContent, issueEnabled = false }) => {
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const [activeKey, setActiveKey] = useState('issue')

  const isIssueThreadVisible = issueEnabled
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
  const tabContents: {
    key: string
    name: string
    isVisible: boolean
    content: React.ReactElement
  }[] = [
    {
      key: 'issue',
      name: formatMessage(programMessages.label.discussion),
      isVisible: isIssueThreadVisible,
      content: (
        <IssueThreadBlock
          programRoles={programRoles}
          threadId={`/programs/${programId}/contents/${programContent.id}`}
        />
      ),
    },
    {
      key: 'practice',
      name: formatMessage(programMessages.label.practiceUpload),
      isVisible: !!isPracticesVisible,
      content: (
        <PracticeDisplayedCollection
          isPrivate={programContent.metadata?.private || false}
          programContentId={programContent.id}
        />
      ),
    },
    {
      key: 'material',
      name: formatMessage(programMessages.tab.downloadMaterials),
      isVisible: isMaterialVisible,
      content: <ProgramContentMaterialBlock programContentId={programContent.id} />,
    },
  ].filter(v => v.isVisible)

  return (
    <StyledContentBlock className="mb-3">
      <Tabs colorScheme="primary" index={tabContents.findIndex(v => v.key === activeKey)}>
        <StyledTabList>
          {tabContents.map(v => (
            <Tab key={v.key} onClick={() => setActiveKey(v.key)}>
              {v.name}
            </Tab>
          ))}
        </StyledTabList>
        <TabPanels>
          {tabContents.map(v => (
            <StyledTabPanel key={v.key}>{v.content}</StyledTabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </StyledContentBlock>
  )
}

export default ProgramContentTabs

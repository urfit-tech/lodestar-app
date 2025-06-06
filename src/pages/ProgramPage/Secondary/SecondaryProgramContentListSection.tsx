import { Collapse, IconButton } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { productMessages } from '../../../helpers/translation'
import {
  contentTitleCollapsedType,
  Program,
  ProgramContent,
  ProgramContentSection,
  ProgramContentSectionType,
} from '../../../types/program'
import SecondaryProgramContentListItem from './SecondaryProgramContentListItem'

const ProgramSectionBlock = styled.div`
  height: 100%;
  margin-bottom: 1rem;
`
const ProgramSectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
`

const StyleAllCollapsed = styled.div`
  text-align: end;
  font-size: 14px;
  font-color: #9b9b9b;
  cursor: pointer;
`

const checkAllCollapsed = (contentTitleCollapsed: contentTitleCollapsedType): boolean => {
  return Object.values(contentTitleCollapsed).every(val => val.isCollapsed === true)
}

const getCollapsedSection = (contentTitleCollapsed: contentTitleCollapsedType, propName: string): boolean => {
  return contentTitleCollapsed.hasOwnProperty(propName) && contentTitleCollapsed[propName].isCollapsed
}

const getPinnedContent = (contentTitleCollapsed: contentTitleCollapsedType, propName: string): boolean => {
  return contentTitleCollapsed.hasOwnProperty(propName) && contentTitleCollapsed[propName].isAllPinned
}

const checkAllPinned = (contentTitleCollapsed: contentTitleCollapsedType): boolean => {
  return Object.values(contentTitleCollapsed).every(val => val.isAllPinned === true)
}

const transformProgramContentSections = (
  sections: (ProgramContentSection & {
    contents: ProgramContent[] & {
      programId?: string | undefined
      contentSectionTitle?: string | undefined
    }
  })[],
) => {
  return sections.reduce((acc: contentTitleCollapsedType, sec) => {
    const isAllPinned = sec.contents.every(content => content.pinnedStatus)

    acc[sec.id] = {
      isCollapsed: isAllPinned ? true : sec.collapsedStatus,
      isAllPinned: isAllPinned,
    }

    return acc
  }, {})
}

const SecondaryProgramContentListSection: React.FC<{
  program: Program & ProgramContentSectionType
  programContentSections: (ProgramContentSection & {
    contents: ProgramContent[] & {
      programId?: string | undefined
      contentSectionTitle?: string | undefined
    }
  })[]
  isEquityProgram: boolean
}> = ({ program, programContentSections, isEquityProgram }) => {
  const { formatMessage } = useIntl()
  const [contentTitleCollapsed, setContentTitleCollapsed] = useState<contentTitleCollapsedType>({})
  const [allCollapsed, setAllCollapsed] = useState(checkAllCollapsed(contentTitleCollapsed))

  useEffect(() => {
    setContentTitleCollapsed(transformProgramContentSections(programContentSections))
  }, [programContentSections])

  const handleToggleAllCollapsed = () => {
    setContentTitleCollapsed(
      Object.fromEntries(
        Object.entries(contentTitleCollapsed).map(([key, value]) => [
          key,
          { ...value, isCollapsed: value.isAllPinned === false ? !allCollapsed : value.isCollapsed },
        ]),
      ),
    )
    setAllCollapsed(!allCollapsed)
  }

  const handleToggleContentCollapsed = (propName: string) => {
    const newContentTitleCollapsed = {
      ...contentTitleCollapsed,
      [propName]: {
        ...contentTitleCollapsed[propName],
        isCollapsed: !contentTitleCollapsed[propName].isCollapsed,
      },
    }
    setContentTitleCollapsed(newContentTitleCollapsed)
    setAllCollapsed(checkAllCollapsed(newContentTitleCollapsed))
  }

  return (
    <>
      {programContentSections.some(programContentSection => programContentSection.contents.length > 0) && (
        <>
          {!checkAllPinned(contentTitleCollapsed) && (
            <StyleAllCollapsed onClick={() => !checkAllPinned(contentTitleCollapsed) && handleToggleAllCollapsed()}>
              {allCollapsed
                ? formatMessage(productMessages.program.content.collapseAll)
                : formatMessage(productMessages.program.content.expandAll)}
              <IconButton
                icon={<FaChevronDown style={{ transform: allCollapsed ? 'rotate(0deg)' : 'rotate(270deg)' }} />}
                aria-label="Rotate Icon"
                variant="ghost"
              />
            </StyleAllCollapsed>
          )}
          {programContentSections.map(programContentSection => (
            <ProgramSectionBlock key={programContentSection.id}>
              {programContentSection.contents.length > 0 && (
                <>
                  <ProgramSectionTitle>
                    {programContentSection.title}
                    {!getPinnedContent(contentTitleCollapsed, programContentSection.id) && (
                      <IconButton
                        icon={
                          <div>
                            <FaChevronDown
                              height={16}
                              style={{
                                transform: !!getCollapsedSection(contentTitleCollapsed, programContentSection.id)
                                  ? 'rotate(0deg)'
                                  : 'rotate(270deg)',
                              }}
                            />
                          </div>
                        }
                        aria-label="Rotate Icon"
                        variant="ghost"
                        onClick={() => handleToggleContentCollapsed(programContentSection.id)}
                      />
                    )}
                  </ProgramSectionTitle>

                  {programContentSection.contents.map(item => {
                    return (
                      <React.Fragment key={`${item.id}${item.title}`}>
                        <Collapse
                          in={
                            !!getCollapsedSection(contentTitleCollapsed, programContentSection.id) &&
                            !getPinnedContent(contentTitleCollapsed, programContentSection.id)
                          }
                          transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}
                        >
                          <SecondaryProgramContentListItem
                            item={item}
                            isPinned={false}
                            program={program}
                            isEquityProgram={isEquityProgram}
                          />
                        </Collapse>
                        {(!getCollapsedSection(contentTitleCollapsed, programContentSection.id) ||
                          !!getPinnedContent(contentTitleCollapsed, programContentSection.id)) &&
                          item.pinnedStatus && (
                            <SecondaryProgramContentListItem
                              item={item}
                              isPinned={true}
                              program={program}
                              isEquityProgram={isEquityProgram}
                            />
                          )}
                      </React.Fragment>
                    )
                  })}
                </>
              )}
            </ProgramSectionBlock>
          ))}
        </>
      )}
    </>
  )
}

export default SecondaryProgramContentListSection

import { AttachmentIcon, CheckIcon, Icon } from '@chakra-ui/icons'
import { Select } from '@chakra-ui/react'
import { Card } from 'antd'
import { flatten, sum } from 'ramda'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineVideoCamera, AiOutlinePlaySquare } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import { dateFormatter, durationFormatter, rgba } from '../../helpers'
import { productMessages } from '../../helpers/translation'
import { useProgramContentBody } from '../../hooks/program'
import { ReactComponent as PracticeIcon } from '../../images/practice-icon.svg'
import { ReactComponent as QuizIcon } from '../../images/quiz.svg'
import { Program, ProgramContent, ProgramContentSection } from '../../types/program'

const StyledIcon = styled(Icon)`
  font-size: 16px;
`
const StyledProgramContentMenu = styled.div`
  background: white;
  font-size: 14px;
`
const StyledHead = styled.div`
  padding: 1.25rem;
`
const StyledSelectBlock = styled.div`
  .ant-select-selection--single {
    height: 32px;
  }
  .ant-select-selection-selected-value {
    padding-right: 0.5rem;
    font-size: 14px;
  }
  .ant-select-selection__rendered {
    line-height: 32px;
  }
`
const StyledContentSection = styled.div`
  border-top: 1px solid #ececec;
`
const StyledContentSectionTitle = styled.div`
  padding: 1.25rem;
  padding-right: 0.75rem;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`
const StyledContentSectionBody = styled.div<{ active?: boolean }>`
  overflow: hidden;
  height: ${props => (props.active ? '100%' : '0')};
  /* not working */
  /* transition: all 0.3s ease-out; */
`
const StyledProgressLabel = styled.span<{ active?: boolean }>`
  padding: 0 0.5rem;
  border-radius: 11px;
  background-color: ${props => (props.active ? rgba(props.theme['@primary-color'], 0.1) : 'var(--gray-lighter)')};
  color: ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray-dark)')};
  font-size: 12px;
  font-weight: normal;
  letter-spacing: 0.6px;
  line-height: 22px;
`
const StyledItemTitle = styled.div`
  color: #585858;
  font-size: 14px;
`
const StyledIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 12px;
  width: 20px;
  height: 20px;
  border: 1px solid transparent;
  border-radius: 50%;
  text-align: center;
  font-size: 10px;
  line-height: 20px;
`
const StyledItem = styled.div`
  position: relative;
  padding: 0.75rem 2rem;
  padding-right: 4rem;
  color: #9b9b9b;
  font-size: 12px;
  cursor: pointer;

  &.active {
    background: ${props => rgba(props.theme['@primary-color'], 0.1)};
    color: ${props => props.theme['@primary-color']};
  }
  &.unread ${StyledIconWrapper} {
    border-color: #cdcdcd;
    color: transparent;
  }
  &.half ${StyledIconWrapper} {
    background: #cdcdcd;
    color: #9b9b9b;
  }
  &.done ${StyledIconWrapper} {
    background: ${props => props.theme['@primary-color']};
    color: white;
  }
`
const messages = defineMessages({
  materialAmount: { id: 'program.content.materialAmount', defaultMessage: '{amount}個檔案' },
  totalQuestion: { id: 'program.content.totalAmount', defaultMessage: '共 {count} 題' },
})

const ProgramContentMenu: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
  onSelect?: (programContentId: string) => void
}> = ({ program, onSelect }) => {
  const { formatMessage } = useIntl()
  const [sortBy, setSortBy] = useState('section')
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const programPackageId = query.get('back')

  return (
    <StyledProgramContentMenu>
      <StyledHead className="d-flex justify-content-between align-items-center">
        <span>{formatMessage(productMessages.program.content.programList)}</span>
        <StyledSelectBlock>
          <Select size="default" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="section">{formatMessage(productMessages.program.select.option.unit)}</option>
            <option value="date">{formatMessage(productMessages.program.select.option.time)}</option>
          </Select>
        </StyledSelectBlock>
      </StyledHead>

      {sortBy === 'section' && (
        <ProgramContentSectionMenu program={program} programPackageId={programPackageId} onSelect={onSelect} />
      )}
      {sortBy === 'date' && (
        <ProgramContentDateMenu program={program} programPackageId={programPackageId} onSelect={onSelect} />
      )}
    </StyledProgramContentMenu>
  )
}

const ProgramContentSectionMenu: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
  programPackageId: string | null
  onSelect?: (programContentId: string) => void
}> = ({ program, programPackageId, onSelect }) => {
  const { programContentId } = useParams<{ programContentId?: string }>()

  if (!program.contentSections || program.contentSections.length === 0) {
    return <EmptyMenu />
  }

  return (
    <>
      {program.contentSections.map((v, i) => (
        <ContentSection
          key={v.id}
          defaultCollapse={programContentId ? v.contents.some(w => w.id === programContentId) : i === 0}
          programContentSection={v}
          programPackageId={programPackageId}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

const ContentSection: React.VFC<{
  programContentSection: ProgramContentSection & {
    contents: ProgramContent[]
  }
  programPackageId: string | null
  defaultCollapse?: boolean
  onSelect?: (programContentId: string) => void
}> = ({ programContentSection, programPackageId, defaultCollapse, onSelect }) => {
  const programContentProgress = useProgramContentProgress()
  const [isCollapse, setIsCollapse] = useState(defaultCollapse)

  const contentProgress =
    programContentProgress?.filter(progress => progress.programContentSectionId === programContentSection.id) || []
  const sectionProgress = contentProgress.length
    ? Math.floor((sum(contentProgress.map(progress => progress.progress)) * 100) / contentProgress.length)
    : 0

  return (
    <StyledContentSection key={programContentSection.id}>
      <StyledContentSectionTitle
        className="d-flex justify-content-between align-items-center"
        onClick={() => setIsCollapse(!isCollapse)}
      >
        <span>{programContentSection.title}</span>
        <StyledProgressLabel active={sectionProgress === 100}>{sectionProgress}%</StyledProgressLabel>
      </StyledContentSectionTitle>

      <StyledContentSectionBody active={isCollapse}>
        {programContentSection.contents?.map(programContent => (
          <SortBySectionItem
            key={programContent.id}
            programContent={programContent}
            progress={contentProgress.find(progress => progress.programContentId === programContent.id)?.progress || 0}
            programPackageId={programPackageId}
            onSetIsCollapse={setIsCollapse}
            onClick={() => onSelect?.(programContent.id)}
          />
        ))}
      </StyledContentSectionBody>
    </StyledContentSection>
  )
}

const SortBySectionItem: React.VFC<{
  programContent: ProgramContent
  progress: number
  programPackageId: string | null
  onSetIsCollapse?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  onClick?: () => void
}> = ({ programContent, progress, programPackageId, onSetIsCollapse, onClick }) => {
  const currentRef = useRef<HTMLInputElement>(null)
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId?: string
  }>()
  const progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'

  const isActive = programContent.id === programContentId
  useEffect(() => {
    if (isActive) {
      onSetIsCollapse?.(true)
    }
  }, [isActive, onSetIsCollapse])

  useEffect(() => {
    isActive && currentRef.current?.scrollIntoView()
  }, [isActive])

  return (
    <StyledItem
      ref={currentRef}
      className={`${progressStatus} ${isActive ? 'active' : ''}`}
      onClick={() => {
        onClick?.()
        history.push(
          `/programs/${programId}/contents/${programContent.id}${programPackageId ? `?back=${programPackageId}` : ''}`,
        )
      }}
    >
      <StyledItemTitle className="mb-2">{programContent.title}</StyledItemTitle>

      <StyledIconWrapper>
        <Icon as={CheckIcon} />
      </StyledIconWrapper>

      <div className="d-flex">
        <div className="mr-3 d-flex justify-content-center">
          {programContent.contentType === 'video' ? (
            <>
              <StyledIcon as={AiOutlineVideoCamera} className="mr-2" />
              <span>{durationFormatter(programContent.duration)}</span>
            </>
          ) : programContent.contentType === 'practice' ? (
            <StyledIcon as={PracticeIcon} className="mr-2" />
          ) : programContent.contentType === 'exercise' ? (
            <ExerciseQuestionCount contentBodyId={programContent.contentBodyId} />
          ) : (
            // <StyledIcon as={AiOutlineFileText} />
            <StyledIcon as={AiOutlinePlaySquare} />
          )}
        </div>
        {programContent.materials && programContent?.materials.length !== 0 && (
          <div>
            <StyledIcon as={AttachmentIcon} className="mr-2" />
            {formatMessage(messages.materialAmount, { amount: programContent?.materials.length })}
          </div>
        )}
      </div>
    </StyledItem>
  )
}

const ProgramContentDateMenu: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
  programPackageId: string | null
  onSelect?: (programContentId: string) => void
}> = ({ program, programPackageId, onSelect }) => {
  const programContentProgress = useProgramContentProgress()
  const programContents = flatten(program.contentSections.map(programContentSection => programContentSection.contents))

  if (programContents.length === 0) {
    return <EmptyMenu />
  }

  return (
    <div>
      {programContents.map(programContent => (
        <SortByDateItem
          key={programContent.id}
          programContent={programContent}
          progress={
            programContentProgress?.find(progress => progress.programContentId === programContent.id)?.progress || 0
          }
          programPackageId={programPackageId}
          onClick={() => onSelect && onSelect(programContent.id)}
        />
      ))}
    </div>
  )
}

const SortByDateItem: React.VFC<{
  programContent: ProgramContent
  progress: number
  programPackageId: string | null
  onClick?: () => void
}> = ({ programContent, progress, programPackageId, onClick }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId?: string
  }>()
  const progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'

  return (
    <StyledItem
      className={`${progressStatus} ${programContent.id === programContentId ? 'active' : ''}`}
      onClick={() => {
        onClick?.()
        history.push(
          `/programs/${programId}/contents/${programContent.id}${
            programPackageId !== null ? `?back=${programPackageId}` : ''
          }`,
        )
      }}
    >
      <StyledItemTitle className="mb-3">{programContent.title}</StyledItemTitle>

      <StyledIconWrapper>
        <Icon as={CheckIcon} />
      </StyledIconWrapper>

      <div>
        {/* <StyledIcon as={AiOutlineCalendar} className="mr-2" /> */}
        <StyledIcon as={AiOutlinePlaySquare} className="mr-2" />
        {programContent.publishedAt && dateFormatter(programContent.publishedAt)}
      </div>
      {programContent.materials && programContent?.materials.length !== 0 && (
        <div className="mt-2">
          <StyledIcon as={AttachmentIcon} className="mr-2" />
          {formatMessage(messages.materialAmount, { amount: programContent?.materials.length })}
        </div>
      )}
    </StyledItem>
  )
}

const EmptyMenu: React.VFC = () => (
  <Card style={{ textAlign: 'center', color: '#9b9b9b' }}>初次購買還沒有新的內容喔～</Card>
)

const ExerciseQuestionCount: React.VFC<{ contentBodyId: string }> = ({ contentBodyId }) => {
  const { formatMessage } = useIntl()
  const { data: programContentBody } = useProgramContentBody(contentBodyId)
  const count = Array.isArray(programContentBody?.data?.questions) ? programContentBody?.data?.questions?.length : 0

  return (
    <>
      <StyledIcon as={QuizIcon} className="mr-2" />
      <span>{formatMessage(messages.totalQuestion, { count })}</span>
    </>
  )
}

const useProgramContentProgress = () => {
  const { programContentId } = useParams<{ programContentId: string }>()
  const { programContentProgress, refetchProgress } = useContext(ProgressContext)

  useEffect(() => {
    refetchProgress?.()
  }, [programContentId, refetchProgress])

  return programContentProgress
}

export default ProgramContentMenu

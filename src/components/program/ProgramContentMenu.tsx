import { Card, Icon, Select } from 'antd'
import { flatten, sum } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { ProgressContext } from '../../contexts/ProgressContext'
import { dateFormatter, durationFormatter, rgba } from '../../helpers'
import { productMessages } from '../../helpers/translation'
import { ProgramContentProps, ProgramContentSectionProps, ProgramProps } from '../../types/program'

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

const ProgramContentMenu: React.FC<{
  program: ProgramProps & {
    contentSections: (ProgramContentSectionProps & { contents: ProgramContentProps[] })[]
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
          <Select size="default" value={sortBy} onChange={(value: string) => setSortBy(value)}>
            <Select.Option value="section">{formatMessage(productMessages.program.select.option.unit)}</Select.Option>
            <Select.Option value="date">{formatMessage(productMessages.program.select.option.time)}</Select.Option>
          </Select>
        </StyledSelectBlock>
      </StyledHead>

      {sortBy === 'section' && (
        <ProgramContentMenuBySection program={program} programPackageId={programPackageId} onSelect={onSelect} />
      )}
      {sortBy === 'date' && (
        <ProgramContentMenuByDate program={program} programPackageId={programPackageId} onSelect={onSelect} />
      )}
    </StyledProgramContentMenu>
  )
}

const ProgramContentMenuBySection: React.FC<{
  program: ProgramProps & {
    contentSections: (ProgramContentSectionProps & { contents: ProgramContentProps[] })[]
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

const ContentSection: React.FC<{
  programContentSection: ProgramContentSectionProps & { contents: ProgramContentProps[] }
  programPackageId: string | null
  defaultCollapse?: boolean
  onSelect?: (programContentId: string) => void
}> = ({ programContentSection, programPackageId, defaultCollapse, onSelect }) => {
  const { programContentProgress } = useContext(ProgressContext)
  const [isCollapse, setIsCollapse] = useState(defaultCollapse)

  const contentProgress = programContentProgress.filter(
    progress => progress.programContentSectionId === programContentSection.id,
  )
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

const SortBySectionItem: React.FC<{
  programContent: ProgramContentProps
  progress: number
  programPackageId: string | null
  onSetIsCollapse?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  onClick?: () => void
}> = ({ programContent, progress, programPackageId, onSetIsCollapse, onClick }) => {
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

  return (
    <StyledItem
      className={`${progressStatus} ${isActive ? 'active' : ''}`}
      onClick={() => {
        onClick?.()
        history.push(
          `/programs/${programId}/contents/${programContent.id}${
            programPackageId !== null ? `?back=${programPackageId}` : ''
          }`,
        )
      }}
    >
      <StyledItemTitle className="mb-2">{programContent.title}</StyledItemTitle>

      <StyledIconWrapper>
        <Icon type="check" />
      </StyledIconWrapper>

      {programContent.contentType === 'video' ? (
        <div>
          <Icon type="video-camera" className="mr-2" />
          {durationFormatter(programContent.duration)}
        </div>
      ) : (
        <div>
          <Icon type="file-text" />
        </div>
      )}
    </StyledItem>
  )
}

const ProgramContentMenuByDate: React.FC<{
  program: ProgramProps & {
    contentSections: (ProgramContentSectionProps & { contents: ProgramContentProps[] })[]
  }
  programPackageId: string | null
  onSelect?: (programContentId: string) => void
}> = ({ program, programPackageId, onSelect }) => {
  const { programContentProgress } = useContext(ProgressContext)
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
            programContentProgress.find(progress => progress.programContentId === programContent.id)?.progress || 0
          }
          programPackageId={programPackageId}
          onClick={() => onSelect && onSelect(programContent.id)}
        />
      ))}
    </div>
  )
}

const SortByDateItem: React.FC<{
  programContent: ProgramContentProps
  progress: number
  programPackageId: string | null
  onClick?: () => void
}> = ({ programContent, progress, programPackageId, onClick }) => {
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
        <Icon type="check" />
      </StyledIconWrapper>

      <div>
        <Icon type="calendar" className="mr-2" />
        {programContent.publishedAt && dateFormatter(programContent.publishedAt)}
      </div>
    </StyledItem>
  )
}

const EmptyMenu: React.FC = () => (
  <Card style={{ textAlign: 'center', color: '#9b9b9b' }}>初次購買還沒有新的內容喔～</Card>
)

export default ProgramContentMenu

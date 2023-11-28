import { AttachmentIcon, CheckIcon, Icon } from '@chakra-ui/icons'
import { Select } from '@chakra-ui/react'
import { Card } from 'antd'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment-timezone'
import { flatten, sum } from 'ramda'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AiOutlineCalendar, AiOutlineFileText, AiOutlineVideoCamera } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import AudioPlayerContext from '../../contexts/AudioPlayerContext'
import { ProgressContext } from '../../contexts/ProgressContext'
import { dateFormatter, durationFormatter, rgba } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useExamExercise } from '../../hooks/exam'
import { usePracticeExist } from '../../hooks/practice'
import { useEnrolledProgramIds, useProgramContentBody, useProgramContentMaterial } from '../../hooks/program'
import { MicrophoneIcon } from '../../images'
import { ReactComponent as LockIcon } from '../../images/icon-lock.svg'
import { ReactComponent as PracticeIcon } from '../../images/practice-icon.svg'
import { ReactComponent as QuizIcon } from '../../images/quiz.svg'
import { useHasProgramContentPermission } from '../../pages/ProgramContentPage/ProgramContentBlock'
import { programContentProgress } from '../../types/exam'
import { DisplayModeEnum, Program, ProgramContent, ProgramContentSection } from '../../types/program'
import programMessages from './translation'

const StyledIcon = styled(Icon)`
  font-size: 16px;
`
const StyledProgramContentMenu = styled.div<{ visible: boolean }>`
  background: white;
  font-size: 14px;
  ${props => props.visible && 'margin-bottom: 80px;'}
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
    & ${StyledItemTitle} {
      color: ${props => props.theme['@primary-color']};
    }
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
  &.lock {
    opacity: 0.4;
    color: var(--gray-darker);
  }
`

const ProgramContentMenu: React.VFC<{
  isScrollToTop?: boolean
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
  onSelect?: (programContentId: string) => void
}> = ({ program, onSelect, isScrollToTop }) => {
  const { formatMessage } = useIntl()
  const [sortBy, setSortBy] = useState<'section' | 'date'>('section')
  const { search } = useLocation()
  const { currentMemberId } = useAuth()
  const { visible } = useContext(AudioPlayerContext)
  const query = new URLSearchParams(search)
  const programPackageId = query.get('back')
  const { enrolledProgramIds, loading: enrolledProgramIdsLoading } = useEnrolledProgramIds(currentMemberId || '')
  const isEnrolled = enrolledProgramIds.includes(program.id)
  const programContents = program.contentSections.map(v => v.contents).flat()

  return (
    <StyledProgramContentMenu visible={visible}>
      <StyledHead className="d-flex justify-content-between align-items-center">
        <span>{formatMessage(programMessages.ProgramContentMenu.programList)}</span>
        <StyledSelectBlock>
          <Select size="default" value={sortBy} onChange={e => setSortBy(e.target.value as 'section' | 'date')}>
            <option value="section">{formatMessage(programMessages.ProgramContentMenu.unit)}</option>
            <option value="date">{formatMessage(programMessages.ProgramContentMenu.time)}</option>
          </Select>
        </StyledSelectBlock>
      </StyledHead>

      {programContents.length === 0 ? (
        <EmptyMenu />
      ) : sortBy === 'section' ? (
        <ProgramContentSectionMenu
          isScrollToTop={isScrollToTop}
          program={program}
          programPackageId={programPackageId}
          isLoading={enrolledProgramIdsLoading}
          isEnrolled={isEnrolled}
          onSelect={onSelect}
        />
      ) : sortBy === 'date' ? (
        <ProgramContentDateMenu program={program} programPackageId={programPackageId} onSelect={onSelect} />
      ) : null}
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
  isEnrolled: boolean
  isLoading: boolean
  isScrollToTop?: boolean
  onSelect?: (programContentId: string) => void
}> = ({ program, programPackageId, isEnrolled, isLoading, isScrollToTop, onSelect }) => {
  const { programContentId } = useParams<{ programContentId?: string }>()

  return (
    <>
      {program.contentSections.map((v, i) => (
        <ContentSection
          key={v.id}
          isScrollToTop={isScrollToTop}
          defaultCollapse={programContentId ? v.contents.some(w => w.id === programContentId) : i === 0}
          programContentSection={v}
          programPackageId={programPackageId}
          isLoading={isLoading}
          isEnrolled={isEnrolled}
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
  isEnrolled: boolean
  isLoading: boolean
  isScrollToTop?: boolean
  defaultCollapse?: boolean
  onSelect?: (programContentId: string) => void
}> = ({ programContentSection, programPackageId, isEnrolled, isLoading, defaultCollapse, isScrollToTop, onSelect }) => {
  const programContentProgress = useProgramContentProgress()
  const [isCollapse, setIsCollapse] = useState(defaultCollapse)
  const [passExam, setPassExam] = useState<string[]>([])

  const contentProgress =
    programContentProgress?.filter(progress => progress.programContentSectionId === programContentSection.id) || []
  const otherProgress = contentProgress.filter(
    progress => progress.programContentBodyType !== 'exam' && progress.programContentBodyType !== 'exercise',
  )
  const sectionProgress = contentProgress.length
    ? Math.floor(
        ((sum(otherProgress.map(progress => progress.progress)) + passExam.length) * 100) / contentProgress.length,
      )
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
            isScrollToTop={isScrollToTop}
            key={programContent.id}
            programContent={programContent}
            contentCurrentProgress={contentProgress.find(item => item.programContentId === programContent.id)}
            onSetIsCollapse={setIsCollapse}
            isEnrolled={isEnrolled}
            isLoading={isLoading}
            passExam={passExam}
            setPassExam={setPassExam}
            onClick={() => onSelect?.(programContent.id)}
          />
        ))}
      </StyledContentSectionBody>
    </StyledContentSection>
  )
}

const SortBySectionItem: React.VFC<{
  programContent: ProgramContent
  contentCurrentProgress: programContentProgress | undefined
  isEnrolled: boolean
  isLoading: boolean
  isScrollToTop?: boolean
  onSetIsCollapse?: React.Dispatch<React.SetStateAction<boolean | undefined>>
  onClick?: () => void
  passExam?: string[]
  setPassExam: React.Dispatch<React.SetStateAction<string[]>>
}> = ({
  programContent,
  isEnrolled,
  isLoading,
  isScrollToTop,
  onSetIsCollapse,
  onClick,
  passExam = [],
  setPassExam,
  contentCurrentProgress,
}) => {
  const currentRef = useRef<HTMLInputElement>(null)
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId?: string
  }>()
  const [previousPage] = useQueryParam('back', StringParam)
  const [exerciseId] = useQueryParam('exerciseId', StringParam)

  const contentType = contentCurrentProgress?.programContentBodyType || ''
  const { currentExamExerciseData, loadingCurrentExamData, errorCurrentExamData, refetchCurrentExamData } =
    useExamExercise(programContent.id, currentMemberId || '', exerciseId)
  const { practiceIds } = usePracticeExist({ memberId: currentMemberId, programContentId: programContent.id })
  const { data: materials, loading: materailLoading } = useProgramContentMaterial(programContent.id)

  let progress = 0
  if (contentType === 'exercise' || contentType === 'exam') {
    if (currentExamExerciseData) {
      let { gainedPointsTotal, passingScore } = currentExamExerciseData
      if (gainedPointsTotal !== null && !isNaN(gainedPointsTotal) && !loadingCurrentExamData && !errorCurrentExamData) {
        if (passingScore <= gainedPointsTotal) {
          progress = 1
        } else if (passingScore > gainedPointsTotal) {
          progress = 0.5
        }
      }

      if (!passExam.includes(programContent.id) && gainedPointsTotal && passingScore <= gainedPointsTotal) {
        setPassExam([...passExam, programContent.id])
        passExam.push(programContent.id)
      }
    }
  } else if (contentType === 'practice') {
    progress = practiceIds && practiceIds.length > 1 ? 1 : 0
  } else {
    progress = contentCurrentProgress?.progress || 0
  }

  const { hasProgramContentPermission } = useHasProgramContentPermission(programContent.id)

  const progressStatus = progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'

  const isActive = programContent.id === programContentId
  const isTrial = programContent?.displayMode === DisplayModeEnum.trial
  const isLoginTrial = programContent?.displayMode === DisplayModeEnum.loginToTrial
  const isLock =
    (!isEnrolled && !isTrial && !(isLoginTrial ? Boolean(currentMemberId && isAuthenticated) : false)) ||
    !hasProgramContentPermission

  useEffect(() => {
    if (isActive) {
      onSetIsCollapse?.(true)
    }
  }, [isActive, onSetIsCollapse])

  useEffect(() => {
    isActive && !isScrollToTop && currentRef.current?.scrollIntoView()
  }, [isActive, isScrollToTop])

  return (
    <StyledItem
      id={programContent.id}
      ref={currentRef}
      className={`${progressStatus} ${isActive ? 'active' : isLock ? 'lock' : ''}`}
      onClick={async () => {
        onClick?.()
        if (contentType === 'exercise' || contentType === 'exam') {
          await refetchCurrentExamData()
        }
        history.push(
          `/programs/${programId}/contents/${programContent.id}${previousPage ? `?back=${previousPage}` : ''}`,
        )
      }}
    >
      <StyledItemTitle className="mb-2">{programContent.title}</StyledItemTitle>

      {(!isLock || isLoading) && (
        <StyledIconWrapper>
          <Icon as={CheckIcon} />
        </StyledIconWrapper>
      )}

      <div className="d-flex">
        <div className="mr-3 d-flex justify-content-center">
          {!isLoading && isLock ? (
            <>
              <StyledIcon as={LockIcon} className="mr-2" />
              <span>
                {(programContent.contentType === 'video' || programContent.contentType === 'audio') && (
                  <span>{durationFormatter(programContent.duration)}</span>
                )}
              </span>
            </>
          ) : programContent.contentType === 'video' || programContent.contentType === 'audio' ? (
            <>
              <StyledIcon
                as={programContent.contentType === 'video' ? AiOutlineVideoCamera : MicrophoneIcon}
                className="mr-2"
              />
              <span>
                {durationFormatter(programContent.duration)}
                <span className="ml-2">
                  {moment().isBefore(moment(programContent.publishedAt)) &&
                    `(${moment(programContent.publishedAt).format('MM/DD')} ${formatMessage(
                      commonMessages.text.publish,
                    )})`}
                </span>
              </span>
            </>
          ) : programContent.contentType === 'practice' ? (
            <StyledIcon as={PracticeIcon} className="mr-2" />
          ) : programContent.contentType === 'exercise' ? (
            <ExerciseQuestionCount contentBodyId={programContent.contentBodyId} programContent={programContent} />
          ) : (
            <>
              <StyledIcon as={AiOutlineFileText} className="mr-2" />
              <span>
                {moment().isBefore(moment(programContent.publishedAt)) &&
                  `${moment(programContent.publishedAt).format('MM/DD')} ${formatMessage(commonMessages.text.publish)}`}
              </span>
            </>
          )}
        </div>
        {!materailLoading && materials && materials.length !== 0 && (
          <div>
            <StyledIcon as={AttachmentIcon} className="mr-2" />
            {formatMessage(programMessages.ProgramContentMenu.materialAmount, {
              amount: materials.length,
            })}
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
  const programContents = flatten(program.contentSections.map(programContentSection => programContentSection.contents))

  return (
    <div>
      {programContents.map(programContent => (
        <SortByDateItem
          key={programContent.id}
          programContent={programContent}
          onClick={() => onSelect && onSelect(programContent.id)}
        />
      ))}
    </div>
  )
}

const SortByDateItem: React.VFC<{
  programContent: ProgramContent
  onClick?: () => void
}> = ({ programContent, onClick }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId?: string
  }>()
  const { currentMemberId } = useAuth()

  const [previousPage] = useQueryParam('back', StringParam)
  const [exerciseId] = useQueryParam('exerciseId', StringParam)
  const programContentProgress = useProgramContentProgress()
  const { currentExamExerciseData, loadingCurrentExamData, errorCurrentExamData } = useExamExercise(
    programContent.id,
    currentMemberId || '',
    exerciseId,
  )
  const { practiceIds } = usePracticeExist({ memberId: currentMemberId, programContentId: programContent.id })
  const { data: materials, loading: materailLoading } = useProgramContentMaterial(programContent.id)

  let progress = 0
  const contentType = programContentProgress?.find(
    progress => progress.programContentId === programContent.id,
  )?.programContentBodyType

  if (contentType === 'exercise' || contentType === 'exam') {
    if (currentExamExerciseData) {
      let { gainedPointsTotal, passingScore } = currentExamExerciseData
      if (gainedPointsTotal !== null && !isNaN(gainedPointsTotal) && !loadingCurrentExamData && !errorCurrentExamData) {
        if (passingScore <= gainedPointsTotal) {
          progress = 1
        } else if (passingScore > gainedPointsTotal) {
          progress = 0.5
        }
      }
    }
  } else if (contentType === 'practice') {
    progress = practiceIds && practiceIds.length > 1 ? 1 : 0
  } else {
    progress = programContentProgress?.find(v => v.programContentId === programContentId)?.progress || 0
  }

  return (
    <StyledItem
      id={programContent.id}
      className={`${progress === 0 ? 'unread' : progress === 1 ? 'done' : 'half'} ${
        programContent.id === programContentId ? 'active' : ''
      }`}
      onClick={() => {
        onClick?.()
        history.push(
          `/programs/${programId}/contents/${programContent.id}${previousPage ? `?back=${previousPage}` : ''}`,
        )
      }}
    >
      <StyledItemTitle className="mb-3">{programContent.title}</StyledItemTitle>

      <StyledIconWrapper>
        <Icon as={CheckIcon} />
      </StyledIconWrapper>

      <div>
        <StyledIcon as={AiOutlineCalendar} className="mr-2" />
        {programContent.publishedAt && dateFormatter(programContent.publishedAt)}
      </div>
      {!materailLoading && materials && materials.length !== 0 && (
        <div className="mt-2">
          <StyledIcon as={AttachmentIcon} className="mr-2" />
          {formatMessage(programMessages.ProgramContentMenu.materialAmount, {
            amount: materials.length,
          })}
        </div>
      )}
    </StyledItem>
  )
}

const EmptyMenu: React.VFC = () => (
  <Card style={{ textAlign: 'center', color: '#9b9b9b' }}>初次購買還沒有新的內容喔～</Card>
)

const ExerciseQuestionCount: React.VFC<{ contentBodyId: string; programContent: ProgramContent }> = ({
  contentBodyId,
  programContent,
}) => {
  const { formatMessage } = useIntl()
  const { data: programContentBody } = useProgramContentBody(contentBodyId)
  const count = Array.isArray(programContentBody?.data?.questions) ? programContentBody?.data?.questions?.length : 0

  // TODO fetch endedAt from exam data
  const endedAt =
    programContent.metadata?.endedAt && moment(programContent.metadata?.endedAt).isValid()
      ? moment(programContent.metadata?.endedAt).toDate()
      : undefined

  return (
    <>
      <StyledIcon as={QuizIcon} className="mr-2" />
      <span>{formatMessage(programMessages.ProgramContentMenu.totalQuestion, { count })}</span>
      {endedAt && (
        <div className="d-flex align-items-center ml-3">
          <StyledIcon as={AiOutlineCalendar} className="mr-2" />
          {dateFormatter(endedAt, 'YYYY-MM-DD HH:mm')}
          <span className="ml-2">{formatMessage(programMessages.ProgramContentMenu.expired)}</span>
        </div>
      )}
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

import { Divider, Icon, Tag, Typography } from 'antd'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../../components/auth/AuthModal'
import ProgramContentTrialModal from '../../components/program/ProgramContentTrialModal'
import { durationFormatter } from '../../helpers'
import { productMessages } from '../../helpers/translation'
import { useEnrolledProgramIds } from '../../hooks/program'
import { Program, ProgramContent, ProgramContentSection } from '../../types/program'

const StyledTitle = styled.h2`
  font-size: 24px;
  letter-spacing: 0.2px;
  color: #585858;
`
const ProgramSectionBlock = styled.div`
  margin-bottom: 2.5rem;
`
const ProgramSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`
const ProgramContentItem = styled.div<{ isEnrolled: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin-bottom: 12px;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f7f8f8;
  font-size: 14px;
  ${props => props.isEnrolled && `cursor: pointer;`}

  .ant-typography-secondary {
    font-size: 12px;
  }
`
const StyledObscure = styled.span`
  &::before {
    content: ' ';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    cursor: pointer;
  }
`
const StyledTag = styled(Tag)`
  && {
    border: none;
  }
`
const StyledDuration = styled.span`
  color: rgb(155, 155, 155);
`

const ProgramContentListSection: React.VFC<{
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ program }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const theme = useAppTheme()
  const { currentMemberId, isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const { enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  const isEnrolled = enrolledProgramIds.includes(program.id)

  return (
    <>
      <StyledTitle>{formatMessage(productMessages.program.title.content)}</StyledTitle>
      <Divider className="mt-1" />

      {program.contentSections
        .filter(programContentSection => programContentSection.contents.length)
        .map(programContentSection => (
          <ProgramSectionBlock key={programContentSection.id}>
            {/* <ProgramSectionTitle className="mb-3">{programContentSection.title}</ProgramSectionTitle> */}

            {programContentSection.contents.map(programContent => (
              <ProgramContentItem
                key={programContent.id}
                isEnrolled={isEnrolled}
                onClick={() => {
                  if (isEnrolled) {
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
                  }
                  if (programContent.displayMode === 'loginToTrial' && !isAuthenticated) {
                    setAuthModalVisible?.(true)
                  }
                }}
              >
                <Typography.Text>
                  {programContent.contentType === 'video' ? (
                    <Icon type="video-camera" className="mr-2" />
                  ) : (
                    <Icon type="file-text" className="mr-2" />
                  )}
                  <span>{programContent.title}</span>
                </Typography.Text>

                <StyledDuration>
                  {(programContent.displayMode === 'trial' ||
                    (programContent.displayMode === 'loginToTrial' && isAuthenticated)) &&
                  !isEnrolled ? (
                    <ProgramContentTrialModal
                      programContentId={programContent.id}
                      render={({ setVisible }) => (
                        <StyledObscure onClick={() => setVisible(true)}>
                          <StyledTag color={theme.colors.primary[500]}>
                            {formatMessage(productMessages.program.content.trial)}
                          </StyledTag>
                        </StyledObscure>
                      )}
                    />
                  ) : programContent.displayMode === 'loginToTrial' && !isAuthenticated ? (
                    <StyledTag color={theme.colors.primary[500]}>
                      {formatMessage(productMessages.program.content.trial)}
                    </StyledTag>
                  ) : null}
                  {durationFormatter(programContent.duration) || ''}
                </StyledDuration>
              </ProgramContentItem>
            ))}
          </ProgramSectionBlock>
        ))}
    </>
  )
}

export default ProgramContentListSection

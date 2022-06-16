import { Divider, Icon, Tag, Typography } from 'antd'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
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
  memberId: string
  program: Program & {
    contentSections: (ProgramContentSection & {
      contents: ProgramContent[]
    })[]
  }
}> = ({ memberId, program }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const theme = useAppTheme()
  const { enrolledProgramIds } = useEnrolledProgramIds(memberId)

  const isEnrolled = enrolledProgramIds.includes(program.id)

  const trialProgramContents =
    program.contentSections.flatMap(
      programContentSection =>
        programContentSection.contents.filter(programContent => programContent.listPrice === 0) || [],
    ) || []

  const ProgramContentSectionBlock = () => {
    return (
      <>
        <StyledTitle>{formatMessage(productMessages.program.title.content)}</StyledTitle>
        <Divider className="mt-1" />

        {program.contentSections
          .filter(programContentSection => programContentSection.contents.length)
          .map(programContentSection => (
            <ProgramSectionBlock key={programContentSection.id}>
              <ProgramSectionTitle className="mb-3">{programContentSection.title}</ProgramSectionTitle>

              {programContentSection.contents.map(programContent => (
                <ProgramContentItem
                  key={programContent.id}
                  isEnrolled={isEnrolled}
                  onClick={() => {
                    if (!isEnrolled) {
                      return
                    }
                    history.push(`/programs/${program.id}/contents/${programContent.id}?back=programs_${program.id}`)
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
                    {programContent.listPrice === 0 && !isEnrolled && (
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
                    )}
                    {durationFormatter(programContent.duration) || ''}
                  </StyledDuration>
                </ProgramContentItem>
              ))}
            </ProgramSectionBlock>
          ))}
      </>
    )
  }

  // if (program.isSubscription) {
  //   // subscription program
  //   if (!program.isIntroductionSectionVisible) {
  //     if (trialProgramContents.length === 0) {
  //       return null
  //     }
  //     return (
  //       <>
  //         <StyledTitle>{formatMessage(productMessages.program.title.trial)}</StyledTitle>
  //         <Divider className="mt-1" />

  //         {trialProgramContents.map(programContent => {
  //           return (
  //             <ProgramContentTrialModal
  //               key={programContent.id}
  //               programContentId={programContent.id}
  //               render={({ setVisible }) => (
  //                 <ProgramContentItem onClick={() => setVisible(true)}>
  //                   <Typography.Text>
  //                     {programContent.duration ? (
  //                       <Icon type="video-camera" className="mr-2" />
  //                     ) : (
  //                       <Icon type="file-text" className="mr-2" />
  //                     )}
  //                     {programContent.title}
  //                   </Typography.Text>

  //                   <StyledDuration>{durationFormatter(programContent.duration) || ''}</StyledDuration>
  //                 </ProgramContentItem>
  //               )}
  //             />
  //           )
  //         })}
  //       </>
  //     )
  //   }
  //   return <ProgramContentSectionBlock />
  // }

  // perpetual program
  return <ProgramContentSectionBlock />
}

export default ProgramContentListSection

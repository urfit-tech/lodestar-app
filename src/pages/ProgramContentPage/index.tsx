import { Button } from '@chakra-ui/react'
import { Icon, Layout } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useState } from 'react'
import { AiOutlineProfile, AiOutlineUnorderedList } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs'
import { defineMessage, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { BREAK_POINT } from '../../components/common/Responsive'
import { StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../../components/program/ProgramContentMenu'
import ProgramContentNoAuthBlock from '../../components/program/ProgramContentNoAuthBlock'
import { ProgressProvider } from '../../contexts/ProgressContext'
import { hasJsonStructure } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import { StyledPageHeader, StyledSideBar } from './index.styled'
import ProgramContentBlock from './ProgramContentBlock'
import ProgramCustomContentBlock from './ProgramCustomContentBlock'

const StyledLink = styled(Link)`
  && {
    &:hover {
      color: white;
    }
  }
`

const ProgramContentPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId: string
  }>()
  const { enabledModules, settings, id: appId } = useApp()
  const { currentMemberId, isAuthenticating } = useAuth()
  const { program, loadingProgram } = useProgram(programId)
  const [menuVisible, setMenuVisible] = useState(window.innerWidth >= BREAK_POINT)
  const [productId] = useQueryParam('back', StringParam)

  if (isAuthenticating || loadingProgram) {
    return <></>
  }

  let oldProgramInfo = {}
  if (hasJsonStructure(localStorage.getItem(`${appId}.program.info`) || '')) {
    JSON.parse(localStorage.getItem(`${appId}.program.info`) || '')
  }
  localStorage.setItem(`${appId}.program.info`, JSON.stringify({ ...oldProgramInfo, [programId]: programContentId }))

  return (
    <Layout>
      <StyledPageHeader
        title={program?.title || programId}
        extra={
          <div>
            {enabledModules.customer_review && (
              <Button
                colorScheme="primary"
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/programs/${programId}?visitIntro=1&moveToBlock=customer-review`)}
              >
                <Icon component={BsStar} className="mr-2" />
                {formatMessage(commonMessages.button.review)}
              </Button>
            )}
            <Button
              size="sm"
              colorScheme="primary"
              variant="ghost"
              onClick={() => window.open(`/programs/${programId}?visitIntro=1`)}
            >
              <Icon component={AiOutlineProfile} className="mr-2" />
              {formatMessage(commonMessages.button.intro)}
            </Button>
            {!settings['layout.program_content'] && (
              <Button size="sm" colorScheme="primary" variant="ghost" onClick={() => setMenuVisible(!menuVisible)}>
                <Icon component={AiOutlineUnorderedList} className="mr-2" />
                {formatMessage(commonMessages.button.list)}
              </Button>
            )}
          </div>
        }
        onBack={() => {
          if (productId) {
            const [productType, id] = productId.split('_')
            if (productType === 'program-package') {
              history.push(`/program-packages/${id}/contents`)
            }
            if (productType === 'project') {
              history.push(`/projects/${id}`)
            }
          } else {
            history.push(`/members/${currentMemberId}`)
          }
          history.push(`/`)
        }}
      />

      <StyledLayoutContent>
        {program && currentMemberId ? (
          <ProgressProvider programId={program.id} memberId={currentMemberId}>
            {settings['layout.program_content'] ? (
              <div className="no-gutters">
                <ProgramCustomContentBlock
                  programContentSections={program.contentSections}
                  programContentId={programContentId}
                  editors={program.editors}
                >
                  <>
                    <ProgramContentMenu isScrollToTop program={program} />

                    <Button isFullWidth className="mt-3" colorScheme="primary">
                      <StyledLink to={`/programs/${programId}?moveToBlock=customer-review`}>
                        {formatMessage(defineMessage({ id: 'program.ui.leaveReview', defaultMessage: '留下評價' }))}
                      </StyledLink>
                    </Button>
                  </>
                </ProgramCustomContentBlock>
              </div>
            ) : (
              <div className="row no-gutters">
                <div className={menuVisible ? 'd-lg-block col-lg-9 d-none' : 'col-12'}>
                  <StyledLayoutContent>
                    <ProgramContentBlock
                      programId={program.id}
                      programRoles={program.roles}
                      programContentSections={program.contentSections}
                      programContentId={programContentId}
                      issueEnabled={program.isIssuesOpen}
                      editors={program.editors}
                    />
                  </StyledLayoutContent>
                </div>
                <div className={menuVisible ? 'col-12 col-lg-3' : 'd-none'}>
                  <StyledSideBar>
                    <ProgramContentMenu
                      program={program}
                      onSelect={() => window.innerWidth < BREAK_POINT && setMenuVisible(false)}
                    />
                  </StyledSideBar>
                </div>
              </div>
            )}
          </ProgressProvider>
        ) : (
          <div className="container py-5">
            <ProgramContentNoAuthBlock />
          </div>
        )}
      </StyledLayoutContent>
    </Layout>
  )
}

export default ProgramContentPage

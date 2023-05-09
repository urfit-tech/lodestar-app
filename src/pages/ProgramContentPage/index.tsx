import { Button, Flex, Skeleton, Spinner } from '@chakra-ui/react'
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
import DefaultLayout from '../../components/layout/DefaultLayout'
import { EmptyBlock, StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../../components/program/ProgramContentMenu'
import ProgramContentNoAuthBlock from '../../components/program/ProgramContentNoAuthBlock'
import { ProgressProvider } from '../../contexts/ProgressContext'
import { hasJsonStructure } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import ForbiddenPage from '../ForbiddenPage'
import { StyledPageHeader, StyledSideBar } from './index.styled'
import ProgramContentBlock from './ProgramContentBlock'
import ProgramContentPageHelmet from './ProgramContentPageHelmet'
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
  const { enabledModules, settings, id: appId, loading: loadingApp } = useApp()
  const { currentMemberId, isAuthenticating } = useAuth()
  const { program, loadingProgram } = useProgram(programId)
  const [menuVisible, setMenuVisible] = useState(window.innerWidth >= BREAK_POINT)
  const [previousPage] = useQueryParam('back', StringParam)

  let oldProgramInfo = {}
  if (hasJsonStructure(localStorage.getItem(`${appId}.program.info`) || '')) {
    JSON.parse(localStorage.getItem(`${appId}.program.info`) || '')
  }
  programId &&
    programContentId &&
    localStorage.setItem(`${appId}.program.info`, JSON.stringify({ ...oldProgramInfo, [programId]: programContentId }))

  if (isAuthenticating || loadingProgram) {
    return (
      <DefaultLayout>
        <Flex h="100vh" alignItems="center" justifyContent="center">
          <Spinner />
        </Flex>
      </DefaultLayout>
    )
  }

  if (!program?.contentSections) {
    return <ForbiddenPage />
  }

  return (
    <Layout>
      {!loadingApp && <ProgramContentPageHelmet program={program!} contentId={programContentId} />}
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
          if (previousPage) {
            const [page, targetId] = previousPage.split('_')
            if (page === 'creators') {
              history.push(`/creators/${targetId}`)
            } else if (page === 'programs') {
              if (targetId) {
                history.push(`/programs/${targetId}?visitIntro=1`)
              } else {
                history.push(`/programs`)
              }
            } else if (page === 'program-packages') {
              history.push(`/program-packages/${targetId}/contents`)
            } else if (page === 'members') {
              history.push(`/members/${targetId}`)
            } else if (page === 'projects') {
              history.push(`/projects/${targetId}`)
            } else {
              history.push('/')
            }
          } else {
            history.push(`/programs/${programId}?visitIntro=1`)
          }
        }}
      />

      <StyledLayoutContent>
        {program ? (
          <ProgressProvider programId={program.id} memberId={currentMemberId || ''}>
            {settings['layout.program_content'] ? (
              <div className="no-gutters">
                <ProgramCustomContentBlock
                  programContentSections={program.contentSections}
                  programContentId={programContentId}
                  editors={program.editors}
                >
                  <>
                    <ProgramContentMenu isScrollToTop program={program} />

                    <StyledLink to={`/programs/${programId}?moveToBlock=customer-review&visitIntro=1`}>
                      <Button isFullWidth className="mt-3" colorScheme="primary">
                        {formatMessage(defineMessage({ id: 'program.ui.leaveReview', defaultMessage: '留下評價' }))}
                      </Button>
                    </StyledLink>
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
                <EmptyBlock height="64px" />
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

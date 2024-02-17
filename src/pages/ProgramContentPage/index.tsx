import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Icon } from '@chakra-ui/react'
import { Layout } from 'antd'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import React, { useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { AiOutlineProfile, AiOutlineUnorderedList } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs'
import { defineMessage, useIntl } from 'react-intl'
import { Link, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { BREAK_POINT } from '../../components/common/Responsive'
import { EmptyBlock, StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../../components/program/ProgramContentMenu'
import ProgramContentNoAuthBlock from '../../components/program/ProgramContentNoAuthBlock'
import { ProgressProvider } from '../../contexts/ProgressContext'
import { commonMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
import { StyledPageHeader, StyledSideBar } from './index.styled'
import ProgramContentBlock from './ProgramContentBlock'
import ProgramContentPageHelmet from './ProgramContentPageHelmet'
import ProgramCustomContentBlock from './ProgramCustomContentBlock'
import type { Book } from 'epubjs'

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
  const { resourceCollection } = useResourceCollection([`${appId}:program_content:${programContentId}`])
  const [menuVisible, setMenuVisible] = useState(window.innerWidth >= BREAK_POINT)
  const [previousPage] = useQueryParam('back', StringParam)
  const [menuStatus, setMenuStatus] = useState<'search' | 'list'>('list')
  const [ebookCurrentToc, setEbookCurrentToc] = useState<string | null>(null)
  const [ebook, setEbook] = useState<Book | null>(null)
  const [ebookLocation, setEbookLocation] = useState<string | number>(
    // last toc progress
    0,
  )

  useLayoutEffect(() => {
    ebook && setMenuVisible(false)
  }, [ebook])

  if (isAuthenticating || loadingProgram) {
    return <LoadingPage />
  }

  if (!program) {
    return <NotFoundPage />
  }

  return (
    <Layout>
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      {settings['hubspot.portal_id'] ? (
        <Helmet>
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={`//js.hs-scripts.com/${settings['hubspot.portal_id']}.js`}
          />
        </Helmet>
      ) : null}
      {!loadingApp && <ProgramContentPageHelmet program={program!} contentId={programContentId} />}
      <StyledPageHeader
        title={program?.title || programId}
        extra={
          <div>
            {ebook ? (
              <Button
                paddingX="0.4rem"
                colorScheme="primary"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (menuStatus === 'search' && menuVisible) {
                    setMenuVisible(false)
                  } else {
                    setMenuStatus('search')
                    setMenuVisible(true)
                  }
                }}
              >
                <Icon as={SearchIcon} mr="0.3rem" />
                搜尋
              </Button>
            ) : null}

            {enabledModules.customer_review && (
              <Button
                paddingX="0.4rem"
                colorScheme="primary"
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/programs/${programId}?visitIntro=1&moveToBlock=customer-review`)}
              >
                <Icon as={BsStar} mr="0.3rem" />
                {formatMessage(commonMessages.button.review)}
              </Button>
            )}
            <Button
              paddingX="0.4rem"
              size="sm"
              colorScheme="primary"
              variant="ghost"
              onClick={() => window.open(`/programs/${programId}?visitIntro=1`)}
            >
              <Icon as={AiOutlineProfile} mr="0.3rem" />
              {formatMessage(commonMessages.button.intro)}
            </Button>
            {!settings['layout.program_content'] && (
              <Button
                paddingX="0.4rem"
                size="sm"
                colorScheme="primary"
                variant="ghost"
                onClick={() => {
                  if (menuStatus === 'list' && menuVisible) {
                    setMenuVisible(false)
                  } else {
                    setMenuStatus('list')
                    setMenuVisible(true)
                  }
                }}
              >
                <Icon as={AiOutlineUnorderedList} mr="0.3rem" />
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
                  programId={program.id}
                  programContentSections={program.contentSections}
                  programContentId={programContentId}
                >
                  <>
                    <ProgramContentMenu
                      isScrollToTop
                      program={program}
                      menuStatus={menuStatus}
                      ebookCurrentToc={ebookCurrentToc}
                      ebookLocation={ebookLocation}
                      onEbookLocationChange={setEbookLocation}
                      ebook={ebook}
                    />

                    <StyledLink to={`/programs/${programId}?moveToBlock=customer-review&visitIntro=1`}>
                      <Button isFullWidth className="mt-3" colorScheme="primary">
                        {formatMessage(defineMessage({ id: 'program.ui.leaveReview', defaultMessage: '留下評價' }))}
                      </Button>
                    </StyledLink>
                  </>
                </ProgramCustomContentBlock>
              </div>
            ) : (
              <Box className="row no-gutters">
                {/*ebook will stay full screen*/}
                <Box className={menuVisible && !ebook ? 'd-lg-block col-lg-9 d-none' : 'col-12'}>
                  <StyledLayoutContent>
                    <ProgramContentBlock
                      programId={program.id}
                      programRoles={program.roles}
                      programContentSections={program.contentSections}
                      programContentId={programContentId}
                      issueEnabled={program.isIssuesOpen}
                      editors={program.editors}
                      ebookCurrentToc={ebookCurrentToc}
                      onEbookCurrentTocChange={setEbookCurrentToc}
                      ebookLocation={ebookLocation}
                      onEbookLocationChange={setEbookLocation}
                      setEbook={setEbook}
                    />
                  </StyledLayoutContent>
                </Box>
                <Box
                  top="0px"
                  right="0px"
                  position={ebook ? 'absolute' : 'relative'}
                  className={menuVisible ? 'col-12 col-lg-3' : 'd-none'}
                >
                  <StyledSideBar>
                    <ProgramContentMenu
                      program={program}
                      onSelect={() => window.innerWidth < BREAK_POINT && setMenuVisible(false)}
                      menuStatus={menuStatus}
                      ebookCurrentToc={ebookCurrentToc}
                      ebookLocation={ebookLocation}
                      onEbookLocationChange={loc => {
                        setEbookLocation(loc)
                        setMenuVisible(false)
                      }}
                      ebook={ebook}
                    />
                  </StyledSideBar>
                </Box>
                <EmptyBlock height="64px" />
              </Box>
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

import { Box, Button, Icon, Spinner } from '@chakra-ui/react'
import { Layout, PageHeader } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten } from 'ramda'
import React, { useContext } from 'react'
import { AiOutlineProfile } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { StyledLayoutContent } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../components/program/ProgramContentMenu'
import ProgramContentNoAuthBlock from '../components/program/ProgramContentNoAuthBlock'
import AudioPlayerContext from '../contexts/AudioPlayerContext'
import { useProgram, useRecentProgramContent } from '../hooks/program'
import pageMessages from './translation'

const StyledPCPageHeader = styled(PageHeader)`
  && {
    padding: 10px 24px;
    height: 64px;
    background: white;
  }

  .ant-page-header-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ant-page-header-heading-title {
    display: block;
    flex-grow: 1;
    overflow: hidden;
    font-size: 16px;
    line-height: 44px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ant-page-header-heading-extra {
    padding: 0;
  }
`
const StyledButton = styled(Button)`
  && {
    border: none;
  }
  &&:hover {
    background: initial;
  }
`

const ProgramContentCutscenePage: React.VFC = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { enabledModules } = useApp()
  const { isAuthenticating, isAuthenticated, currentMemberId } = useAuth()
  const { programId } = useParams<{ programId: string }>()
  const [previousPage] = useQueryParam('back', StringParam)
  const { loadingProgram, program, errorProgram } = useProgram(programId)
  const { contentId } = useContext(AudioPlayerContext)
  const { recentProgramContent } = useRecentProgramContent(currentMemberId || '')

  if (loadingProgram || isAuthenticating || !program) {
    return (
      <Box className="d-flex justify-content-center align-items-center" h="100vh">
        <Spinner />
      </Box>
    )
  }
  if (!isAuthenticated) return <ProgramContentNoAuthBlock />

  if (errorProgram) return <>fetch program data error</>

  // ProgramContentPage
  if (flatten(program?.contentSections.map(v => v.contents) || []).length === 0) {
    return (
      <Layout>
        <StyledPCPageHeader
          className="d-flex align-items-center"
          title={program && program.title}
          extra={
            <div>
              {enabledModules.customer_review && (
                <StyledButton
                  variant="outline"
                  onClick={() => window.open(`/programs/${programId}?visitIntro=1&moveToBlock=customer-review`)}
                  leftIcon={<Icon as={BsStar} />}
                >
                  {formatMessage(pageMessages['*'].review)}
                </StyledButton>
              )}
              <StyledButton
                variant="outline"
                onClick={() => history.push(`/programs/${programId}?visitIntro=1`)}
                leftIcon={<Icon as={AiOutlineProfile} />}
              >
                {formatMessage(pageMessages['*'].intro)}
              </StyledButton>
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
                history.push(`/program-packages/${targetId}`)
              } else if (page === 'members') {
                history.push(`/members/${targetId}`)
              } else if (page === 'projects') {
                history.push(`/projects/${targetId}`)
              } else {
                history.push('/')
              }
            }
          }}
        />
        <StyledLayoutContent>
          <div className="container py-5">
            <ProgramContentMenu program={program} />
          </div>
        </StyledLayoutContent>
      </Layout>
    )
  } else if (
    contentId !== '' &&
    flatten(program?.contentSections.map(v => v.contents.map(w => w.id)) || []).includes(contentId)
  ) {
    return (
      <Redirect to={`/programs/${programId}/contents/${contentId}?back=${previousPage || `programs_${programId}`}`} />
    )
  } else if (
    recentProgramContent?.contentId &&
    flatten(program?.contentSections.map(v => v.contents.map(w => w.id)) || []).includes(
      recentProgramContent?.contentId,
    )
  ) {
    return (
      <Redirect
        to={`/programs/${programId}/contents/${recentProgramContent?.contentId}?back=${
          previousPage || `programs_${programId}`
        }`}
      />
    )
  } else {
    return (
      <Redirect
        to={`/programs/${programId}/contents/${program?.contentSections[0].contents[0].id}?back=${
          previousPage || `programs_${programId}`
        }`}
      />
    )
  }
}

export default ProgramContentCutscenePage

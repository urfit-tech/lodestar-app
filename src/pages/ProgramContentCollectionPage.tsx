import { Icon, LockIcon } from '@chakra-ui/icons'
import { Box, Button, Spinner } from '@chakra-ui/react'
import { Layout, PageHeader } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { AiOutlineProfile } from 'react-icons/ai'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { Redirect, useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import AdminCard from '../components/common/AdminCard'
import { StyledLayoutContent } from '../components/layout/DefaultLayout/DefaultLayout.styled'
import ProgramContentMenu from '../components/program/ProgramContentMenu'
import { ProgressProvider } from '../contexts/ProgressContext'
import { commonMessages, programMessages } from '../helpers/translation'
import { useEnrolledProgramIds, useProgram } from '../hooks/program'

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
const ProgramContentCollectionPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { enabledModules } = useApp()
  const { programId } = useParams<{ programId: string }>()
  const [productId] = useQueryParam('back', StringParam)
  const [visitIntro] = useQueryParam('visitIntro', BooleanParam)
  const { currentMemberId } = useAuth()
  const { loadingProgram, program } = useProgram(programId)
  const { isAuthenticating, isAuthenticated } = useAuth()

  const { loading: loadingEnrolledProgramIds, enrolledProgramIds } = useEnrolledProgramIds(currentMemberId || '')

  if (loadingProgram || loadingEnrolledProgramIds || isAuthenticating) {
    return (
      <Box className="d-flex justify-content-center align-items-center" h="100vh">
        <Spinner />
      </Box>
    )
  }

  if (!enrolledProgramIds.includes(programId) || visitIntro) {
    return <Redirect to={`/programs/${programId}`} />
  }

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
                onClick={() => window.open(`/programs/${programId}?moveToBlock=customer-review`)}
                leftIcon={<Icon as={BsStar} />}
              >
                {formatMessage(commonMessages.button.review)}
              </StyledButton>
            )}
            <StyledButton
              variant="outline"
              onClick={() => history.push(`/programs/${programId}`)}
              leftIcon={<Icon as={AiOutlineProfile} />}
            >
              {formatMessage(commonMessages.button.intro)}
            </StyledButton>
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
        }}
      />
      <StyledLayoutContent>
        <div className="container py-5">
          {isAuthenticated === false ? (
            <ProgramContentNoAuthBlock />
          ) : (
            <AdminCard>
              {!currentMemberId || loadingProgram || !program ? (
                <Spinner />
              ) : (
                <ProgressProvider programId={program.id} memberId={currentMemberId}>
                  <ProgramContentMenu program={program} />
                </ProgressProvider>
              )}
            </AdminCard>
          )}
        </div>
      </StyledLayoutContent>
    </Layout>
  )
}

const StyledNoAuthBlock = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
`

const StyledText = styled.span`
  vertical-align: bottom;
`

const ProgramContentNoAuthBlock: React.VFC = () => {
  const { formatMessage } = useIntl()
  return (
    <StyledNoAuthBlock className="p-2 text-center">
      <LockIcon className="mr-2" />
      <StyledText>{formatMessage(programMessages.text.noAuth)}</StyledText>
    </StyledNoAuthBlock>
  )
}

export { ProgramContentNoAuthBlock }

export default ProgramContentCollectionPage

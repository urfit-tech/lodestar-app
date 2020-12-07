import { Icon } from '@chakra-ui/icons'
import { Button } from '@chakra-ui/react'
import { Button as AntdButton, Layout, PageHeader, Spin } from 'antd'
import React from 'react'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { useAuth } from '../components/auth/AuthContext'
import AdminCard from '../components/common/AdminCard'
import { StyledLayoutContent } from '../components/layout/DefaultLayout.styled'
import ProgramContentMenu from '../components/program/ProgramContentMenu'
import { ProgressProvider } from '../contexts/ProgressContext'
import { commonMessages } from '../helpers/translation'
import { useProgram } from '../hooks/program'

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
const ProgramContentCollectionPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId } = useParams<{ programId: string }>()
  const [productId] = useQueryParam('back', StringParam)
  const { currentMemberId } = useAuth()
  const { loadingProgram, program } = useProgram(programId)

  return (
    <Layout>
      <StyledPCPageHeader
        className="d-flex align-items-center"
        title={program && program.title}
        extra={[
          <StyledButton
            variant="outline"
            onClick={() => window.open(`/programs/${programId}?moveToBlock=customer-review`)}
            leftIcon={<Icon as={BsStar} />}
          >
            {formatMessage(commonMessages.button.review)}
          </StyledButton>,
          <AntdButton icon="profile" type="link" onClick={() => history.push(`/programs/${programId}`)}>
            {formatMessage(commonMessages.button.intro)}
          </AntdButton>,
        ]}
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
          <AdminCard>
            {!currentMemberId || loadingProgram || !program ? (
              <Spin />
            ) : (
              <ProgressProvider programId={program.id} memberId={currentMemberId}>
                <ProgramContentMenu program={program} />
              </ProgressProvider>
            )}
          </AdminCard>
        </div>
      </StyledLayoutContent>
    </Layout>
  )
}

export default ProgramContentCollectionPage

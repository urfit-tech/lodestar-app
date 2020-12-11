import { Button, Icon, Layout, PageHeader } from 'antd'
import React, { useState } from 'react'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../components/auth/AuthContext'
import { BREAK_POINT } from '../components/common/Responsive'
import { StyledLayoutContent } from '../components/layout/DefaultLayout.styled'
import ProgramContentBlock from '../components/program/ProgramContentBlock'
import ProgramContentMenu from '../components/program/ProgramContentMenu'
import { useApp } from '../containers/common/AppContext'
import { ProgressProvider } from '../contexts/ProgressContext'
import { commonMessages } from '../helpers/translation'
import { useProgram } from '../hooks/program'

const StyledPageHeader = styled(PageHeader)`
  && {
    padding: 1rem 1.5rem;
    height: 4rem;
    background: white;
  }

  .ant-page-header-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ant-page-header-heading-title,
  .ant-divider {
    display: none;
  }

  .ant-page-header-heading-extra {
    width: auto;
    padding: 0;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .ant-page-header-heading-title {
      display: block;
      flex-grow: 1;
      font-size: 16px;
      line-height: 32px;
    }
  }
`
const StyledSideBar = styled.div`
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 10px 10px 0px;
`

const ProgramContentPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId: string
  }>()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { loadingProgram, program } = useProgram(programId)
  const [menuVisible, setMenuVisible] = useState(window.innerWidth >= BREAK_POINT)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const programPackageId = query.get('back')

  if (loadingProgram || !program || !currentMemberId) {
    return (
      <Layout>
        <StyledPageHeader
          title=""
          extra={
            <div>
              {enabledModules.customer_review && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => window.open(`/programs/${programId}?moveToBlock=customer-review`)}
                >
                  <Icon component={BsStar} />
                  {formatMessage(commonMessages.button.review)}
                </Button>
              )}
              ,
              <Button type="link" size="small" icon="profile" onClick={() => window.open(`/programs/${programId}`)}>
                {formatMessage(commonMessages.button.intro)}
              </Button>
              <Button type="link" size="small" icon="unordered-list" onClick={() => setMenuVisible(!menuVisible)}>
                {formatMessage(commonMessages.button.list)}
              </Button>
            </div>
          }
        />
      </Layout>
    )
  }

  return (
    <Layout>
      <StyledPageHeader
        title={program.title}
        extra={
          <div>
            {enabledModules.customer_review && (
              <Button
                type="link"
                size="small"
                onClick={() => window.open(`/programs/${programId}?moveToBlock=customer-review`)}
              >
                <Icon component={BsStar} />
                {formatMessage(commonMessages.button.review)}
              </Button>
            )}
            <Button type="link" size="small" icon="profile" onClick={() => window.open(`/programs/${programId}`)}>
              {formatMessage(commonMessages.button.intro)}
            </Button>
            <Button type="link" size="small" icon="unordered-list" onClick={() => setMenuVisible(!menuVisible)}>
              {formatMessage(commonMessages.button.list)}
            </Button>
          </div>
        }
        onBack={() =>
          history.push(`/programs/${programId}/contents${programPackageId !== null ? `?back=${programPackageId}` : ''}`)
        }
      />

      <ProgressProvider programId={program.id} memberId={currentMemberId}>
        <StyledLayoutContent>
          <div className="row no-gutters">
            <div className={menuVisible ? 'd-none d-lg-block col-lg-9' : 'col-12'}>
              <StyledLayoutContent>
                <ProgramContentBlock program={program} programContentId={programContentId} />
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
        </StyledLayoutContent>
      </ProgressProvider>
    </Layout>
  )
}

export default ProgramContentPage

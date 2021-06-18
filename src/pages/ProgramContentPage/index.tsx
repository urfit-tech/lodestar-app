import { Button, Icon, Layout } from 'antd'
import React, { useState } from 'react'
import { BsStar } from 'react-icons/bs'
import { useIntl } from 'react-intl'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../../components/auth/AuthContext'
import { BREAK_POINT } from '../../components/common/Responsive'
import { StyledLayoutContent } from '../../components/layout/DefaultLayout.styled'
import ProgramContentMenu from '../../components/program/ProgramContentMenu'
import { useApp } from '../../containers/common/AppContext'
import { ProgressProvider } from '../../contexts/ProgressContext'
import { commonMessages } from '../../helpers/translation'
import { useProgram } from '../../hooks/program'
import { StyledPageHeader, StyledSideBar } from './index.styled'
import ProgramContentBlock from './ProgramContentBlock'

const ProgramContentPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const { programId, programContentId } = useParams<{
    programId: string
    programContentId: string
  }>()
  const { enabledModules } = useApp()
  const { currentMemberId } = useAuth()
  const { program } = useProgram(programId)
  const [menuVisible, setMenuVisible] = useState(window.innerWidth >= BREAK_POINT)
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const programPackageId = query.get('back')

  return (
    <Layout>
      <StyledPageHeader
        title={program?.title || programId}
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

      {program && currentMemberId && (
        <ProgressProvider programId={program.id} memberId={currentMemberId}>
          <StyledLayoutContent>
            <div className="row no-gutters">
              <div className={menuVisible ? 'd-lg-block col-lg-9' : 'col-12'}>
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
      )}
    </Layout>
  )
}

export default ProgramContentPage

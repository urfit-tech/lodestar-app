import { Button } from 'antd'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { ProjectPlanProps } from '../../types/project'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import ProjectPlanCollection from './ProjectPlanCollection'

const TabPaneContent = styled.div<{ collapsed?: boolean }>`
  position: relative;

  ${props =>
    props.collapsed
      ? css`
          @media (max-width: ${BREAK_POINT - 1}px) {
            position: relative;
            overflow: hidden;
            max-height: 100vh;

            &::before {
              content: ' ';
              display: block;
              position: absolute;
              bottom: 0;
              width: 100%;
              height: 200px;
              background: linear-gradient(to bottom, transparent, white);
            }
          }
        `
      : ''}
`
const StyledExpandButton = styled(Button)`
  position: absolute;
  top: 100vh;
  font-weight: 600;
  width: calc(100% - 30px);
  color: black;
  transform: translateY(-100%);
`

const FundingIntroductionPane: React.VFC<{
  introduction: string
  projectPlans: ProjectPlanProps[]
}> = ({ introduction, projectPlans }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { formatMessage } = useIntl()
  const [isPlanListSticky, setIsPlanListSticky] = useState(false)
  const planListHeightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (projectPlans) {
      setIsPlanListSticky(window.innerHeight > (planListHeightRef.current?.clientHeight || 0) + 104)
    }
  }, [projectPlans])

  return (
    <div className="container">
      <div className="row mb-5">
        <TabPaneContent className="col-12 col-lg-8" collapsed={collapsed}>
          {<BraftContent>{introduction}</BraftContent>}

          {collapsed && (
            <Responsive.Default>
              <StyledExpandButton onClick={() => setCollapsed(false)}>
                {formatMessage(commonMessages.button.expand)}
              </StyledExpandButton>
            </Responsive.Default>
          )}
        </TabPaneContent>

        <div className="col-12 col-lg-4">
          <div className={`${isPlanListSticky ? 'positionSticky' : ''}`} ref={planListHeightRef}>
            <ProjectPlanCollection projectPlans={projectPlans} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FundingIntroductionPane

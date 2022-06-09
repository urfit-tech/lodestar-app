import { Button } from 'antd'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled, { css } from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { ProjectPlanProps } from '../../types/project'
import Responsive, { BREAK_POINT } from '../common/Responsive'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import ProjectPlanCollection from './ProjectPlanCollection'
import ClassCouponBlock from '../../components/ClassCouponBlock'

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

  return (
    <div className="container">
      <div className="row">
        <TabPaneContent className="col-12 col-lg-8 mb-5" collapsed={collapsed}>
          {<BraftContent>{introduction}</BraftContent>}

          {collapsed && (
            <Responsive.Default>
              <StyledExpandButton onClick={() => setCollapsed(false)}>
                {formatMessage(commonMessages.button.expand)}
              </StyledExpandButton>
            </Responsive.Default>
          )}
        </TabPaneContent>

        <div className="col-12 col-lg-4 mb-5">
          <Responsive.Desktop>
            <ClassCouponBlock />
          </Responsive.Desktop>
          <ProjectPlanCollection projectPlans={projectPlans} />
        </div>
      </div>
    </div>
  )
}

export default FundingIntroductionPane

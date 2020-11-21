import { Collapse, Icon, Typography } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { ProjectPlanProps } from '../../types/project'
import ProjectPlanCollection from './ProjectPlanCollection'

const StyledWrapper = styled.div`
  margin-bottom: 3.5rem;
`
const StyledHeader = styled.div`
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 5px solid ${props => props.theme['@primary-color']};
`
const StyledTitle = styled(Typography.Title)`
  && {
    margin-bottom: 0.25rem;
    font-size: 20px;
  }
`
const StyledMeta = styled.div`
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
`
const StyledCollapse = styled(Collapse)`
  && {
    border: none;
    background: none;

    > div {
      margin-bottom: 0.75rem;
      padding: 0;
      border: none;
      background: #f7f8f8;
    }
    .ant-collapse-header {
      font-weight: bold;
      padding: 1.25rem;
    }
    .ant-collapse-content {
      border: none;
    }
    .ant-collapse-content-box {
      padding: 1rem 2rem;
    }
  }
`

const FundingContentsPane: React.FC<{
  contents: {
    title: string
    subtitle: string
    contents: {
      title: string
      description: string
    }[]
  }[]
  projectPlans: ProjectPlanProps[]
}> = ({ contents, projectPlans }) => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 mb-5">
          {contents.map(content => (
            <StyledWrapper key={content.title}>
              <StyledHeader>
                <StyledTitle level={2}>{content.title}</StyledTitle>
                <StyledMeta>{content.subtitle}</StyledMeta>
              </StyledHeader>

              <StyledCollapse
                accordion
                expandIconPosition="right"
                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
              >
                {content.contents.map((content, index) => (
                  <Collapse.Panel header={content.title} key={content.title + index}>
                    <div dangerouslySetInnerHTML={{ __html: content.description }} />
                  </Collapse.Panel>
                ))}
              </StyledCollapse>
            </StyledWrapper>
          ))}
        </div>
        <div className="col-12 col-lg-4 mb-5">
          <ProjectPlanCollection projectPlans={projectPlans} />
        </div>
      </div>
    </div>
  )
}

export default FundingContentsPane

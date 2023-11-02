import { Affix, Button, Tabs } from 'antd'
import React, { useRef } from 'react'
import { useIntl } from 'react-intl'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { StringParam, useQueryParam } from 'use-query-params'
import { BREAK_POINT } from '../../components/common/Responsive'
import DefaultLayout from '../../components/layout/DefaultLayout'
import FundingCommentsPane from '../../components/project/FundingCommentsPane'
import FundingContentsPane from '../../components/project/FundingContentsPane'
import FundingCoverBlock from '../../components/project/FundingCoverBlock'
import FundingIntroductionPane from '../../components/project/FundingIntroductionPane'
import FundingPlansPane from '../../components/project/FundingPlansPane'
import FundingSummaryBlock from '../../components/project/FundingSummaryBlock'
import FundingUpdatesPane from '../../components/project/FundingUpdatesPane'
import { commonMessages, productMessages } from '../../helpers/translation'
import EmptyCover from '../../images/empty-cover.png'
import { ProjectProps } from '../../types/project'

const StyledCover = styled.div`
  padding-top: 2.5rem;
`
const StyledTabs = styled(Tabs)`
  overflow: unset;
  .ant-tabs-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    border: 0;

    .ant-tabs-extra-content {
      float: none !important;
      order: 1;
      padding-left: 18px;
      width: 33.333333%;
    }

    .ant-tabs-tab.ant-tabs-tab {
      padding: 1.5rem 1rem;
    }
  }
  .ant-tabs-content {
    padding-top: 2.5rem;
  }
`
const StyledSupportButtonWrapper = styled.div`
  @media (max-width: ${BREAK_POINT - 1}px) {
    z-index: 1000;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 0.25rem 0.75rem;
    background: white;
  }
`
const StyledTabBarWrapper = styled.div`
  border-bottom: 1px solid #e8e8e8;
  background: white;
`
const StyledBadge = styled.div<{ count: number }>`
  position: relative;

  ::after {
    display: block;
    position: absolute;
    top: -12px;
    right: -16px;
    color: ${props => props.theme['@primary-color']};
    content: '${props => props.count}';
    font-size: 14px;
    font-weight: normal;
  }
`

const FundingPage: React.VFC<ProjectProps> = ({
  id,
  type,
  expiredAt,
  coverType,
  coverUrl,
  previewUrl,
  title,
  abstract,
  description,
  targetAmount,
  targetUnit,
  introduction,
  introductionDesktop,
  projectSections,
  projectPlans,
  isParticipantsVisible,
  isCountdownTimerVisible,
  totalSales,
  enrollmentCount,
  publishedAt,
}) => {
  const { formatMessage } = useIntl()
  const isDesktop = useMediaQuery({ minWidth: BREAK_POINT })
  const [activeKey, setActiveKey] = useQueryParam('tabkey', StringParam)
  const tabRef = useRef<HTMLDivElement>(null)

  const handleTabsChange = (activeKey: string) => {
    tabRef.current && tabRef.current.scrollIntoView()
    setActiveKey(activeKey)
  }

  return (
    <DefaultLayout white noFooter>
      <StyledCover className="container mb-4">
        <div className="row">
          <div className="col-12 col-lg-8">
            <FundingCoverBlock
              coverType={coverType}
              coverUrl={coverUrl || EmptyCover}
              previewUrl={previewUrl || EmptyCover}
            />
          </div>
          <div className="col-12 col-lg-4">
            <FundingSummaryBlock
              projectId={id}
              title={title}
              abstract={abstract || ''}
              description={description || ''}
              targetAmount={targetAmount}
              targetUnit={targetUnit}
              expiredAt={expiredAt}
              type={type}
              isParticipantsVisible={isParticipantsVisible}
              isCountdownTimerVisible={isCountdownTimerVisible}
              totalSales={totalSales}
              enrollmentCount={enrollmentCount}
            />
          </div>
        </div>
      </StyledCover>

      <div ref={tabRef}>
        <StyledTabs
          activeKey={activeKey || 'introduction'}
          onChange={handleTabsChange}
          size="large"
          tabBarExtraContent={
            <StyledSupportButtonWrapper>
              {expiredAt && expiredAt.getTime() < Date.now() ? (
                <Button size="large" block disabled>
                  {formatMessage(commonMessages.button.cutoff)}
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={() => handleTabsChange('plans')}
                  disabled={!publishedAt}
                >
                  {formatMessage(commonMessages.button.pledge)}
                </Button>
              )}
            </StyledSupportButtonWrapper>
          }
          renderTabBar={(props, DefaultTabBar) => {
            const TabBar = DefaultTabBar
            return (
              <Affix target={() => document.getElementById('layout-content')}>
                <StyledTabBarWrapper>
                  <div className="container">
                    <TabBar {...props} />
                  </div>
                </StyledTabBarWrapper>
              </Affix>
            )
          }}
        >
          <Tabs.TabPane tab={formatMessage(productMessages.project.tab.intro)} key="introduction">
            {projectPlans && (
              <FundingIntroductionPane
                introduction={(isDesktop && introductionDesktop ? introductionDesktop : introduction) || ''}
                projectPlans={projectPlans}
                publishedAt={publishedAt}
              />
            )}
          </Tabs.TabPane>
          {projectSections &&
            projectSections.map(projectSection =>
              projectSection.type === 'funding_contents' ? (
                <Tabs.TabPane tab={projectSection.options.title} key="contents">
                  <FundingContentsPane
                    contents={projectSection.options.items}
                    projectPlans={projectPlans || []}
                    publishedAt={publishedAt}
                  />
                </Tabs.TabPane>
              ) : projectSection.type === 'funding_updates' ? (
                <Tabs.TabPane
                  tab={
                    <StyledBadge count={projectSection.options.items.length}>
                      {projectSection.options.title}
                    </StyledBadge>
                  }
                  key="updates"
                >
                  <FundingUpdatesPane
                    updates={projectSection.options.items}
                    projectPlans={projectPlans || []}
                    publishedAt={publishedAt}
                  />
                </Tabs.TabPane>
              ) : projectSection.type === 'funding_comments' ? (
                <Tabs.TabPane tab={projectSection.options.title} key="comments">
                  <FundingCommentsPane
                    comments={projectSection.options.items}
                    projectPlans={projectPlans || []}
                    publishedAt={publishedAt}
                  />
                </Tabs.TabPane>
              ) : null,
            )}

          <Tabs.TabPane tab={formatMessage(productMessages.project.tab.project)} key="plans">
            <FundingPlansPane projectPlans={projectPlans || []} publishedAt={publishedAt} />
          </Tabs.TabPane>
        </StyledTabs>
      </div>
    </DefaultLayout>
  )
}

export default FundingPage

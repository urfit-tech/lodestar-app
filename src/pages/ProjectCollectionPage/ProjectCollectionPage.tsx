import { Icon } from '@chakra-ui/icons'
import { Button, Icon as AntdIcon } from 'antd'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { flatten, prop, sortBy, uniqBy } from 'ramda'
import React, { useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import { AiFillAppstore } from 'react-icons/ai'
import { defineMessages, useIntl } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import { StyledBannerTitle } from '../../components/layout'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProjectIntroCard from '../../components/project/ProjectIntroCard'
import { notEmpty } from '../../helpers'
import { commonMessages } from '../../helpers/translation'
import { useNav } from '../../hooks/data'
import { useProjectIntroCollection } from '../../hooks/project'
import { FundraisingIcon, PreOrderIcon, PromotionIcon } from '../../images'
import { Category } from '../../types/general'
import ProjectCollectionPageHelmet from './ProjectCollectionPageHelmet'

const messages = defineMessages({
  exploreProjects: { id: 'project.label.exploreProjects', defaultMessage: '探索專案' },
  onSaleProject: { id: 'project.label.onSaleProject', defaultMessage: '促銷專案' },
  preOrderProject: { id: 'project.label.preOrderProject', defaultMessage: '預購專案' },
  fundingProject: { id: 'project.label.fundingProject', defaultMessage: '募資專案' },
  onSale: { id: 'project.text.onSale', defaultMessage: '促銷' },
  preOrder: { id: 'project.text.preOrder', defaultMessage: '預購' },
  funding: { id: 'project.text.funding', defaultMessage: '募資' },
  people: {
    id: 'common.unit.people',
    defaultMessage: '{projectType} {count, plural, one {人} other {人}}',
  },
  onSaleCountDownDays: {
    id: 'project.label.onSaleCountDownDays',
    defaultMessage: '{projectType}倒數 {days} {days, plural, one {天} other {天}}',
  },
  isExpired: { id: 'project.label.isExpired', defaultMessage: '已結束' },
  isExpiredFunding: { id: 'project.label.isExpiredFunding', defaultMessage: '專案結束' },
})

const StyledCoverSection = styled.section`
  padding: 3.5rem 0;
  background-color: var(--gray-lighter);
`
const StyledContentSection = styled.section`
  padding: 5rem 0;
`
const StyledTitle = styled.h2`
  color: var(--gray-darker);
  font-size: 28px;
  font-weight: bold;

  i {
    color: ${props => props.theme['@primary-color']};
  }
`

const ProjectCollectionPage: React.VFC = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { id: appId } = useApp()
  const tracking = useTracking()
  const [defaultActive] = useQueryParam('active', StringParam)
  const [noSelector] = useQueryParam('noSelector', BooleanParam)
  const [title] = useQueryParam('title', StringParam)
  const [noSubtitle] = useQueryParam('noSubtitle', BooleanParam)
  const { projects } = useProjectIntroCollection({ categoryId: defaultActive || undefined })
  const { pageTitle } = useNav()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(defaultActive || null)

  const categories: Category[] = sortBy(prop('position'))(
    uniqBy(category => category.id, flatten(projects.map(project => project.categories).filter(notEmpty))),
  )
  const { resourceCollection } = useResourceCollection(
    appId ? projects.map(project => `${appId}:project:${project.id}`) : [],
    true,
  )

  useEffect(() => {
    if (projects) {
      let index = 1
      for (let project of projects) {
        if (project.projectPlans) {
          for (let projectPlan of project.projectPlans) {
            ReactGA.plugin.execute('ec', 'addImpression', {
              id: projectPlan.id,
              name: `${project.title} - ${projectPlan.title}`,
              category: 'ProjectPlan',
              price: `${projectPlan.listPrice}`,
              position: index,
            })
            index += 1
          }
        }
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [projects])

  useEffect(() => {
    setSelectedCategoryId(defaultActive || null)
  }, [defaultActive])

  const projectSections = [
    {
      id: 'funding',
      icon: <Icon as={FundraisingIcon} />,
      title: formatMessage(messages.fundingProject),
    },
    {
      id: 'pre-order',
      icon: <Icon as={PreOrderIcon} />,
      title: formatMessage(messages.preOrderProject),
    },
    {
      id: 'on-sale',
      icon: <Icon as={PromotionIcon} />,
      title: formatMessage(messages.onSaleProject),
    },
  ]

  return (
    <DefaultLayout white>
      {projects && <ProjectCollectionPageHelmet projects={projects} />}
      <Tracking.Impression resources={resourceCollection} />
      <StyledCoverSection>
        <div className="container">
          <StyledBannerTitle>
            <Icon as={AiFillAppstore} className="mr-2" />
            <span>{title || pageTitle || formatMessage(messages.exploreProjects)}</span>
          </StyledBannerTitle>

          {noSelector || (
            <Button
              type={selectedCategoryId === null ? 'primary' : 'default'}
              shape="round"
              className="mb-2"
              onClick={() => setSelectedCategoryId(null)}
            >
              {formatMessage(commonMessages.button.allCategory)}
            </Button>
          )}
          {noSelector ||
            categories.map(category => (
              <Button
                key={category.id}
                type={selectedCategoryId === category.id ? 'primary' : 'default'}
                shape="round"
                className="ml-2 mb-2"
                onClick={() => setSelectedCategoryId(category.id)}
              >
                {category.name}
              </Button>
            ))}
        </div>
      </StyledCoverSection>

      <StyledContentSection>
        <div className="container">
          {defaultActive ? (
            <div className="row">
              {projects
                .filter(
                  project =>
                    !selectedCategoryId || project.categories.some(category => category.id === selectedCategoryId),
                )
                .map((project, idx) => (
                  <div key={project.id} className="col-12 col-lg-4 mb-5">
                    <Link
                      to={`/projects/${project.id}`}
                      onClick={() => {
                        const resource = resourceCollection
                          .filter(notEmpty)
                          .find(resource => resource.id === project.id)
                        resource && tracking.click(resource, { position: idx + 1 })
                      }}
                    >
                      <ProjectIntroCard {...project} />
                    </Link>
                  </div>
                ))}
            </div>
          ) : (
            projectSections
              .filter(
                projectSection =>
                  projects.filter(
                    project =>
                      project.type === projectSection.id &&
                      (!selectedCategoryId || project.categories.some(category => category.id === selectedCategoryId)),
                  ).length,
              )
              .map(projectSection => (
                <div key={projectSection.id} className="mb-4">
                  {!noSubtitle && (
                    <StyledTitle className="mb-5">
                      <AntdIcon component={() => projectSection.icon} className="mr-2" />
                      <span>{projectSection.title}</span>
                    </StyledTitle>
                  )}
                  <div className="row">
                    {projects
                      .filter(
                        project =>
                          project.type === projectSection.id &&
                          (!selectedCategoryId ||
                            project.categories.some(category => category.id === selectedCategoryId)),
                      )
                      .map((project, idx) => (
                        <div
                          key={project.id}
                          className="col-12 col-lg-4 mb-5 cursor-pointer"
                          onClick={() => {
                            const resource = resourceCollection
                              .filter(notEmpty)
                              .find(resource => resource.id === project.id)
                            resource && tracking.click(resource, { position: idx + 1 })
                            project.id && history.push(`/projects/${project.id}`)
                          }}
                        >
                          <ProjectIntroCard {...project} />
                        </div>
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </StyledContentSection>
    </DefaultLayout>
  )
}

export default ProjectCollectionPage

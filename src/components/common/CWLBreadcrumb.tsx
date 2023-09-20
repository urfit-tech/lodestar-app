import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import styled from 'styled-components'
import { Post } from '../../types/blog'
import { Program } from '../../types/program'

const BreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
`

const BreadcrumbItem = styled.a`
  margin: 5px;
  font-size: 16px;
  color: #333;
  transition: 0.2s;
  &:first-child {
    margin-left: 0;
  }
  &:hover {
    color: #000;
  }
  @media screen and (max-width: 768px) {
    margin: 4px;
    font-size: 14px;
  }
`

const CWLBreadcrumb: React.VFC<{
  program?: Program
  programPackage?: any
  post?: Post
  project?: { id: string; title: string }
}> = ({ program, programPackage, post, project }) => {
  const { navs } = useApp()
  const footerNavs = navs.filter(nav => nav.block === 'footer')
  const breadcrumbConfig: any = {
    home: {
      label: '首頁',
      url: '/',
    },
  }
  let containerClassName = 'container'

  // 線上課程
  if (program) {
    const programs: any = footerNavs.find(nav => nav.label === '線上課程')
    const categoryLinks = programs?.subNavs.map((subNav: any) => {
      return { label: subNav.label, url: subNav.href }
    })

    const programCategory = program.categories[0]?.name
    const matchCategory = categoryLinks.find((categoryLink: any) => categoryLink.label === programCategory)

    breadcrumbConfig.programs = {
      label: '線上課程',
      url: '/programs',
    }

    if (matchCategory?.label && matchCategory?.url) {
      breadcrumbConfig.category = matchCategory
    }
    breadcrumbConfig.program = {
      label: program.title,
      url: `/programs/${program.id}`,
    }
  }

  // 套裝課程
  if (programPackage) {
    const packages: any = footerNavs.find(nav => nav.label === '套裝課程')
    const categoryLinks = packages?.subNavs.map((subNav: any) => {
      return { label: subNav.label, url: subNav.href }
    })
    const matchCategory = categoryLinks.filter((link: any) => {
      return programPackage.categories.some((category: any) => category === link.label)
    })

    breadcrumbConfig.package = {
      label: '套裝課程',
      url: '/packages',
    }

    if (matchCategory.length > 0) {
      breadcrumbConfig.category = matchCategory[0]
    }
    breadcrumbConfig.programPackage = {
      label: programPackage.title,
      url: `/program-packages/${programPackage.id}`,
    }
  }

  // 專欄文章
  if (post) {
    breadcrumbConfig.package = {
      label: '專欄文章',
      url: '/blog',
    }
    breadcrumbConfig.posts = {
      label: post.title,
      url: `/posts/${post.id}`,
    }
    containerClassName = 'container container-post-page'
  }

  // 實體課程
  if (project) {
    breadcrumbConfig.package = {
      label: '實體課程',
      url: '/projects',
    }
    breadcrumbConfig.posts = {
      label: project.title,
      url: `/projects/${project.id}`,
    }
  }

  return (
    <>
      {(program || programPackage || post || project) && (
        <div className={containerClassName} style={{ margin: '15px auto' }}>
          <BreadcrumbList>
            {Object.keys(breadcrumbConfig).map((key: any, index) => {
              const breadcrumb = breadcrumbConfig[key]
              const isLastItem = index + 1 === Object.keys(breadcrumbConfig).length
              return (
                <li style={{ marginRight: '10px' }}>
                  <BreadcrumbItem href={breadcrumb.url}>{breadcrumb.label}</BreadcrumbItem>
                  {!isLastItem && <span style={{ color: '#999' }}> /</span>}
                </li>
              )
            })}
          </BreadcrumbList>
        </div>
      )}
    </>
  )
}

export default CWLBreadcrumb

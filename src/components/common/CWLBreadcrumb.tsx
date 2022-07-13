import React from 'react'
import styled from 'styled-components'
import { Program } from '../../types/program'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'

const BlockContainer = styled.div`
  margin-top: 15px
`
const Breadcrumb = styled.a`
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
}> = ({ program }) => {
  const { navs } = useApp()
  const footerNavs = navs.filter(nav => nav.block === 'footer')
  const breadcrumbConfig: any = {
    home: {
      label: '首頁',
      url: '/index'
    },
  }

  // 線上課程
  if (program) {
    const programs: any = footerNavs.find(nav => nav.label === '線上課程')
    const categoryLinks = programs?.subNavs.map((subNav: any) => {
      return { label: subNav.label, url: subNav.href }
    })
    const programCategory = program.categories[0].name
    const matchCategory = categoryLinks.find((categoryLink: any) => categoryLink.label === programCategory)
    
    breadcrumbConfig.programs = {
      label: '線上課程',
      url: '/programs'
    }
    if (matchCategory) {
      breadcrumbConfig.category = matchCategory
    }
    breadcrumbConfig.program = {
      label: program.title,
      url: `/programs/${program.id}`
    }
  }

  return (
    <BlockContainer className="container">
      {
        Object.keys(breadcrumbConfig).map((key: any, index) => {
          const breadcrumb = breadcrumbConfig[key]
          const isLastItem = index + 1 === Object.keys(breadcrumbConfig).length
          return (
            <>
              <Breadcrumb href={breadcrumb.url}>{ breadcrumb.label }</Breadcrumb>
              {
                !isLastItem &&
                <> / </>
              }
            </>
          )
        })
      }
    </BlockContainer>
  )
}

export default CWLBreadcrumb

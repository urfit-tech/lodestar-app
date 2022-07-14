import React from 'react'
import styled from 'styled-components'
import { Program } from '../../types/program'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'

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
}> = ({ program, programPackage }) => {
  const { navs } = useApp()
  const footerNavs = navs.filter(nav => nav.block === 'footer')
  const breadcrumbConfig: any = {
    home: {
      label: '首頁',
      url: '/'
    },
  }

  console.log('programPackage', programPackage)

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
    <>
      {
        program &&
        <div className="container" style={{marginTop: '15px'}}>
          <BreadcrumbList>
            {
              Object.keys(breadcrumbConfig).map((key: any, index) => {
                const breadcrumb = breadcrumbConfig[key]
                const isLastItem = index + 1 === Object.keys(breadcrumbConfig).length
                return (
                  <li style={{marginRight: '10px'}}>
                    <BreadcrumbItem href={breadcrumb.url}>{ breadcrumb.label }</BreadcrumbItem>
                    {
                      !isLastItem &&
                      <span style={{color: '#999'}}> /</span>
                    }
                  </li>
                )
              })
            }
          </BreadcrumbList>
        </div>
      }
    </>
  )
}

export default CWLBreadcrumb

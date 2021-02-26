import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import ActivitySection from '../components/page/ActivitySection'
import CoverSection from '../components/page/CoverSection'
import CreatorSection from '../components/page/CreatorSection'
import PostSection from '../components/page/PostSection'
import ProgramSection from '../components/page/ProgramSection'
import { AppPageProps, AppPageSectionProps } from '../hooks/page'

export const SectionTitle = styled.div<{ white?: boolean }>`
  margin: 0 auto;
  margin-bottom: 40px;
  font-weight: bold;
  font-size: 28px;
  letter-spacing: 0.23px;
  text-align: center;
  color: var(--gray-color);
`
export const StyledLink = styled(Link)<{ $backgroundActive?: string }>`
  & .ant-btn-primary:active {
    background: ${props =>
      props.$backgroundActive ? props.$backgroundActive : props.theme['@primary-color']} !important;
  }
  margin-top: 40px;
`

const AppPage: React.FC<{ page: AppPageProps }> = ({ page }) => {
  return (
    <DefaultLayout>
      {page.appPageSections.map((section: AppPageSectionProps) => {
        switch (section.type) {
          case 'homeCover':
            return <CoverSection key={section.id} options={section.options} />
          case 'homeActivity':
            return <ActivitySection key={section.id} options={section.options} />
          case 'homeProgram':
            return <ProgramSection key={section.id} options={section.options} />
          case 'homePost':
            return <PostSection key={section.id} options={section.options} />
          case 'homeProgramCategory':
            return <ProgramSection key={section.id} options={section.options} />
          case 'homeCreator':
            return <CreatorSection key={section.id} options={section.options} />
          default:
            return <div key={section.id}></div>
        }
      })}
    </DefaultLayout>
  )
}

export default AppPage

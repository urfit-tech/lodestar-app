import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import MessengerChat from '../components/common/MessengerChat'
import DefaultLayout from '../components/layout/DefaultLayout'
import ActivitySection from '../components/page/ActivitySection'
import CoverSection from '../components/page/CoverSection'
import CreatorSection from '../components/page/CreatorSection'
import PostSection from '../components/page/PostSection'
import ProgramSection from '../components/page/ProgramSection'
import { AppPageProps } from '../hooks/page'

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
  display: flex;
  justify-content: center;
  align-items: center;
  & .ant-btn-primary:active {
    background: ${props =>
      props.$backgroundActive ? props.$backgroundActive : props.theme['@primary-color']} !important;
  }
  margin-top: 40px;
`
export const StyledSection = styled.section`
  padding: 64px 0;
  background: white;
`

const AppPage: React.VFC<{ page: AppPageProps }> = ({ page }) => {
  const sectionConverter = {
    homeActivity: ActivitySection,
    homeCover: CoverSection,
    homeCreator: CreatorSection,
    homePost: PostSection,
    homeProgram: ProgramSection,
    homeProgramCategory: ProgramSection,
    messenger: MessengerChat,
  }

  return (
    <DefaultLayout>
      {page.appPageSections.map(section => {
        const Section = sectionConverter[section.type]
        if (!sectionConverter[section.type]) {
          return <></>
        }
        return <Section key={section.id} options={section.options} />
      })}
    </DefaultLayout>
  )
}

export default AppPage

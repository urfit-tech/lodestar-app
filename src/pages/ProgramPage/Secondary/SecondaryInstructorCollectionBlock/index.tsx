import { Box, TabList, TabPanels, Tabs } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import React from 'react'
import styled from 'styled-components'
import { Program, ProgramRole } from '../../../../types/program'
import CollapseContent from './CollapseContent'
import CollapseContentCard from './CollapseContentCard'
import InstructorPanel from './InstructorPanel'
import InstructorTab from './InstructorTab'
import NormalContent from './NormalContent'

const CollapseContentWrapper = styled(Box)`
  display: grid;
  grid-row-gap: 12px;
  margin-top: 24px;
  grid-template-columns: 1fr;
  place-items: center;
  padding-bottom: 24px;
`

const SecondaryInstructorCollectionBlock: React.VFC<{
  program: Program & {
    roles: ProgramRole[]
  }
  title?: string
}> = ({ program }) => {
  const instructors = [
    {
      name: '黃麗燕',
      nameWithEnglish: '黃麗燕 Margaret',
      avatarUrl: '',
      instructorSubtitle: '品牌操盤手',
      programs: [
        { id: '12345', title: '超屌課程', imgSrc: '' },
        { id: '123456', title: '超屌課程', imgSrc: '' },
      ],
      podcasts: [
        { id: '12345', title: '超屌廣播', imgSrc: '' },
        { id: '123467', title: '超屌廣播', imgSrc: '' },
      ],
      articles: [
        { id: '12345', title: '超屌文章', imgSrc: '' },
        { id: '123467', title: '超屌文章', imgSrc: '' },
      ],
    },
    {
      name: '高一成',
      nameWithEnglish: '高一成 Logan',
      avatarUrl: '',
      instructorSubtitle: '工程高手',
      programs: [
        { id: '12345', title: 'L超屌課程', imgSrc: '' },
        { id: '123456', title: 'L超屌課程', imgSrc: '' },
      ],
      podcasts: [
        { id: '12345', title: 'L超屌廣播', imgSrc: '' },
        { id: '123467', title: 'L超屌廣播', imgSrc: '' },
      ],
      articles: [
        { id: '12345', title: 'L超屌文章', imgSrc: '' },
        { id: '123467', title: 'L超屌文章', imgSrc: '' },
      ],
    },
  ]

  return (
    <Tabs variant="unstyled">
      <TabList justifyContent="center" gap={8}>
        {instructors.map(instructor => (
          <InstructorTab key={instructor.name}>{instructor.name}</InstructorTab>
        ))}
      </TabList>
      <TabPanels>
        {instructors.map(instructor => (
          <InstructorPanel
            key={instructor.name}
            instructorInfo={{
              instructorName: instructor.nameWithEnglish,
              avatarUrl: instructor.avatarUrl,
              instructorSubtitle: instructor.instructorSubtitle,
            }}
          >
            <NormalContent title="介紹">
              <BraftContent>{'TODO: use member.description'}</BraftContent>
            </NormalContent>
            <CollapseContent title={`開設課程(${instructor.programs.length})`}>
              <CollapseContentWrapper>
                {instructor.programs.map(program => (
                  <CollapseContentCard imgSrc={program.imgSrc} href={'TODO'} key={program.id}>
                    {program.title}
                  </CollapseContentCard>
                ))}
              </CollapseContentWrapper>
            </CollapseContent>
            <CollapseContent title={`廣播頻道(${instructor.podcasts.length})`}>
              <CollapseContentWrapper>
                {instructor.podcasts.map(podcast => (
                  <CollapseContentCard imgSrc={podcast.imgSrc} href={'TODO'} key={podcast.id}>
                    {podcast.title}
                  </CollapseContentCard>
                ))}
              </CollapseContentWrapper>
            </CollapseContent>
            <CollapseContent title={`媒體文章(${instructor.articles.length})`}>
              <CollapseContentWrapper>
                {instructor.articles.map(article => (
                  <CollapseContentCard imgSrc={article.imgSrc} href={'TODO'} key={article.id}>
                    {article.title}
                  </CollapseContentCard>
                ))}
              </CollapseContentWrapper>
            </CollapseContent>
          </InstructorPanel>
        ))}
      </TabPanels>
    </Tabs>
  )
}

export default SecondaryInstructorCollectionBlock

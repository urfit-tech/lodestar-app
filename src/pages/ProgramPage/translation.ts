import { defineMessages } from 'react-intl'

const ProgramPageMessages = {
  PreviewBlock: defineMessages({
    previous: {
      id: 'page.PreviewBlock.PreviewPlayer.previous',
      defaultMessage: '上一則',
    },
    next: {
      id: 'page.PreviewBlock.PreviewPlayer.next',
      defaultMessage: '下一則',
    },
  }),
  ProgramIntroTabs: defineMessages({
    introduction: {
      id: 'page.ProgramIntroTabs.introduction',
      defaultMessage: '簡介',
    },
    catalog: {
      id: 'page.ProgramIntroTabs.catalog',
      defaultMessage: '目錄',
    },
    chapter: {
      id: 'page.ProgramIntroTabs.chapter',
      defaultMessage: '章節',
    },
    author: {
      id: 'page.ProgramIntroTabs.author',
      defaultMessage: '作者',
    },
    courseInstructor: {
      id: 'page.ProgramIntroTabs.courseInstructor',
      defaultMessage: '講師',
    },
  }),
  Secondary: defineMessages({
    expectedStart: {
      id: 'page.SecondaryProgramInfoCard.expectedStart',
      defaultMessage: '預計開課',
    },
    expectedDuration: {
      id: 'page.SecondaryProgramInfoCard.expectedDuration',
      defaultMessage: '預計時長',
    },
    expectedChapters: {
      id: 'page.SecondaryProgramInfoCard.expectedChapters',
      defaultMessage: '預計章節',
    },
    fullyListed: {
      id: 'page.SecondaryProgramInfoCard.fullyListed',
      defaultMessage: '全數上架',
    },
  }),
  SecondaryInstructorCollectionBlock: defineMessages({
    course: {
      id: 'page.CollapseContentBlock.course',
      defaultMessage: '開設課程({count})',
    },
    podcastChannel: {
      id: 'page.CollapseContentBlock.podcastChannel',
      defaultMessage: '廣播頻道({count})',
    },
    mediaArticle: {
      id: 'page.CollapseContentBlock.mediaArticle',
      defaultMessage: '媒體文章({count})',
    },
  }),
}

export default ProgramPageMessages

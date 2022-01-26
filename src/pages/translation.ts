import { defineMessages } from 'react-intl'

const pageMessages = {
  '*': defineMessages({
    cancel: { id: 'page.*.cancel', defaultMessage: '取消' },
  }),
  // ProgramContentPage
  ProgramContentPage: defineMessages({
    foo: { id: 'page.ProgramContentPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentPage.bar', defaultMessage: 'Bar Message' },
  }),
  ProgramContentTabs: defineMessages({
    foo: { id: 'page.ProgramContentTabs.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramContentTabs.bar', defaultMessage: 'Bar Message' },
  }),
  // ProgramPage
  ProgramPage: defineMessages({
    foo: { id: 'page.ProgramPage.foo', defaultMessage: 'Foo Message' },
    bar: { id: 'page.ProgramPage.bar', defaultMessage: 'Bar Message' },
  }),
}

export default pageMessages

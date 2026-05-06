import React from 'react'
import { renderToString } from 'react-dom/server'
import EbookProgramPageContent from '.'

jest.mock('@chakra-ui/react', () => {
  const React = require('react')
  const makeComponent =
    (tag: string) =>
    ({ children, className, href }: { children?: React.ReactNode; className?: string; href?: string }) =>
      React.createElement(tag, { className, href }, children)

  return {
    Box: makeComponent('div'),
    Button: makeComponent('button'),
    Flex: makeComponent('div'),
    Link: makeComponent('a'),
    Spinner: makeComponent('div'),
    Text: makeComponent('span'),
  }
})

jest.mock('lodestar-app-element/src/components/common/StyledBraftEditor', () => ({
  BraftContent: ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({
  useApp: () => ({ enabledModules: {} }),
}))

jest.mock('lodestar-app-element/src/helpers', () => ({
  desktopViewMixin: (styles: unknown) => styles,
}))

jest.mock('react-router', () => ({
  useLocation: () => ({ pathname: '/programs/program-id', search: '' }),
}))

jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({
    formatMessage: (message: { defaultMessage?: string; id?: string }) => message.defaultMessage || message.id || '',
  }),
}))

jest.mock('../../../../components/review/ReviewCollectionBlock', () => () => <div />)
jest.mock('../../../../hooks/program', () => ({
  useProgramPlansEnrollmentsAggregateList: () => ({
    loading: false,
    programPlansEnrollmentsAggregateList: [],
  }),
}))
jest.mock('../../Secondary/ProgramIntroTabs', () => () => <div />)
jest.mock('../../Secondary/SecondaryProgramPlanCard', () => () => <div />)
jest.mock('../../Secondary/SocialSharePopover', () => ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
))

describe('EbookProgramPageContent', () => {
  it('renders without a styled-components ThemeProvider', () => {
    const program = {
      id: '29bd3cf0-4ed2-4b95-a628-4caa2a785122',
      title: '版型三',
      abstract: '',
      description: '',
      moduleData: {
        '40a760a4-bca4-4249-be8d-8d6d611de807': 'subtitle',
      },
      coverUrl: null,
      coverMobileUrl: null,
      coverVideoUrl: null,
      plans: [],
      contentSections: [],
    } as any

    expect(() => renderToString(<EbookProgramPageContent program={program} />)).not.toThrow()
  })
})

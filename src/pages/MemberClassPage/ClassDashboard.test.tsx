import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import ClassDashboard from './ClassDashboard'

jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({
    formatMessage: (message: { defaultMessage?: string; id?: string }) => message.defaultMessage || message.id || '',
  }),
}))

jest.mock('./CalendarView', () => {
  const React = require('react')
  return () => React.createElement('div', { 'data-testid': 'calendar-view' })
})

jest.mock('./NextUpCard', () => {
  const React = require('react')
  return () => React.createElement('div', { 'data-testid': 'next-up-card' })
})

jest.mock('./CourseSummaryCard', () => {
  const React = require('react')
  return () => React.createElement('div', { 'data-testid': 'course-summary-card' })
})

jest.mock('./TeachingSummaryCard', () => {
  const React = require('react')
  return () => React.createElement('div', { 'data-testid': 'teaching-summary-card' })
})

const renderDashboard = () => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  act(() => {
    ReactDOM.render(<ClassDashboard summaries={[]} events={[]} viewAs="student" />, root)
  })

  return root
}

const getButton = (root: HTMLElement, label: string) =>
  Array.from(root.querySelectorAll('button')).find(button => button.textContent === label) as HTMLButtonElement

describe('ClassDashboard', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('keeps the active calendar view button visible when theme primary color is unavailable', () => {
    const root = renderDashboard()

    const weekButton = getButton(root, '週')

    expect(weekButton).toBeTruthy()
    expect(window.getComputedStyle(weekButton).backgroundColor).toBe('rgb(45, 49, 58)')
    expect(window.getComputedStyle(weekButton).color).toBe('white')
  })
})

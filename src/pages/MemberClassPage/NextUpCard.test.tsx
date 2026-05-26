import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import NextUpCard from './NextUpCard'
import { CalendarEvent, CalendarEventStatus, CourseType } from './types'

jest.mock('axios')
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({
  useAuth: () => ({
    authToken: 'auth-token',
    currentMemberId: 'student-member-id',
  }),
}))
jest.mock('react-intl', () => ({
  defineMessages: (messages: unknown) => messages,
  useIntl: () => ({
    formatMessage: (message: { defaultMessage?: string; id?: string }) => message.defaultMessage || message.id || '',
  }),
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

const formatDate = (date: Date) => date.toISOString().split('T')[0]
const formatTime = (date: Date) => date.toTimeString().slice(0, 5)
const makeZoomWindow = () =>
  ({
    close: jest.fn(),
    focus: jest.fn(),
    location: { href: '' },
    opener: window,
  } as unknown as Window)

const makeUpcomingOnlineEvent = (): CalendarEvent => {
  const start = new Date(Date.now() + 5 * 60 * 1000)
  const end = new Date(Date.now() + 55 * 60 * 1000)

  return {
    id: 'f4de352b-df77-455b-8ff1-e620a8eea4b2',
    title: '123',
    day: 'Thu',
    startTime: formatTime(start),
    endTime: formatTime(end),
    date: formatDate(start),
    teacher: '金秀妍',
    location: '401',
    isExternal: false,
    status: CalendarEventStatus.Published,
    courseType: CourseType.Group,
    needOnlineRoom: true,
    material: '123',
  }
}

const renderCard = (event = makeUpcomingOnlineEvent()) => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  act(() => {
    ReactDOM.render(<NextUpCard event={event} viewAs="student" />, root)
  })

  return root
}

const getZoomButton = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('button')).find(button => button.textContent === '開啟 Zoom') as HTMLButtonElement

describe('NextUpCard', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset()
    window.open = jest.fn(() => makeZoomWindow())
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  const renderCardAs = (event: CalendarEvent, viewAs: 'student' | 'teacher') => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    act(() => {
      ReactDOM.render(<NextUpCard event={event} viewAs={viewAs} />, root)
    })
    return root
  }

  const findStudentRow = (root: HTMLElement) =>
    Array.from(root.querySelectorAll('span')).find(s => s.textContent?.startsWith('學生：'))

  it('shows the student name for a personal class in teacher view', () => {
    const event: CalendarEvent = {
      ...makeUpcomingOnlineEvent(),
      courseType: CourseType.Private,
      students: ['小明'],
    }
    const root = renderCardAs(event, 'teacher')
    expect(findStudentRow(root)?.textContent).toBe('學生：小明')
  })

  it('shows comma-separated names for a semester class in teacher view', () => {
    const event: CalendarEvent = {
      ...makeUpcomingOnlineEvent(),
      courseType: CourseType.Term,
      students: ['A', 'B'],
    }
    const root = renderCardAs(event, 'teacher')
    expect(findStudentRow(root)?.textContent).toBe('學生：A, B')
  })

  it('falls back to "團體班" when a group class has no student names', () => {
    const event: CalendarEvent = {
      ...makeUpcomingOnlineEvent(),
      courseType: CourseType.Group,
      students: undefined,
    }
    const root = renderCardAs(event, 'teacher')
    expect(findStudentRow(root)?.textContent).toBe('學生：團體班')
  })

  it('falls back to "學期班" when a term class has no student names', () => {
    const event: CalendarEvent = {
      ...makeUpcomingOnlineEvent(),
      courseType: CourseType.Term,
      students: undefined,
    }
    const root = renderCardAs(event, 'teacher')
    expect(findStudentRow(root)?.textContent).toBe('學生：學期班')
  })

  it('keeps the Zoom button visible when theme primary color is unavailable', () => {
    const root = renderCard()

    const zoomButton = getZoomButton(root)

    expect(zoomButton).toBeTruthy()
    expect(zoomButton.disabled).toBe(false)
    expect(window.getComputedStyle(zoomButton).backgroundColor).toBe('rgb(45, 49, 58)')
    expect(window.getComputedStyle(zoomButton).color).toBe('white')
  })

  it('creates an event meeting by time and navigates a user-opened tab without requiring hostMemberId on the event', async () => {
    const zoomWindow = makeZoomWindow()
    ;(window.open as jest.Mock).mockReturnValue(zoomWindow)
    mockedAxios.post.mockResolvedValue({
      data: {
        code: 'SUCCESS',
        data: {
          link: 'https://zoom.example.com/join',
          meetingId: 'meet-id',
        },
      },
    })

    const root = renderCard()
    const zoomButton = getZoomButton(root)

    await act(async () => {
      Simulate.click(zoomButton)
      await Promise.resolve()
    })

    expect(window.open).toHaveBeenCalledWith('', '_blank')
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/kolable\/meets\/by-time$/),
      expect.not.objectContaining({ hostMemberId: expect.anything() }),
      {
        headers: { authorization: 'Bearer auth-token' },
      },
    )
    expect(mockedAxios.post.mock.calls[0][1]).not.toHaveProperty('autoRecording')
    expect(zoomWindow.location.href).toBe('https://zoom.example.com/join')
    expect(zoomWindow.focus).toHaveBeenCalled()
  })
})

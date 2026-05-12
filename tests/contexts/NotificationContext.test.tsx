import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import NotificationContext, { NotificationProvider } from '@/contexts/NotificationContext'

const mockRefetchNotifications = vi.fn(() => Promise.resolve())
const mockNotifications: [] = []

vi.mock('@/hooks/data', () => ({
  useNotifications: () => ({
    loadingNotifications: false,
    errorNotifications: undefined,
    notifications: mockNotifications,
    unreadCount: 0,
    refetchNotifications: mockRefetchNotifications,
  }),
}))

describe('NotificationProvider', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    vi.useFakeTimers()
    mockRefetchNotifications.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    vi.useRealTimers()
  })

  it('keeps the context value stable when only internal initialization state changes', () => {
    let renderCount = 0

    const Consumer = React.memo(() => {
      useContext(NotificationContext)
      renderCount += 1
      return null
    })

    act(() => {
      render(
        <NotificationProvider>
          <Consumer />
        </NotificationProvider>,
        container,
      )
    })

    expect(renderCount).toBe(1)

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(mockRefetchNotifications).toHaveBeenCalledTimes(1)
    expect(renderCount).toBe(1)
  })
})

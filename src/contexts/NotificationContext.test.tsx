import React, { useContext } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import NotificationContext, { NotificationProvider } from './NotificationContext'

const mockRefetchNotifications = jest.fn(() => Promise.resolve())
const mockNotifications: [] = []

jest.mock('../hooks/data', () => ({
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
    jest.useFakeTimers()
    mockRefetchNotifications.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    unmountComponentAtNode(container)
    container.remove()
    jest.useRealTimers()
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
      jest.advanceTimersByTime(2000)
    })

    expect(mockRefetchNotifications).toHaveBeenCalledTimes(1)
    expect(renderCount).toBe(1)
  })
})

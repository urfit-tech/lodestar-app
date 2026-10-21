import { expect, it, jest } from '@jest/globals'
import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { authCooldownKey, useAuthCooldown } from './authCooldown'

it('honors long retryAfter, persists across remounts and isolates members', () => {
  jest.useFakeTimers('modern')
  sessionStorage.clear()
  let cooldown: ReturnType<typeof useAuthCooldown>
  const root = document.createElement('div')
  const Consumer = ({ identity }: { identity: string }) => {
    cooldown = useAuthCooldown(authCooldownKey('app', 'verify', identity))
    return <span>{cooldown.remaining}</span>
  }
  act(() => {
    ReactDOM.render(<Consumer identity="member-a" />, root)
  })
  act(() => {
    cooldown.start(3600)
  })
  expect(root.textContent).toBe('3600')
  act(() => {
    jest.advanceTimersByTime(1000)
  })
  expect(root.textContent).toBe('3599')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  act(() => {
    ReactDOM.render(<Consumer identity="member-a" />, root)
  })
  expect(root.textContent).toBe('3599')
  act(() => {
    ReactDOM.render(<Consumer identity="member-b" />, root)
  })
  expect(root.textContent).toBe('0')
  act(() => {
    cooldown.start(60)
    jest.advanceTimersByTime(60000)
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  jest.useRealTimers()
})

it('seeds the legacy reset-login cooldown once without shortening server retryAfter or restarting on remount', () => {
  jest.useFakeTimers('modern')
  sessionStorage.clear()
  const root = document.createElement('div')
  let cooldown: ReturnType<typeof useAuthCooldown>
  const Consumer = () => {
    cooldown = useAuthCooldown(authCooldownKey('app', 'reset', 'test@example.com'), 60)
    return <span>{cooldown.remaining}</span>
  }
  const mount = () => ReactDOM.render(<Consumer />, root)
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('60')
  act(() => {
    cooldown.start(3600)
  })
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('3600')
  act(() => {
    jest.advanceTimersByTime(3600000)
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  jest.useRealTimers()
})

it('a new reset-login request renews an expired cooldown, while refreshing its URL does not', () => {
  jest.useFakeTimers('modern')
  sessionStorage.clear()
  const root = document.createElement('div')
  let requestedAt = Date.now()
  const Consumer = () => (
    <span>{useAuthCooldown(authCooldownKey('app', 'reset', 'test@example.com'), 60, requestedAt).remaining}</span>
  )
  const mount = () => ReactDOM.render(<Consumer />, root)
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('60')
  act(() => {
    jest.advanceTimersByTime(60000)
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  requestedAt = Date.now()
  act(() => {
    mount()
  })
  expect(root.textContent).toBe('60')
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  jest.useRealTimers()
})

it('a late response for the previous account does not lock the newly selected account', () => {
  sessionStorage.clear()
  const root = document.createElement('div')
  let cooldown: ReturnType<typeof useAuthCooldown>
  const Consumer = ({ identity }: { identity: string }) => {
    cooldown = useAuthCooldown(authCooldownKey('app', 'reset', identity))
    return <span>{cooldown.remaining}</span>
  }
  act(() => {
    ReactDOM.render(<Consumer identity="first" />, root)
  })
  const previousRequestCompleted = cooldown!.start
  act(() => {
    ReactDOM.render(<Consumer identity="second" />, root)
  })
  act(() => {
    previousRequestCompleted(3600)
  })
  expect(root.textContent).toBe('0')
  act(() => {
    ReactDOM.render(<Consumer identity="first" />, root)
  })
  expect(Number(root.textContent)).toBeGreaterThan(3590)
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
})

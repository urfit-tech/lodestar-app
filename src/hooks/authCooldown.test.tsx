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

import { beforeEach, expect, it, jest } from '@jest/globals'
import React from 'react'
import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import ForgotPasswordPage from './ForgotPasswordPage'

const mockPost = jest.fn()
const mockPush = jest.fn()
const mockMessage = jest.fn()
let mockSubmit: any
const mockForm = {
  validateFields: (callback: any) => callback(null, { email: 'test@example.com' }),
  getFieldDecorator: () => (element: any) => element,
}
jest.mock('axios', () => ({ __esModule: true, default: { post: (...args: any[]) => mockPost(...args) } }))
jest.mock('react-router-dom', () => ({ useHistory: () => ({ push: mockPush }) }))
jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({ useApp: () => ({ id: 'app' }) }))
jest.mock('react-intl', () => ({
  defineMessages: (messages: any) => messages,
  useIntl: () => ({
    formatMessage: (descriptor: any, values?: any) =>
      (descriptor.defaultMessage || descriptor.id).replace('{seconds}', values?.seconds),
  }),
}))
jest.mock('../components/layout/DefaultLayout', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('../components/common/MigrationInput', () => ({
  __esModule: true,
  default: (props: any) => <input onChange={props.onChange} />,
}))
jest.mock('../components/common/Responsive', () => ({ BREAK_POINT: 768 }))
jest.mock('antd', () => {
  const Form = (props: any) => {
    mockSubmit = props.onSubmit || props.onFinish
    return <div>{props.children}</div>
  }
  Form.Item = ({ children }: any) => <div>{children}</div>
  Form.create = () => (Component: any) => () => <Component form={mockForm} />
  return {
    Form,
    Input: (props: any) => <input onChange={props.onChange} />,
    Icon: () => null,
    Button: ({ children, disabled }: any) => <button disabled={disabled}>{children}</button>,
    message: { info: (...args: any[]) => mockMessage(...args), error: (...args: any[]) => mockMessage(...args) },
  }
})

beforeEach(() => {
  sessionStorage.clear()
  mockPost.mockReset()
  mockPush.mockReset()
  mockMessage.mockReset()
})

it.each(['http', 'legacy'])(
  'a %s rate limit disables resubmission and shows the full retryAfter',
  async (kind: string) => {
    jest.useFakeTimers('modern')
    const body = { code: 'E_TOO_MANY_ATTEMPTS', retryAfter: 3600 }
    if (kind === 'http') mockPost.mockRejectedValue({ response: { status: 429, data: body } })
    else mockPost.mockResolvedValue({ data: body })
    const root = document.createElement('div')
    act(() => {
      ReactDOM.render(<ForgotPasswordPage />, root)
    })
    // Send input through React's event handler so the hook and form use the same account key.
    const input = root.querySelector('input')!
    act(() => {
      Simulate.change(input, { target: { value: 'test@example.com' } } as any)
    })
    await act(async () => {
      mockSubmit({ preventDefault: () => undefined })
    })
    expect(root.querySelector('button')!.disabled).toBe(true)
    expect(root.textContent).toContain('3600')
    expect(mockMessage).toHaveBeenCalledWith('請 3600 秒後再試')
    await act(async () => {
      mockSubmit({ preventDefault: () => undefined })
    })
    expect(mockPost).toHaveBeenCalledTimes(1)
    act(() => {
      jest.advanceTimersByTime(3600000)
    })
    expect(root.querySelector('button')!.disabled).toBe(false)
    expect(mockPush).not.toHaveBeenCalled()
    act(() => {
      ReactDOM.unmountComponentAtNode(root)
    })
    jest.useRealTimers()
  },
)

it.each(['SUCCESS', 'E_NO_MEMBER'])('legacy %s uses the same 60-second check-email flow', async (code: string) => {
  mockPost.mockResolvedValue({ data: { code, result: null } })
  const root = document.createElement('div')
  act(() => {
    ReactDOM.render(<ForgotPasswordPage />, root)
  })
  act(() => {
    Simulate.change(root.querySelector('input')!, { target: { value: 'test@example.com' } } as any)
  })
  await act(async () => {
    mockSubmit({ preventDefault: () => undefined })
  })
  expect(mockPush).toHaveBeenCalledWith('/check-email?email=test%40example.com&type=forgot-password')
  expect(mockMessage).toHaveBeenCalledWith('請 60 秒後再試')
  expect(Number(sessionStorage.getItem('auth-cooldown:app:reset:test@example.com'))).toBeGreaterThan(Date.now())
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
})

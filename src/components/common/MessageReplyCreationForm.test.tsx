import React from 'react'
import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'
import MessageReplyCreationForm from './MessageReplyCreationForm'

const mockResetFields = jest.fn()
const mockError = jest.fn()
const mockPoll = jest.fn()

jest.mock('antd', () => {
  const React = require('react')
  const Form = (props: any) => <form onSubmit={props.onSubmit}>{props.children}</form>
  Form.Item = (props: any) => <div>{props.children}</div>
  Form.create = () => (Component: any) => (props: any) =>
    (
      <Component
        {...props}
        form={{
          validateFields: (callback: any) => callback(null, { content: { toRAW: () => 'reply' } }),
          resetFields: mockResetFields,
          getFieldDecorator: () => (child: React.ReactNode) => child,
        }}
      />
    )
  return { Form, message: { error: (...args: any[]) => mockError(...args) } }
})
jest.mock('@chakra-ui/react', () => ({
  Button: (props: any) => (
    <button type={props.type} disabled={props.disabled}>
      {props.children}
    </button>
  ),
}))
jest.mock('braft-editor', () => {
  const Editor = () => null
  Editor.createEditorState = () => null
  return Editor
})
jest.mock('@apollo/client', () => ({ useApolloClient: () => ({}) }))
jest.mock('lodestar-app-element/src/contexts/AppContext', () => ({
  useApp: () => ({ id: 'app', settings: { 'program_issue.prompt_reply': '1' } }),
}))
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({ useAuth: () => ({ currentMemberId: 'member' }) }))
jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({ formatMessage: () => 'Reply' }),
}))
jest.mock('../../helpers', () => ({ createUploadFn: () => jest.fn() }))
jest.mock('./MemberAvatar', () => () => null)
jest.mock('../issue/issueHelper', () => ({
  getTheNextReplyNotFromAuthorOfIssue: () => () => () => undefined,
  pollUntilTheNextReplyNotFromAuthorOfIssueUpdated: (...args: any[]) => mockPoll(...args),
}))

let container: HTMLDivElement
beforeEach(() => {
  jest.clearAllMocks()
  container = document.createElement('div')
})
afterEach(() => {
  ReactDOM.unmountComponentAtNode(container)
})

it('renders without an issue and disables submission when no handler exists', () => {
  act(() => {
    ReactDOM.render(<MessageReplyCreationForm />, container)
  })
  expect(container.querySelector('button')?.disabled).toBe(true)
})

it('accepts a generic reply with no issue response and does not start issue polling', async () => {
  const onSubmit = jest.fn<Promise<void>, [unknown]>().mockResolvedValue(undefined)
  act(() => {
    ReactDOM.render(<MessageReplyCreationForm onSubmit={onSubmit} />, container)
  })
  await act(async () => {
    Simulate.submit(container.querySelector('form')!)
  })
  expect(onSubmit).toHaveBeenCalledWith('reply')
  expect(mockResetFields).toHaveBeenCalledTimes(1)
  expect(mockError).not.toHaveBeenCalled()
  expect(mockPoll).not.toHaveBeenCalled()
})

it('shows submit failures and keeps the reply for retry', async () => {
  const onSubmit = jest.fn<Promise<void>, [unknown]>().mockRejectedValue(new Error('save failed'))
  act(() => {
    ReactDOM.render(<MessageReplyCreationForm onSubmit={onSubmit} />, container)
  })
  await act(async () => {
    Simulate.submit(container.querySelector('form')!)
  })
  expect(mockError).toHaveBeenCalledWith('save failed')
  expect(mockResetFields).not.toHaveBeenCalled()
})

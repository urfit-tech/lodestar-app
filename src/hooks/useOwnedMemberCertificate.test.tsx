import { ApolloClient, ApolloLink, ApolloProvider, InMemoryCache, Observable } from '@apollo/client'
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import { print } from 'graphql'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useOwnedMemberCertificate } from './useOwnedMemberCertificate'

let mockAuth = { currentMemberId: 'holder' as string | null, authToken: 'holder-token' as string | null }
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({ useAuth: () => mockAuth }))
const ID = '12345678-1234-4234-8234-123456789abc'
const row = {
  id: ID,
  member_id: 'holder',
  number: 'CERT-001',
  values: { name: '持有人' },
  delivered_at: '2026-10-01',
  expired_at: null,
  certificate: {
    id: 'certificate',
    title: '原版證書',
    description: '',
    code: '',
    qualification: '',
    period_type: null,
    period_amount: null,
    created_at: '2026-10-01',
    updated_at: '2026-10-01',
    meta_tag: null,
    certificate_template: {
      id: 'template',
      template: '<div>PRIVATE TEMPLATE</div>',
      background_image: 'private-background.png',
    },
  },
}
let root: HTMLDivElement
let client: ApolloClient<unknown>
let operations: Array<{ variables: any; query: string; headers: any }>
let response: typeof row | null
let fail: boolean
let enabled: boolean
let id: string
const Probe = () => {
  const result = useOwnedMemberCertificate(id, enabled)
  return <div>{result.loading ? 'loading' : result.data?.certificate.template || 'public-only'}</div>
}
const rerender = () =>
  act(() => {
    ReactDOM.render(
      <ApolloProvider client={client}>
        <Probe />
      </ApolloProvider>,
      root,
    )
  })
const flush = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 0)))
beforeEach(() => {
  mockAuth = { currentMemberId: 'holder', authToken: 'holder-token' }
  response = row
  fail = false
  enabled = true
  id = ID
  operations = []
  client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new ApolloLink(
      operation =>
        new Observable(observer => {
          operations.push({
            variables: operation.variables,
            query: print(operation.query),
            headers: operation.getContext().headers,
          })
          Promise.resolve().then(() => {
            if (fail) observer.error(new Error('permission denied'))
            else {
              observer.next({ data: { member_certificate: response ? [response] : [] } })
              observer.complete()
            }
          })
        }),
    ),
  })
  root = document.createElement('div')
  document.body.appendChild(root)
})
afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  root.remove()
  client.stop()
})

it('never queries private data for anonymous visitors or before the public lookup succeeds', async () => {
  mockAuth = { currentMemberId: null, authToken: null }
  rerender()
  await flush()
  expect(operations).toHaveLength(0)
  expect(root.textContent).toBe('public-only')
  mockAuth = { currentMemberId: 'holder', authToken: 'holder-token' }
  enabled = false
  rerender()
  await flush()
  expect(operations).toHaveLength(0)
})
it('uses the holder token with both certificate and owner filters and does not cache private results', async () => {
  rerender()
  await flush()
  expect(root.textContent).toContain('PRIVATE TEMPLATE')
  expect(operations).toHaveLength(1)
  expect(operations[0].variables).toEqual({ id: ID, memberId: 'holder' })
  expect(operations[0].headers).toEqual({ Authorization: 'Bearer holder-token' })
  expect(operations[0].query).toContain('id: {_eq: $id}, member_id: {_eq: $memberId}')
  expect(JSON.stringify(client.cache.extract())).not.toContain('PRIVATE TEMPLATE')
})
it('keeps non-owners on the public view even when a broad role can read another owner row', async () => {
  mockAuth = { currentMemberId: 'app-owner', authToken: 'app-owner-token' }
  rerender()
  await flush()
  expect(operations[0].variables.memberId).toBe('app-owner')
  expect(root.textContent).toBe('public-only')
})
it('drops private content immediately on logout without clearing Apollo externally', async () => {
  rerender()
  await flush()
  expect(root.textContent).toContain('PRIVATE TEMPLATE')
  mockAuth = { currentMemberId: null, authToken: null }
  rerender()
  expect(root.textContent).toBe('public-only')
  await flush()
  expect(operations).toHaveLength(1)
})
it('drops private content on account change and rejects a stale response for the old account', async () => {
  rerender()
  await flush()
  mockAuth = { currentMemberId: 'other', authToken: 'other-token' }
  rerender()
  expect(root.textContent).not.toContain('PRIVATE TEMPLATE')
  await flush()
  expect(root.textContent).toBe('public-only')
  expect(operations[1].headers.Authorization).toBe('Bearer other-token')
})
it('rejects a stale response for another certificate', async () => {
  rerender()
  await flush()
  id = '22222222-2222-4222-8222-222222222222'
  rerender()
  await flush()
  expect(root.textContent).toBe('public-only')
})
it('falls back to public display on private-query denial or no owned certificate', async () => {
  fail = true
  rerender()
  await flush()
  expect(root.textContent).toBe('public-only')
  fail = false
  response = null
  id = '22222222-2222-4222-8222-222222222222'
  rerender()
  await flush()
  expect(root.textContent).toBe('public-only')
})

it('treats uppercase UUID links as the same owned certificate', async () => {
  id = ID.toUpperCase()
  rerender()
  await flush()
  expect(operations[0].variables.id).toBe(ID)
  expect(root.textContent).toContain('PRIVATE TEMPLATE')
})

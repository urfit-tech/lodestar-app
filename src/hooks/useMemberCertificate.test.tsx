import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import { Mock } from 'jest-mock'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { getSharedCertificate } from '../helpers/publicResource'
import { SharedCertificate } from '../types/certificate'
import { useMemberCertificate } from './certificate'

jest.mock('../helpers/publicResource')
const lookup = getSharedCertificate as unknown as Mock<Promise<SharedCertificate>, [string]>

const shared = (title: string): SharedCertificate => ({
  holderName: '持有人',
  certificateTitle: title,
  deliveredAt: '2026-10-01',
  expiredAt: null,
  number: 'CERT-001',
})
let pending: Record<string, { resolve: (value: SharedCertificate) => void; reject: (error: unknown) => void }>
let root: HTMLDivElement
let id: string
const Probe = () => {
  const { data, loading } = useMemberCertificate(id)
  return <div>{loading ? 'loading' : data?.certificateTitle || 'none'}</div>
}
const rerender = () =>
  act(() => {
    ReactDOM.render(<Probe />, root)
  })
const flush = () => act(() => new Promise<void>(resolve => setTimeout(resolve, 0)))
beforeEach(() => {
  pending = {}
  lookup.mockReset().mockImplementation(
    (certificateId: string) =>
      new Promise<SharedCertificate>((resolve, reject) => {
        pending[certificateId] = { resolve, reject }
      }),
  )
  id = 'a'
  root = document.createElement('div')
  document.body.appendChild(root)
})
afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  root.remove()
})

it('reports loading from the first render, then shows the certificate', async () => {
  rerender()
  expect(root.textContent).toBe('loading')
  pending.a.resolve(shared('證書 A'))
  await flush()
  expect(root.textContent).toBe('證書 A')
  expect(lookup).toHaveBeenCalledTimes(1)
  expect(lookup).toHaveBeenCalledWith('a')
})

it('ignores a stale response after the id changes', async () => {
  rerender()
  id = 'b'
  rerender()
  expect(root.textContent).toBe('loading')
  pending.a.resolve(shared('證書 A'))
  await flush()
  expect(root.textContent).toBe('loading')
  pending.b.resolve(shared('證書 B'))
  await flush()
  expect(root.textContent).toBe('證書 B')
})

it('stops loading on a failed lookup and does not retry', async () => {
  rerender()
  pending.a.reject(new Error('404'))
  await flush()
  rerender()
  await flush()
  expect(root.textContent).toBe('none')
  expect(lookup).toHaveBeenCalledTimes(1)
})

it('does not request without an id', async () => {
  id = ''
  rerender()
  await flush()
  expect(root.textContent).toBe('none')
  expect(lookup).not.toHaveBeenCalled()
})

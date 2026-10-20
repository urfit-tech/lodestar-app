import { afterAll, beforeEach, expect, it, jest } from '@jest/globals'
import axios from 'axios'
import { Mock } from 'jest-mock'
import { getSharedCertificate, recordResourceView } from './publicResource'

jest.mock('axios')
const get = axios.get as Mock<Promise<unknown>, unknown[]>
const post = axios.post as Mock<Promise<unknown>, unknown[]>
const originalBase = process.env.REACT_APP_API_BASE_ROOT
beforeEach(() => {
  jest.clearAllMocks()
  process.env.REACT_APP_API_BASE_ROOT = '/api/v1'
})
afterAll(() => {
  if (originalBase === undefined) delete process.env.REACT_APP_API_BASE_ROOT
  else process.env.REACT_APP_API_BASE_ROOT = originalBase
})

it('reads a public certificate without a viewer identity or bearer token', async () => {
  const result = {
    holderName: '持有人',
    certificateTitle: '證書',
    number: '1',
    deliveredAt: '2026-10-20',
    expiredAt: null,
  }
  get.mockResolvedValue({ data: { result } })
  expect(await getSharedCertificate('certificate-id')).toEqual(result)
  expect(get).toHaveBeenCalledWith('/api/v1/public/certificates/certificate-id')
})
it('propagates missing certificates to the page error state', async () => {
  get.mockRejectedValue(new Error('404'))
  await expect(getSharedCertificate('missing')).rejects.toThrow('404')
})
it.each(['program', 'post', 'project'] as Array<'program' | 'post' | 'project'>)(
  'records %s without sending an app id, role or increment',
  async type => {
    post.mockResolvedValue({ status: 204 })
    await recordResourceView(type, 'resource-id')
    expect(post).toHaveBeenCalledWith(`/api/v1/public/views/${type}/resource-id`)
  },
)
it.each([429, 503])('does not break reading or retry when the backend returns %s', async status => {
  post.mockRejectedValue({ response: { status } })
  await expect(recordResourceView('program', 'resource-id')).resolves.toBeUndefined()
  expect(post).toHaveBeenCalledTimes(1)
})
it('encodes a resource id as one URL segment', async () => {
  post.mockResolvedValue({ status: 204 })
  await recordResourceView('post', 'id/../?query')
  expect(post).toHaveBeenCalledWith('/api/v1/public/views/post/id%2F..%2F%3Fquery')
})

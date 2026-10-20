import axios from 'axios'
import { SharedCertificate } from '../types/certificate'

const publicApi = () => `${process.env.REACT_APP_API_BASE_ROOT || '/api/v1'}/public`

export const getSharedCertificate = async (id: string): Promise<SharedCertificate> => {
  const { data } = await axios.get<{ result: SharedCertificate }>(
    `${publicApi()}/certificates/${encodeURIComponent(id)}`,
  )
  return data.result
}

// View tracking must never interrupt reading a page. The backend owns deduplication;
// 204 includes repeats, while 429/503 are best-effort misses, never retried in a loop.
export const recordResourceView = async (type: 'program' | 'post' | 'project', id: string): Promise<void> => {
  try {
    await axios.post(`${publicApi()}/views/${type}/${encodeURIComponent(id)}`)
  } catch {
    // No fallback to an anonymous Hasura mutation.
  }
}

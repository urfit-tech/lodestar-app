import { expect, it, jest } from '@jest/globals'
import { renderToStaticMarkup } from 'react-dom/server'
import CertificateContentBlock from './CertificateContentBlock'

jest.mock('html2canvas', () => () => Promise.resolve(null))
jest.mock('@chakra-ui/react', () => ({ Button: ({ children }: any) => <button>{children}</button> }))
jest.mock('react-intl', () => ({
  defineMessages: (messages: any) => messages,
  useIntl: () => ({ formatMessage: (_message: any, values: any) => Object.values(values || {}).join(' ') }),
}))
jest.mock('../../components/common/CertificateCard', () => ({
  StyledCode: ({ children }: any) => <span>{children}</span>,
  StyledDate: ({ children }: any) => <span>{children}</span>,
}))
jest.mock('../../components/common/SocialSharePopover', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))
// Any accidental lookup of the viewer's identity must fail the test.
jest.mock('lodestar-app-element/src/contexts/AuthContext', () => ({
  useAuth: () => {
    throw new Error('Public certificate must not read viewer identity')
  },
}))

it('renders the actual holder and all display fields without a login context', () => {
  const html = renderToStaticMarkup(
    <CertificateContentBlock
      memberCertificate={{
        holderName: '證書持有人',
        certificateTitle: '完成證書',
        number: 'CERT-001',
        deliveredAt: '2026-10-01',
        expiredAt: '2027-10-01',
      }}
    />,
  )
  for (const text of ['證書持有人', '完成證書', 'CERT-001', '2026/10/01', '2027/10/01']) {
    expect(html).toContain(text)
  }
})
it('renders untrusted display values as text, without HTML execution', () => {
  const html = renderToStaticMarkup(
    <CertificateContentBlock
      memberCertificate={{
        holderName: '<img src=x onerror=alert(1)>',
        certificateTitle: '<script>alert(2)</script>',
        number: 'CERT-001',
        deliveredAt: '2026-10-01',
        expiredAt: null,
      }}
    />,
  )
  expect(html).not.toContain('<img')
  expect(html).not.toContain('<script>')
  expect(html).toContain('&lt;img')
  expect(html).toContain('&lt;script&gt;')
})

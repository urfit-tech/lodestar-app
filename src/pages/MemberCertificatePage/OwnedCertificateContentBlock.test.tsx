import { afterEach, beforeEach, expect, it, jest } from '@jest/globals'
import html2canvas from 'html2canvas'
import { Mock, SpyInstance } from 'jest-mock'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { MemberCertificate } from '../../types/certificate'
import OwnedCertificateContentBlock from './OwnedCertificateContentBlock'

jest.mock('html2canvas')
jest.mock('@chakra-ui/react', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))
jest.mock('react-intl', () => ({
  defineMessages: (messages: any) => messages,
  useIntl: () => ({
    formatMessage: (message: any, values: any) => (values ? Object.values(values).join(' ') : message.defaultMessage),
  }),
}))
jest.mock('lodestar-app-element/src/components/common/StyledBraftEditor', () => ({
  BraftContent: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('../../components/common/CertificateCard', () => ({
  StyledCode: ({ children }: any) => <span>{children}</span>,
  StyledDate: ({ children }: any) => <span>{children}</span>,
}))
jest.mock('../../components/common/SocialSharePopover', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}))
const certificate: MemberCertificate = {
  id: 'owned-id',
  memberId: 'holder',
  number: 'CERT-001',
  values: { name: '發證姓名' },
  deliveredAt: new Date('2026-10-01'),
  expiredAt: null,
  certificate: {
    id: 'certificate',
    title: '正式證書',
    description: '說明',
    qualification: '資格',
    code: '',
    periodType: null,
    periodAmount: null,
    createdAt: new Date('2026-10-01'),
    metaTag: {},
    template:
      '<div style="position: relative;"><div style="background-image: url({{backgroundImage}})"><b>{{name}}</b><span>{{number}}</span></div></div>',
    templateImage: 'https://example.com/original-background.png',
  },
}
const capture = html2canvas as unknown as Mock<Promise<{ toDataURL: () => string }>, [HTMLElement, any]>
let root: HTMLDivElement
let anchorClick: SpyInstance<void, []>
let width: SpyInstance<number, []>
beforeEach(() => {
  capture.mockReset().mockResolvedValue({ toDataURL: () => 'data:image/png;base64,certificate' })
  width = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1200)
  anchorClick = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  root = document.createElement('div')
  document.body.appendChild(root)
})
afterEach(() => {
  act(() => {
    ReactDOM.unmountComponentAtNode(root)
  })
  root.remove()
  anchorClick.mockRestore()
  width.mockRestore()
})
it('renders and downloads the original template with its background and issued values', async () => {
  act(() => {
    ReactDOM.render(<OwnedCertificateContentBlock memberCertificate={certificate} holderName="公開姓名" />, root)
  })
  expect(root.innerHTML).toContain('original-background.png')
  expect(root.textContent).toContain('發證姓名')
  await act(async () => {
    root.querySelector('button')!.click()
    await Promise.resolve()
  })
  expect(capture).toHaveBeenCalledTimes(1)
  const [target, options] = capture.mock.calls[0]
  expect(target.innerHTML).toContain('original-background.png')
  expect(target.querySelector('b')?.textContent).toBe('發證姓名')
  expect(target.textContent).toContain('CERT-001')
  expect(options).toMatchObject({ allowTaint: true, useCORS: true, scale: 2 })
  expect(anchorClick).toHaveBeenCalledTimes(1)
})
it('sanitizes after inserting template variables in both visible and downloadable templates', async () => {
  const malicious = {
    ...certificate,
    values: { name: '<img src=x onerror=alert(1)>' },
    certificate: {
      ...certificate.certificate,
      template: '<div style="position: relative;"><div>{{{name}}}<script>alert(2)</script></div></div>',
    },
  }
  act(() => {
    ReactDOM.render(<OwnedCertificateContentBlock memberCertificate={malicious} holderName="持有人" />, root)
  })
  expect(root.querySelector('script')).toBeNull()
  expect(root.querySelector('[onerror]')).toBeNull()
  await act(async () => {
    root.querySelector('button')!.click()
    await Promise.resolve()
  })
  expect(capture.mock.calls[0][0].querySelector('[onerror]')).toBeNull()
})

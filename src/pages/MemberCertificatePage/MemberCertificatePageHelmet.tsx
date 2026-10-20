import PageHelmet from '../../components/common/PageHelmet'
import { SharedCertificate } from '../../types/certificate'

const MemberCertificatePageHelmet: React.FC<{ memberCertificate: SharedCertificate }> = ({ memberCertificate }) => (
  <PageHelmet
    title={memberCertificate.certificateTitle}
    isNoIndex
    openGraph={[
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: memberCertificate.certificateTitle },
      { property: 'og:url', content: window.location.href },
    ]}
  >
    <meta name="referrer" content="no-referrer" />
  </PageHelmet>
)

export default MemberCertificatePageHelmet

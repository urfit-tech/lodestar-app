import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useContext } from 'react'
import PageHelmet from '../../components/common/PageHelmet'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getOgLocale } from '../../helpers'
import { MemberCertificate } from '../../types/certificate'

const MemberCertificatePageHelmet: React.FC<{ memberCertificate: MemberCertificate }> = ({ memberCertificate }) => {
  const app = useApp()
  const { defaultLocale } = useContext(LocaleContext)
  const ogLocale = getOgLocale(defaultLocale)

  return (
    <PageHelmet
      title={memberCertificate.certificate?.metaTag?.seo?.pageTitle || memberCertificate.certificate.title}
      description={
        memberCertificate.certificate?.metaTag?.seo?.description || memberCertificate.certificate.description || ''
      }
      keywords={memberCertificate.certificate?.metaTag?.seo?.keywords?.split(',') || []}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:site_name', content: app.settings['name'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        {
          property: 'og:title',
          content:
            memberCertificate.certificate?.metaTag?.openGraph?.title ||
            memberCertificate.certificate?.title ||
            app.settings['open_graph.title'] ||
            app.settings['title'],
        },
        {
          property: 'og:description',
          content: getBraftContent(
            memberCertificate.certificate?.metaTag?.openGraph?.description ||
              memberCertificate.certificate?.description ||
              app.settings['open_graph.description'] ||
              app.settings['description'] ||
              '{}',
          )?.slice(0, 150),
        },
        { property: 'og:locale', content: ogLocale },
        {
          property: 'og:image',
          content:
            memberCertificate.certificate?.metaTag?.openGraph?.image ||
            app.settings['open_graph.image'] ||
            app.settings['logo'],
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: memberCertificate.certificate?.metaTag?.openGraph?.imageAlt || '' },
      ]}
    />
  )
}

export default MemberCertificatePageHelmet

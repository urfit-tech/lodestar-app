import { SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import CertificateCard from '../../components/common/CertificateCard'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { useCertificateColleaction } from '../../hooks/certificate'
import { ReactComponent as MemberCertificateIcon } from '../../images/certificate.svg'
import ForbiddenPage from '../ForbiddenPage'

const CertificatesCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const app = useApp()
  const { certificates } = useCertificateColleaction()

  if (app.loading) {
    return (
      <DefaultLayout>
        <SkeletonText mt="1" noOfLines={4} spacing="4" />
      </DefaultLayout>
    )
  }

  if (!app.loading && !app.enabledModules.certificate) {
    return <ForbiddenPage />
  }

  return (
    <MemberAdminLayout
      content={{ icon: MemberCertificateIcon, title: formatMessage(commonMessages.content.certificate) }}
    >
      <div className="row">
        {certificates.map(certificate => (
          <div className="col-12 col-xl-6" key={certificate.id}>
            <CertificateCard certificate={certificate} />
          </div>
        ))}
      </div>
    </MemberAdminLayout>
  )
}

export default CertificatesCollectionAdminPage

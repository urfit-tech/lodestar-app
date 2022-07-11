import { SkeletonText } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useIntl } from 'react-intl'
import CertificateCard from '../../components/common/CertificateCard'
import DefaultLayout from '../../components/layout/DefaultLayout'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { useMemberCertificateCollection } from '../../hooks/certificate'
import { ReactComponent as MemberCertificateIcon } from '../../images/certificate.svg'
import ForbiddenPage from '../ForbiddenPage'

const CertificateCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const app = useApp()
  const { currentMemberId } = useAuth()
  const memberCertificates = useMemberCertificateCollection(currentMemberId || '')

  if (app.loading || memberCertificates.loading) {
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
        {memberCertificates.data.map(memberCertificate => (
          <div className="col-12 col-xl-6" key={memberCertificate.id}>
            <CertificateCard certificate={memberCertificate.certificate} memberCertificate={memberCertificate} />
          </div>
        ))}
      </div>
    </MemberAdminLayout>
  )
}

export default CertificateCollectionAdminPage

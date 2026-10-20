import { Box, Spinner } from '@chakra-ui/react'
import { Layout } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { StyledPageHeader } from '../../components/common/StyledPageHeader'
import { StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import { useMemberCertificate } from '../../hooks/certificate'
import { useVipTheme } from '../../hooks/member'
import { useOwnedMemberCertificate } from '../../hooks/useOwnedMemberCertificate'
import crossIcon from '../../images/times.svg'
import ForbiddenPage from '../ForbiddenPage'
import CertificateContentBlock from './CertificateContentBlock'
import MemberCertificatePageHelmet from './MemberCertificatePageHelmet'
import OwnedCertificateContentBlock from './OwnedCertificateContentBlock'

const MemberCertificatePage: React.FC = () => {
  const history = useHistory()
  const { memberCertificateId } = useParams<{ memberCertificateId: string }>()
  const { data: memberCertificate, loading: loadingMemberCertificate } = useMemberCertificate(memberCertificateId)
  const { data: ownedCertificate, loading: loadingOwnedCertificate } = useOwnedMemberCertificate(
    memberCertificateId,
    !!memberCertificate,
  )
  const { isVip } = useVipTheme()

  if (loadingMemberCertificate || loadingOwnedCertificate) {
    return (
      <Layout>
        <Box className="d-flex justify-content-center align-items-center" h="100vh">
          <Spinner />
        </Box>
      </Layout>
    )
  }

  if (!memberCertificate) {
    return <ForbiddenPage />
  }

  return (
    <Layout>
      <MemberCertificatePageHelmet memberCertificate={memberCertificate} />
      <StyledPageHeader
        isVip={isVip}
        title={memberCertificate.certificateTitle}
        backIcon={<img src={crossIcon} height={20} alt="back" />}
        onBack={() => {
          history.push('/settings/certificates')
        }}
      />
      <StyledLayoutContent>
        <div className="d-flex justify-content-center">
          {ownedCertificate ? (
            <OwnedCertificateContentBlock
              memberCertificate={ownedCertificate}
              holderName={memberCertificate.holderName}
            />
          ) : (
            <CertificateContentBlock memberCertificate={memberCertificate} />
          )}
        </div>
      </StyledLayoutContent>
    </Layout>
  )
}

export default MemberCertificatePage

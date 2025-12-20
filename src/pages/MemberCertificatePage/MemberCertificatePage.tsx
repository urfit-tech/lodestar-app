import { Box, Spinner } from '@chakra-ui/react'
import { Layout } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import { StyledPageHeader } from '../../components/common/StyledPageHeader'
import { useMemberCertificate } from '../../hooks/certificate'
import { useVipTheme } from '../../hooks/member'
import crossIcon from '../../images/times.svg'
import ForbiddenPage from '../ForbiddenPage'
import CertificateContentBlock from './CertificateContentBlock'
import MemberCertificatePageHelmet from './MemberCertificatePageHelmet'

const MemberCertificatePage: React.FC = () => {
  const history = useHistory()
  const { memberCertificateId } = useParams<{ memberCertificateId: string }>()
  const { data: memberCertificate, loading: loadingMemberCertificate } = useMemberCertificate(memberCertificateId)
  const { isVip } = useVipTheme()

  if (loadingMemberCertificate) {
    return (
      <Layout>
        <Box className="d-flex justify-content-center align-items-center" h="100vh">
          <Spinner />
        </Box>
      </Layout>
    )
  }

  if (!memberCertificate?.certificate) {
    return <ForbiddenPage />
  }

  return (
    <Layout>
      <MemberCertificatePageHelmet memberCertificate={memberCertificate} />
      <StyledPageHeader
        isVip={isVip}
        title={memberCertificate?.certificate.title}
        backIcon={<img src={crossIcon} height={20} alt="back" />}
        onBack={() => {
          history.push('/settings/certificates')
        }}
      />
      <StyledLayoutContent>
        <div className="d-flex justify-content-center">
          <CertificateContentBlock memberCertificate={memberCertificate} />
        </div>
      </StyledLayoutContent>
    </Layout>
  )
}

export default MemberCertificatePage

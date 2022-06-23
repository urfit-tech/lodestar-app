import { Layout } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { StyledLayoutContent } from '../../components/layout/DefaultLayout/DefaultLayout.styled'
import { useCertificate } from '../../hooks/certificate'
import crossIcon from '../../images/times.svg'
import { StyledPageHeader } from '../ProgramContentPage/index.styled'
import CertificateContentBlock from './CertificateContentBlock'

const CertificatePage: React.VFC = () => {
  const history = useHistory()
  const { certificateId } = useParams<{ certificateId: string }>()
  const { certificate } = useCertificate(certificateId)

  return (
    <Layout>
      <StyledPageHeader
        title={certificate.title}
        backIcon={<img src={crossIcon} height={20} />}
        onBack={() => {
          history.push('/settings/certificates')
        }}
      />
      <StyledLayoutContent>
        <div className="d-flex justify-content-center">
          <CertificateContentBlock certificate={certificate} />
        </div>
      </StyledLayoutContent>
    </Layout>
  )
}

export default CertificatePage

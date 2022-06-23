import moment from 'moment-timezone'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Certificate } from '../../types/certificate'

const StyledContainer = styled.div`
  margin-bottom: 1.25rem;
  padding: 2rem;
  overflow: hidden;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.15);
  cursor: pointer;
  @media (min-width: 992px) {
    max-width: 500px;
  }
`

const StyledTitle = styled.h1`
  margin-bottom: 1rem;
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  line-height: 1.4;
  letter-spacing: 0.77px;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const StyledAbstract = styled.div`
  margin-bottom: 1.5rem;
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`
export const StyledCode = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.4px;
  white-space: nowrap;
`
export const StyledDate = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: normal;
  white-space: nowrap;
`

const CertificateCard: React.VFC<{
  certificate: Certificate
}> = ({ certificate }) => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  return (
    <StyledContainer
      onClick={() => {
        history.push(`/certificates/${certificate.id}`)
      }}
    >
      <StyledTitle>{certificate.title}</StyledTitle>
      <StyledAbstract>{certificate.abstract}</StyledAbstract>
      <div className="d-flex justify-content-between">
        <StyledCode>
          {formatMessage(
            { id: 'common.certificateCode', defaultMessage: '證書代號：{certificateCode}' },
            {
              certificateCode: certificate.code,
            },
          )}
        </StyledCode>
        <StyledDate>
          {formatMessage(
            { id: 'common.certificateExpiredTime', defaultMessage: '證書效期：{certificateExpiredTime} 止' },
            {
              certificateExpiredTime: moment(certificate.expiredAt).format('YYYY/MM/DD hh:mm'),
            },
          )}
        </StyledDate>
      </div>
    </StyledContainer>
  )
}

export default CertificateCard

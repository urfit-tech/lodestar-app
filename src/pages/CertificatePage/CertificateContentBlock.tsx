import { Button } from '@chakra-ui/react'
import moment from 'moment'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StyledCode, StyledDate } from '../../components/common/CertificateCard'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { CertificateProps } from '../../types/certificate'

const StyledContainer = styled.div`
  margin: 40px;
  max-width: 940px;
  width: 100%;
  box-shadow: 0 2px 10px 0 var(--black-10);
  background-color: #fff;
`
const StyledContentBlock = styled.div`
  padding: 2.5rem;
`
const StyledContentBlockHead = styled.div`
  margin-bottom: 1.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const StyledTitle = styled.h1`
  margin-bottom: 1.5rem;
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
  overflow: hidden;
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  white-space: pre-wrap;
`
const StyledContentBlockFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.25rem 1.25rem 2rem;
`

const CertificateContentBlock: React.VFC<{ certificate: CertificateProps }> = ({ certificate }) => {
  const { formatMessage } = useIntl()

  return (
    <StyledContainer>
      <StyledContentBlock>
        <StyledContentBlockHead>
          <StyledCode>
            {formatMessage(
              { id: 'common.certificateCode', defaultMessage: '證書代號：{certificateCode}' },
              {
                certificateCode: certificate.code,
              },
            )}
          </StyledCode>
          <div className="d-flex align-items-center">
            <StyledDate className="mr-3">
              {formatMessage(
                {
                  id: 'common.certificateExpiredTime',
                  defaultMessage: '發放日期：{certificateDistributedTime}',
                },
                {
                  certificateDistributedTime: moment(certificate.distributed_at).format('YYYY/MM/DD hh:mm'),
                },
              )}
            </StyledDate>
            <StyledDate>
              {formatMessage(
                { id: 'common.certificateExpiredTime', defaultMessage: '證書效期：{certificateExpiredTime} 止' },
                {
                  certificateExpiredTime: moment(certificate.expired_at).format('YYYY/MM/DD hh:mm'),
                },
              )}
            </StyledDate>
          </div>
        </StyledContentBlockHead>
        <StyledTitle>{certificate.title}</StyledTitle>
        <StyledAbstract>{certificate.abstract}</StyledAbstract>
      </StyledContentBlock>
      {/* TEMPLATE */}
      <div style={{ height: 667, width: '100%', background: 'grey' }}></div>
      <StyledContentBlockFooter>
        <StyledAbstract>恭喜你達成所有成就！快分享給身邊的朋友吧！</StyledAbstract>
        <SocialSharePopover url="google.com" children={<Button>分享社群</Button>} />
      </StyledContentBlockFooter>
    </StyledContainer>
  )
}

export default CertificateContentBlock

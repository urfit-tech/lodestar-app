import { Button } from '@chakra-ui/react'
import moment from 'moment'
import { render } from 'mustache'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StyledCode, StyledDate } from '../../components/common/CertificateCard'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { certificateMessages } from '../../helpers/translation'
import { Certificate } from '../../types/certificate'

type TemplateVariablesProps = {
  certificat_id: string
  name: string
  category: string
  hours: string
  created_at: string
}

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
  flex-wrap: wrap;
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

const StyledButton = styled(Button)`
  width: 105px;
  height: 44px;
  border-radius: 4px;
  background-color: #10bad9 !important;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.2px;
  color: #fff;
  &:hover {
    opacity: 0.6;
  }
`

const CertificateContentBlock: React.VFC<{ certificate: Certificate }> = ({ certificate }) => {
  const { formatMessage } = useIntl()

  const templateVariables: TemplateVariablesProps = {
    certificat_id: certificate.certificate_id,
    name: certificate.member.name,
    category: certificate.category,
    hours: `${certificate.hours}小時`,
    created_at: moment(certificate.created_at).format('YYYY年MM月DD日'),
  }

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
          <div className="d-flex align-items-center flex-wrap">
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
      <div dangerouslySetInnerHTML={{ __html: render(certificate.template, templateVariables) }}></div>
      {/* TEMPLATE */}
      <StyledContentBlockFooter>
        <StyledAbstract className="mr-3">{formatMessage(certificateMessages.text.congratulations)}</StyledAbstract>
        <SocialSharePopover
          url={window.location.href}
          children={<StyledButton>{formatMessage(certificateMessages.text.share)}</StyledButton>}
        />
      </StyledContentBlockFooter>
    </StyledContainer>
  )
}

export default CertificateContentBlock

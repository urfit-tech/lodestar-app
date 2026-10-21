import { Button } from '@chakra-ui/react'
import html2canvas from 'html2canvas'
import moment from 'moment'
import { useRef } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StyledCode, StyledDate } from '../../components/common/CertificateCard'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { SharedCertificate } from '../../types/certificate'
import pageMessages from '../translation'

const StyledContainer = styled.div`
  margin: 40px;
  max-width: 940px;
  width: 100%;
  box-shadow: 0 2px 10px 0 var(--black-10);
  background-color: #fff;
`
const StyledCertificate = styled.div`
  padding: 2.5rem;
  text-align: center;
  overflow-wrap: anywhere;
  h1 {
    margin: 1.5rem 0;
    font-size: 28px;
  }
  h2 {
    margin: 1.5rem 0;
    font-size: 24px;
  }
`

const CertificateContentBlock: React.FC<{ memberCertificate: SharedCertificate }> = ({ memberCertificate }) => {
  const { formatMessage } = useIntl()
  const certificateRef = useRef<HTMLDivElement>(null)
  const onDownload = async () => {
    if (!certificateRef.current) return
    const canvas = await html2canvas(certificateRef.current, {
      scale: 2400 / certificateRef.current.offsetWidth,
    })
    const link = document.createElement('a')
    link.download = `${memberCertificate.certificateTitle}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <StyledContainer>
      {/* Only public display fields, rendered as text. Never use the viewer's profile or arbitrary template JSON. */}
      <StyledCertificate ref={certificateRef}>
        <StyledCode>
          {formatMessage(pageMessages.MemberCertificatePage.number, { number: memberCertificate.number })}
        </StyledCode>
        <h1>{memberCertificate.certificateTitle}</h1>
        <h2>{memberCertificate.holderName}</h2>
        <StyledDate>
          {formatMessage(pageMessages.MemberCertificatePage.deliveredAt, {
            deliveredAt: moment(memberCertificate.deliveredAt).format('YYYY/MM/DD'),
          })}
        </StyledDate>
        {memberCertificate.expiredAt && (
          <StyledDate>
            {formatMessage(pageMessages.MemberCertificatePage.expiredTime, {
              expiredTime: moment(memberCertificate.expiredAt).format('YYYY/MM/DD'),
            })}
          </StyledDate>
        )}
      </StyledCertificate>
      <div className="d-flex justify-content-end p-4">
        <Button variant="outline" className="mr-2" onClick={onDownload}>
          {formatMessage(pageMessages.MemberCertificatePage.download)}
        </Button>
        <SocialSharePopover url={window.location.href}>
          <Button>{formatMessage(pageMessages.MemberCertificatePage.share)}</Button>
        </SocialSharePopover>
      </div>
    </StyledContainer>
  )
}

export default CertificateContentBlock

import { Button } from '@chakra-ui/react'
import DOMPurify from 'dompurify'
import html2canvas from 'html2canvas'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { render } from 'mustache'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StyledCode, StyledDate } from '../../components/common/CertificateCard'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { MemberCertificate } from '../../types/certificate'
import pageMessages from '../translation'
import { VirtualCredentials } from './CreateVirtualCredentials'

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
  margin-bottom: 0.5rem;
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
  letter-spacing: 0.2px;
  white-space: pre-wrap;
`
const StyledQualification = styled.div`
  font-size: 16px;
  letter-spacing: 0.2px;
  color: #00c7ec;
  margin-bottom: 1rem;
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

const CertificateContentBlock: React.VFC<{ memberCertificate: MemberCertificate }> = ({ memberCertificate }) => {
  const { certificate } = memberCertificate
  const { currentMember } = useAuth()
  const { formatMessage } = useIntl()

  const defaultTemplateVars = {
    name: currentMember?.name || currentMember?.username,
    number: memberCertificate.number,
    title: memberCertificate.certificate.title,
    qualification: memberCertificate.certificate.qualification,
    backgroundImage: memberCertificate.certificate.templateImage,
  }

  const deliveredAt = memberCertificate.deliveredAt
    ? moment(memberCertificate.deliveredAt).format('YYYY/MM/DD')
    : undefined

  const templateVars = {
    ...defaultTemplateVars,
    ...memberCertificate.values,
    deliveredAt,
  }
  const certificateRef = useRef<HTMLDivElement | null>(null)
  const virCertificateRef = useRef<HTMLDivElement | null>(null)

  const CERTIFICATE_IMAGE_SIZE = 2400

  const onDownLoad = async () => {
    if (!virCertificateRef.current) {
      return null
    }
    const scale = CERTIFICATE_IMAGE_SIZE / (virCertificateRef as RefObject<HTMLDivElement>).current!.offsetWidth
    html2canvas(virCertificateRef.current, {
      // NOTE: Cannot get background image without allowTaint and useCORS
      allowTaint: true,
      useCORS: true,
      scale,
    }).then((canvas: { toDataURL: (arg0: string, arg1: number) => any }) => {
      const img = canvas.toDataURL('image/png', 0)
      const link = document.createElement('a')
      link.download = `${certificate.title}.png`
      link.href = img
      link.click()
    })
  }

  return (
    <StyledContainer>
      <StyledContentBlock>
        <StyledContentBlockHead>
          <StyledCode>
            {formatMessage(pageMessages.MemberCertificatePage.number, {
              number: memberCertificate.number || certificate.code,
            })}
          </StyledCode>
          <div className="d-flex align-items-center flex-wrap">
            <StyledDate className="mr-3">
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
          </div>
        </StyledContentBlockHead>
        <StyledTitle>{certificate.title}</StyledTitle>
        <StyledQualification>{`${formatMessage(pageMessages.MemberCertificatePage.qualification)} : ${
          certificate.qualification
        }`}</StyledQualification>
        <StyledAbstract>
          {certificate.description && <BraftContent>{certificate.description}</BraftContent>}
        </StyledAbstract>
      </StyledContentBlock>
      {/* TEMPLATE */}
      <CertificateImpl
        template={certificate.template || ''}
        templateVars={templateVars}
        certificateRef={certificateRef}
        virCertificateRef={virCertificateRef}
      />
      {/* TEMPLATE */}
      <StyledContentBlockFooter>
        <StyledAbstract className="mr-3">
          {currentMember?.name}
          {formatMessage(pageMessages.MemberCertificatePage.congratulations)}
        </StyledAbstract>
        <div>
          <Button variant="outline" className="mr-2" onClick={onDownLoad}>
            {formatMessage(pageMessages.MemberCertificatePage.download)}
          </Button>
          <SocialSharePopover
            url={window.location.href}
            children={<StyledButton>{formatMessage(pageMessages.MemberCertificatePage.share)}</StyledButton>}
          />
        </div>
      </StyledContentBlockFooter>
    </StyledContainer>
  )
}

const StyledCertificateContainer = styled.div`
  position: relative;
  padding-top: 71%;
`
const StyledCertificateCard = styled.div<{ scale: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 1200px;
  overflow: hidden;
  white-space: nowrap;
  transform: scale(${props => props.scale});
  transform-origin: top left;
`

const CertificateImpl: React.VFC<{
  template: string
  templateVars?: any
  certificateRef?: React.Ref<HTMLDivElement>
  virCertificateRef?: React.Ref<HTMLDivElement>
}> = ({ template, templateVars, certificateRef, virCertificateRef }) => {
  const [scale, setScale] = useState(0)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleResize = useCallback(() => {
    if (certificateRef && (certificateRef as RefObject<HTMLDivElement>).current && cardRef.current) {
      setScale((certificateRef as RefObject<HTMLDivElement>).current!.offsetWidth / cardRef.current.offsetWidth)
    }
  }, [certificateRef, cardRef])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const sanitizedTemplate = DOMPurify.sanitize(template)

  return (
    <StyledCertificateContainer ref={certificateRef}>
      <VirtualCredentials
        html={sanitizedTemplate}
        templateVars={templateVars}
        certificateRef={virCertificateRef}
        scale={scale}
      />
      <StyledCertificateCard
        ref={cardRef}
        scale={scale}
        dangerouslySetInnerHTML={{ __html: render(sanitizedTemplate, templateVars) }}
      />
    </StyledCertificateContainer>
  )
}

export default CertificateContentBlock

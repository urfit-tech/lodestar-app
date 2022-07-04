import { Button } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { render } from 'mustache'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { StyledCode, StyledDate } from '../../components/common/CertificateCard'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import { certificateMessages } from '../../helpers/translation'
import { MemberCertificate } from '../../types/certificate'

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

const CertificateContentBlock: React.VFC<{ memberCertificate: MemberCertificate }> = ({ memberCertificate }) => {
  const { certificate } = memberCertificate
  const { currentMember } = useAuth()
  const { formatMessage } = useIntl()

  const transformedTemplateVariables = {
    deliveredAt: memberCertificate.deliveredAt
      ? moment(memberCertificate.deliveredAt).format('YYYY年MM月DD日')
      : undefined,
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
                  certificateDistributedTime: moment(memberCertificate.deliveredAt).format('YYYY/MM/DD hh:mm'),
                },
              )}
            </StyledDate>
            {memberCertificate.expiredAt && (
              <StyledDate>
                {formatMessage(
                  { id: 'common.certificateExpiredTime', defaultMessage: '證書效期：{certificateExpiredTime} 止' },
                  {
                    certificateExpiredTime: moment(memberCertificate.expiredAt).format('YYYY/MM/DD hh:mm'),
                  },
                )}
              </StyledDate>
            )}
          </div>
        </StyledContentBlockHead>
        <StyledTitle>{certificate.title}</StyledTitle>
        <StyledAbstract>{certificate.description}</StyledAbstract>
      </StyledContentBlock>
      {/* TEMPLATE */}
      <Certificate
        template={certificate.template || ''}
        templateVars={{ ...memberCertificate.values, ...transformedTemplateVariables }}
      />
      {/* TEMPLATE */}
      <StyledContentBlockFooter>
        <StyledAbstract className="mr-3">
          {currentMember?.name}
          {formatMessage(certificateMessages.text.congratulations)}
        </StyledAbstract>
        <SocialSharePopover
          url={window.location.href}
          children={<StyledButton>{formatMessage(certificateMessages.text.share)}</StyledButton>}
        />
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
const Certificate: React.VFC<{
  template: string
  templateVars?: any
}> = ({ template, templateVars }) => {
  const [scale, setScale] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const handleResize = useCallback(() => {
    if (containerRef.current && cardRef.current) {
      setScale(containerRef.current.offsetWidth / cardRef.current.offsetWidth)
    }
  }, [containerRef, cardRef])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <StyledCertificateContainer ref={containerRef}>
      <StyledCertificateCard
        ref={cardRef}
        scale={scale}
        dangerouslySetInnerHTML={{ __html: render(template, templateVars) }}
      />
    </StyledCertificateContainer>
  )
}

export default CertificateContentBlock

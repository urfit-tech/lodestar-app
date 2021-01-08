import { Icon } from '@chakra-ui/icons'
import { Divider, Modal, Skeleton, Typography } from 'antd'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import { CommonTitleMixin } from '../../components/common'
import { CustomRatioImage } from '../../components/common/Image'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { commonMessages } from '../../helpers/translation'
import { useSocialCardCollection } from '../../hooks/member'
import { ReactComponent as IdentityIcon } from '../../images/identity.svg'
import { SocialCardProps } from '../../types/member'

const messages = defineMessages({
  youtubeChannel: { id: 'socialConnect.label.youtubeChannel', defaultMessage: 'YouTube 頻道' },
  plan: { id: 'socialConnect.label.plan', defaultMessage: '方案：{planName}' },
})

const StyledSectionTitle = styled.div`
  ${CommonTitleMixin}
`
const StyledCard = styled.div`
  padding: 2rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
`
const StyledBadge = styled.div<{ badgeUrl: string | null }>`
  position: relative;
  ::after {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 24px;
    height: 24px;
    content: ' ';
    background-image: url('${props => props.badgeUrl}');
    background-size: contain;
    background-position: center;
  }
`
const StyledCardTitle = styled.div`
  color: var(--gray-darker);
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledCardDescription = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-height: 3em;
  overflow: hidden;
  color: var(--gray-dark);
  font-size: 14px;
  line-height: normal;
  letter-spacing: 0.4px;
`
const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 2rem;
  }
`
const StyledModalTitle = styled.div`
  color: var(--gray-darker);
  font-size: 20px;
  font-weight: bold;
  line-height: 1.3;
  letter-spacing: 0.77px;
`
const StyledModalMeta = styled.div`
  color: var(--gray-dark);
  font-size: 14px;
  letter-spacing: 0.4px;
`
const StyledModalDescription = styled.div`
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
  white-space: pre-line;
`

const SocialCardCollectionPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { loadingSocialCards, socialCards } = useSocialCardCollection()
  const [selectedSocialCard, setSelectedSocialCard] = useState<SocialCardProps | null>(null)

  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={IdentityIcon} className="mr-2" />
        <span>{formatMessage(commonMessages.content.socialCard)}</span>
      </Typography.Title>

      {loadingSocialCards && <Skeleton active />}

      {socialCards.some(socialCard => socialCard.channel.type === 'youtube') && (
        <StyledSectionTitle className="mb-4">{formatMessage(messages.youtubeChannel)}</StyledSectionTitle>
      )}

      <div className="row">
        {socialCards.map(socialCard => (
          <div key={socialCard.id} className="col-6 col-lg-4">
            <StyledCard
              className="d-flex align-items-center justify-content-start cursor-pointer"
              onClick={() => setSelectedSocialCard(socialCard)}
            >
              <StyledBadge className="flex-shrink-0 mr-4" badgeUrl={socialCard.plan.badgeUrl}>
                <CustomRatioImage width="84px" ratio={1} src={socialCard.channel.profileUrl || ''} shape="circle" />
              </StyledBadge>
              <div className="flex-grow-1">
                <StyledCardTitle>{socialCard.channel.name}</StyledCardTitle>
                <StyledCardDescription>
                  {formatMessage(messages.plan, { planName: socialCard.plan.name })}
                </StyledCardDescription>
              </div>
            </StyledCard>
          </div>
        ))}
      </div>

      <StyledModal
        visible={!!selectedSocialCard}
        title={null}
        footer={null}
        width="24rem"
        centered
        onCancel={() => setSelectedSocialCard(null)}
      >
        {selectedSocialCard && (
          <>
            <StyledModalTitle className="mb-1">{selectedSocialCard.channel.name}</StyledModalTitle>
            <StyledModalMeta>
              {formatMessage(messages.plan, { planName: selectedSocialCard.plan.name })}
            </StyledModalMeta>
            <Divider className="my-3" />
            <StyledModalDescription>{selectedSocialCard.plan.description}</StyledModalDescription>
          </>
        )}
      </StyledModal>
    </MemberAdminLayout>
  )
}

export default SocialCardCollectionPage

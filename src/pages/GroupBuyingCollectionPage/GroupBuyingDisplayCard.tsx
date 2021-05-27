import { Button, ButtonGroup, FormControl, FormErrorMessage, FormLabel, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { MultiLineTruncationMixin } from '../../components/common'
import { Input } from '../../components/common/CommonForm'
import CommonModal from '../../components/common/CommonModal'
import { CustomRatioImage } from '../../components/common/Image'
import { commonMessages } from '../../helpers/translation'
import { useMemberValidation } from '../../hooks/common'
import EmptyCover from '../../images/empty-cover.png'

const StyledTitle = styled.h3`
  ${MultiLineTruncationMixin}
  font-family: NotoSansCJKtc;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const GroupBuyingDeliverModal: React.VFC<{ title: string }> = ({ title }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [email, setEmail] = useState('')
  const { memberId, validateStatus } = useMemberValidation(email)

  return (
    <>
      <Button colorScheme="primary" isFullWidth onClick={onOpen}>
        {formatMessage(commonMessages.ui.sendNow)}
      </Button>
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        title={formatMessage(commonMessages.label.partnerChoose)}
        renderFooter={() => (
          <ButtonGroup>
            <Button variant="outline" onClick={onClose}>
              {formatMessage(commonMessages.ui.cancel)}
            </Button>
            <Button colorScheme="primary" isDisabled={validateStatus !== 'success'}>
              {formatMessage(commonMessages.ui.send)}
            </Button>
          </ButtonGroup>
        )}
        closeOnOverlayClick={false}
      >
        <StyledTitle className="mb-4">{title}</StyledTitle>
        <FormControl isInvalid={validateStatus === 'error'}>
          <FormLabel>{formatMessage(commonMessages.label.targetPartner)}</FormLabel>
          <Input
            type="email"
            status={validateStatus}
            placeholder={formatMessage(commonMessages.text.fillInEnrolledEmail)}
            onBlur={e => setEmail(e.target.value)}
          />
          <FormErrorMessage>{formatMessage(commonMessages.text.notFoundMemberEmail)}</FormErrorMessage>
        </FormControl>
      </CommonModal>
    </>
  )
}

const StyledCard = styled.div`
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06); ;
`

const GroupBuyingDisplayCard: React.VFC<{ imgUrl?: string; title?: string }> = ({
  imgUrl,
  title = '這是一堂課程名字這是一堂課程名字這是一堂課程名字名 - 方案名稱',
}) => {
  return (
    <StyledCard className="p-4">
      <CustomRatioImage className="mb-3" width="100%" ratio={9 / 16} src={imgUrl || EmptyCover} />
      <StyledTitle className="mb-4">{title}</StyledTitle>
      <GroupBuyingDeliverModal title={title} />
    </StyledCard>
  )
}

export default GroupBuyingDisplayCard

import { Button, Flex, Modal, ModalBody, ModalContent, ModalOverlay } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { WarningIcon } from '../../images'
import commonMessages from './translation'

const StyledWarningTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  line-height: 1.6;
  letter-spacing: 0.8px;
  text-align: center;
  color: var(--gray-darker);
  margin-bottom: 8px;
`

const StyledWarningDescription = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.18px;
  text-align: center;
  color: var(--gray-darker);
  margin-bottom: 8px;
  :last-of-type {
    margin-bottom: 32px;
  }
`

const InAppBrowserWarningModal = () => {
  const { formatMessage } = useIntl()

  const isInAppBrowser = window.navigator.userAgent.includes('Line') || window.navigator.userAgent.includes('FB')
  const lineOpenDefaultBrowserParams = window.navigator.userAgent.includes('Line') ? 'openExternalBrowser=1' : ''

  return isInAppBrowser ? (
    <Modal size="xs" isOpen={true} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Flex mt={12} mb={5} justifyContent="center">
            <WarningIcon />
          </Flex>
          <StyledWarningTitle>
            {formatMessage(commonMessages.InAppBrowserWarningModal.notSupportInAppBrowserTitle)}
          </StyledWarningTitle>
          <StyledWarningDescription>
            {formatMessage(commonMessages.InAppBrowserWarningModal.notSupportInAppBrowserDescription)}
          </StyledWarningDescription>
          {lineOpenDefaultBrowserParams ? (
            <Flex mb={10} justifyContent="center">
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => window.open(`${window.location.href}?${lineOpenDefaultBrowserParams}`, '_blank')}
              >
                {formatMessage(commonMessages.InAppBrowserWarningModal.openPage)}
              </Button>
            </Flex>
          ) : (
            <StyledWarningDescription>
              {formatMessage(commonMessages.InAppBrowserWarningModal.notSupportInAppBrowserLeadDescription)}
            </StyledWarningDescription>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : null
}

export default InAppBrowserWarningModal

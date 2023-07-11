import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
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
  const [isOpen, setIsOpen] = useState(true)
  const { formatMessage } = useIntl()
  const toast = useToast({ duration: 15000, isClosable: true })

  const userAgent = window.navigator.userAgent
  const isInAppBrowser = checkInAppBrowser(userAgent).isInAppBrowser
  const isLineInAppBrowser = checkInAppBrowser(userAgent).isLineInAppBrowser
  const lineOpenExternalBrowserUrl = addOpenExternalBrowserParam(`${window.location.href}`)
  if (isLineInAppBrowser) window.location.assign(lineOpenExternalBrowserUrl)

  useEffect(() => {
    if (isInAppBrowser) {
      toast({
        title: `為提供您最佳的網站使用體驗，避免網站的功能受限制，建議不要使用APP中的瀏覽器，而是透夠預設的瀏覽器開啟網站`,
        status: 'warning',
        isClosable: true,
        position: 'bottom',
      })
    }
  }, [isInAppBrowser])

  return isInAppBrowser && isLineInAppBrowser ? (
    <Modal
      size="xs"
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
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
          <Flex mb={10} justifyContent="center">
            <Button
              colorScheme="gray"
              variant="outline"
              onClick={() => window.open(lineOpenExternalBrowserUrl, '_blank')}
            >
              {formatMessage(commonMessages.InAppBrowserWarningModal.openPage)}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : null
}

const addOpenExternalBrowserParam = (url: string) => {
  let urlObj = new URL(url)
  const params = new URLSearchParams(urlObj.search)
  urlObj.search = ''
  urlObj.searchParams.append('openExternalBrowser', '1')
  for (let pair of Array.from(params)) {
    urlObj.searchParams.append(pair[0], pair[1])
  }
  return urlObj.toString()
}

const checkInAppBrowser = (userAgent: string) => {
  const isLineInAppBrowser = userAgent.includes('Line')
  const isFBInAppBrowser = userAgent.includes('FB')
  const isInAppBrowser = isLineInAppBrowser || isFBInAppBrowser
  return {
    isInAppBrowser,
    isLineInAppBrowser,
    isFBInAppBrowser,
  }
}

export default InAppBrowserWarningModal

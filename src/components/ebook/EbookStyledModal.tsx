import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { MinusIcon, PlusIcon } from '../../images'
import ebookMessage from './translation'

const EbookStyledModal: React.VFC<{
  fontSize: number
  lineHeight: number
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
  onLineHeightChange: React.Dispatch<React.SetStateAction<number>>
  onThemeChange: (theme: 'light' | 'dark') => void
  renderTrigger: React.VFC<{
    onOpen: () => void
  }>
}> = ({ renderTrigger, fontSize, lineHeight, onFontSizeChange, onLineHeightChange, onThemeChange }) => {
  const { formatMessage } = useIntl()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedTheme, setSelectedTheme] = useState('light')
  const toast = useToast()

  const handleOnClick = (theme: 'light' | 'dark') => {
    onThemeChange(theme)
    setSelectedTheme(theme)
  }

  const LabelStyle = {
    alignItems: 'center',
    color: '#9b9b9b',
    fontSize: '16px',
    fontWeight: '500',
    marginRight: '2rem',
  }

  const ButtonStyle = {
    border: '1px solid #cdcdcd',
    borderRadius: '22px',
    fontSize: '16px',
    fontWeight: '500',
    color: '#585858',
    backgroundColor: '#ffffff',
    mr: '12px',
    p: '10px 20px',
    _hover: {},
  }
  const { color, backgroundColor, ...buttonAppearanceStyle } = ButtonStyle

  const IconStyle = {
    fill: '#585858',
    marginRight: '10px',
  }

  return (
    <>
      {renderTrigger({ onOpen: () => onOpen() })}

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton color="#9b9b9b" />
          <ModalBody>
            <Box px="8px" py="24px">
              <Flex mb="16px">
                <Flex {...LabelStyle}>{formatMessage(ebookMessage.EbookStyledModal.fontSizeLabel)}</Flex>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (fontSize <= 10) {
                      toast({
                        title: formatMessage(ebookMessage.EbookStyledModal.minFontSizeReached),
                        status: 'info',
                        duration: 3000,
                        isClosable: false,
                        position: 'top',
                      })
                      onFontSizeChange(10)
                    } else {
                      onFontSizeChange(prev => prev - 1)
                    }
                  }}
                >
                  <Icon as={MinusIcon} {...IconStyle} />
                  {formatMessage(ebookMessage.EbookStyledModal.decreaseFontSize)}
                </Button>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (fontSize >= 40) {
                      toast({
                        title: formatMessage(ebookMessage.EbookStyledModal.maxFontSizeReached),
                        status: 'info',
                        duration: 3000,
                        isClosable: false,
                        position: 'top',
                      })
                      onFontSizeChange(40)
                    } else {
                      onFontSizeChange(prev => prev + 1)
                    }
                  }}
                >
                  <Icon as={PlusIcon} {...IconStyle} />
                  {formatMessage(ebookMessage.EbookStyledModal.increaseFontSize)}
                </Button>
              </Flex>

              <Flex mb="16px">
                <Flex {...LabelStyle}>{formatMessage(ebookMessage.EbookStyledModal.lineHeightLabel)}</Flex>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (lineHeight <= 1.5) {
                      toast({
                        title: formatMessage(ebookMessage.EbookStyledModal.minLineHeightReached),
                        status: 'info',
                        duration: 3000,
                        isClosable: false,
                        position: 'top',
                      })
                      onLineHeightChange(1.5)
                    } else {
                      onLineHeightChange(prev => prev - 0.1)
                    }
                  }}
                >
                  <Icon as={MinusIcon} {...IconStyle} />
                  {formatMessage(ebookMessage.EbookStyledModal.decreaseLineHeight)}
                </Button>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (lineHeight >= 3.0) {
                      toast({
                        title: formatMessage(ebookMessage.EbookStyledModal.maxLineHeightReached),
                        status: 'info',
                        duration: 3000,
                        isClosable: false,
                        position: 'top',
                      })
                      onLineHeightChange(3.0)
                    } else {
                      onLineHeightChange(prev => prev + 0.1)
                    }
                  }}
                >
                  <Icon as={PlusIcon} {...IconStyle} />
                  {formatMessage(ebookMessage.EbookStyledModal.increaseLineHeight)}
                </Button>
              </Flex>

              <Flex>
                <Flex {...LabelStyle}>{formatMessage(ebookMessage.EbookStyledModal.theme)}</Flex>
                <Button
                  {...buttonAppearanceStyle}
                  colorScheme="primary"
                  variant={selectedTheme === 'light' ? 'solid' : 'outline'}
                  onClick={() => handleOnClick('light')}
                >
                  {formatMessage(ebookMessage.EbookStyledModal.lightTheme)}
                </Button>
                <Button
                  {...buttonAppearanceStyle}
                  colorScheme={selectedTheme === 'dark' ? 'primary' : 'whiteAlpha'}
                  variant={selectedTheme === 'dark' ? 'solid' : 'outline'}
                  onClick={() => handleOnClick('dark')}
                >
                  {formatMessage(ebookMessage.EbookStyledModal.darkTheme)}
                </Button>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default EbookStyledModal

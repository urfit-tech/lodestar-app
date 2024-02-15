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
import { MinusIcon, PlusIcon } from '../../images'

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

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
                <Flex {...LabelStyle}>字級</Flex>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (fontSize <= 10) {
                      toast({
                        title: '已達最小字級',
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
                  縮小
                </Button>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (fontSize >= 40) {
                      toast({
                        title: '已達最大字級',
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
                  放大
                </Button>
              </Flex>

              <Flex mb="16px">
                <Flex {...LabelStyle}>行距</Flex>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (lineHeight <= 1.5) {
                      toast({
                        title: '已達最小行距',
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
                  縮小
                </Button>
                <Button
                  {...ButtonStyle}
                  onClick={() => {
                    if (lineHeight >= 3.0) {
                      toast({
                        title: '已達最大行距',
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
                  增加
                </Button>
              </Flex>

              <Flex>
                <Flex {...LabelStyle}>主題</Flex>
                <Button {...ButtonStyle} onClick={() => onThemeChange('light')}>
                  亮色
                </Button>
                <Button
                  {...ButtonStyle}
                  backgroundColor="#424242"
                  color="#ffffff"
                  border=""
                  onClick={() => onThemeChange('dark')}
                >
                  深色
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

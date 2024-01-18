import { Box, Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Tooltip } from '@chakra-ui/react'
import { EbookBookmarkModal } from './EbookBookmarkModal'
import EbookStyledModal from './EbookStyledModal'

export const EbookReaderControlBar: React.VFC<{
  totalPage: number
  currentPage: number
  chapter: string
  programContentBookmark: Array<any>
  fontSize: number
  lineHeight: number
  refetchBookmark: () => void
  rendition: any
  onLocationChange: (loc: undefined | string) => void
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
  onLineHeightChange: React.Dispatch<React.SetStateAction<number>>
  onThemeChange: (theme: 'light' | 'dark') => void
}> = ({
  refetchBookmark,
  currentPage,
  totalPage,
  chapter,
  programContentBookmark,
  fontSize,
  lineHeight,
  rendition,
  onLocationChange,
  onFontSizeChange,
  onLineHeightChange,
  onThemeChange,
}) => {
  const sliderOnChange = async (targetPage: number) => {
    console.log(targetPage)
  }
  return (
    <Flex w="100%" backgroundColor="white" align="center" direction="column">
      <Text>{chapter}</Text>
      <Flex w="100%" direction="row">
        <Flex w="25%"></Flex>
        <Flex w="50%">
          <Slider onChangeEnd={val => sliderOnChange(val)} value={currentPage} min={1} max={totalPage} step={1}>
            <SliderTrack bg="gray.100">
              <SliderFilledTrack bg="gray.900" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </Flex>
        <Flex w="25%" alignItems="center" className="ml-3">
          <Text ml="8px">{`${currentPage}/${totalPage}`}</Text>
          <EbookStyledModal
            fontSize={fontSize}
            lineHeight={lineHeight}
            onFontSizeChange={onFontSizeChange}
            onLineHeightChange={onLineHeightChange}
            onThemeChange={onThemeChange}
            renderTrigger={({ onOpen }) => (
              <Tooltip label="基本設定" aria-label="基本設定" placement="top">
                <Box as="u" cursor="pointer" ml="8px" fontSize="20px" onClick={() => onOpen()}>
                  A
                </Box>
              </Tooltip>
            )}
          />
          <EbookBookmarkModal
            programContentBookmark={programContentBookmark}
            onLocationChange={onLocationChange}
            refetchBookmark={refetchBookmark}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

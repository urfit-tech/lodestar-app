import {
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { useState } from 'react'
import styled from 'styled-components'
import { Bookmark } from '../program/ProgramContentEbookReader'
import { EbookBookmarkModal } from './EbookBookmarkModal'
import EbookStyledModal from './EbookStyledModal'
import type { Rendition } from 'epubjs'

const Spacer = styled(Flex)`
  width: 0%;
  @media (min-width: ${BREAK_POINT}px) {
    width: 25%;
  }
`

const SliderContainer = styled(Flex)`
  width: 50%;
  @media (min-width: ${BREAK_POINT}px) {
    width: 75%;
  }
`

export const EbookReaderControlBar: React.VFC<{
  isLocationGenerated: boolean
  chapter: string
  programContentBookmarks: Array<Bookmark>
  fontSize: number
  lineHeight: number
  refetchBookmark: () => void
  rendition: React.MutableRefObject<Rendition | undefined>
  onLocationChange: (loc: string) => void
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
  setSliderTrigger: React.Dispatch<React.SetStateAction<boolean>>
  onLineHeightChange: React.Dispatch<React.SetStateAction<number>>
  onSliderValueChange: React.Dispatch<React.SetStateAction<number>>
  sliderValue: number
  onThemeChange: (theme: 'light' | 'dark') => void
  currentThemeData: { color: string; backgroundColor: string }
  setCurrentPageBookmarkIds: React.Dispatch<React.SetStateAction<string[]>>
}> = ({
  isLocationGenerated,
  chapter,
  programContentBookmarks,
  fontSize,
  lineHeight,
  rendition,
  sliderValue,
  onSliderValueChange,
  setSliderTrigger,
  refetchBookmark,
  onLocationChange,
  onFontSizeChange,
  onLineHeightChange,
  onThemeChange,
  currentThemeData,
  setCurrentPageBookmarkIds,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <Flex
      w="100%"
      backgroundColor={currentThemeData.backgroundColor}
      color={currentThemeData.color}
      direction="column"
      align="center"
    >
      <Text color="#9b9b9b" fontSize="14px">
        {chapter}
      </Text>

      <Flex w="100%" direction="row" justifyContent="center" paddingRight="3rem">
        <Spacer />
        <SliderContainer>
          <Slider
            // for pc
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            // for mobile devices
            onTouchStart={() => setShowTooltip(true)}
            onTouchEnd={() => setShowTooltip(false)}
            onChange={v => {
              setSliderTrigger(true)
              onSliderValueChange(v)
            }}
            focusThumbOnChange={false}
            step={0.00001}
            max={100}
            value={isLocationGenerated ? sliderValue : 0}
          >
            <SliderTrack bg="gray.100">
              <SliderFilledTrack bg="gray.900" />
            </SliderTrack>
            <Tooltip hasArrow color="white" placement="top" isOpen={showTooltip} label={`${sliderValue.toFixed(1)}%`}>
              <SliderThumb boxSize={4} />
            </Tooltip>
          </Slider>
        </SliderContainer>
        <Flex w="25%" alignItems="center" marginRight="8px" ml="12px">
          {isLocationGenerated ? (
            <Text fontSize="14px">{`${(sliderValue || 0).toFixed(1)}%/${100}%`}</Text>
          ) : (
            <Spinner />
          )}
          <EbookStyledModal
            fontSize={fontSize}
            lineHeight={lineHeight}
            onFontSizeChange={onFontSizeChange}
            onLineHeightChange={onLineHeightChange}
            onThemeChange={onThemeChange}
            renderTrigger={({ onOpen }) => (
              <Tooltip label="基本設定" aria-label="基本設定" placement="top">
                <Box as="u" cursor="pointer" ml={{ base: '20px', md: '16px' }} fontSize="20px" onClick={() => onOpen()}>
                  A
                </Box>
              </Tooltip>
            )}
          />
          <EbookBookmarkModal
            setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
            currentThemeData={currentThemeData}
            programContentBookmarks={programContentBookmarks}
            onLocationChange={onLocationChange}
            refetchBookmark={refetchBookmark}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

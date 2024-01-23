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
import { EbookBookmarkModal } from './EbookBookmarkModal'
import EbookStyledModal from './EbookStyledModal'
import type { Rendition } from 'epubjs'

const Spacer = styled(Flex)`
  width: 0%;
  @media (min-width: ${BREAK_POINT}px) {
    width: 25%;
  }
`

export const EbookReaderControlBar: React.VFC<{
  isLocationGenerated: boolean
  chapter: string
  programContentBookmark: Array<any>
  fontSize: number
  lineHeight: number
  refetchBookmark: () => void
  rendition: React.MutableRefObject<Rendition | undefined>
  onLocationChange: (loc: undefined | string) => void
  onFontSizeChange: React.Dispatch<React.SetStateAction<number>>
  onLineHeightChange: React.Dispatch<React.SetStateAction<number>>
  onSliderValueChange: React.Dispatch<React.SetStateAction<number>>
  sliderValue: number
  onThemeChange: (theme: 'light' | 'dark') => void
  currentThemeData: { color: string; backgroundColor: string }
}> = ({
  isLocationGenerated,
  chapter,
  programContentBookmark,
  fontSize,
  lineHeight,
  rendition,
  sliderValue,
  onSliderValueChange,
  refetchBookmark,
  onLocationChange,
  onFontSizeChange,
  onLineHeightChange,
  onThemeChange,
  currentThemeData,
}) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isFocus, setFocus] = useState(false)

  const sliderOnChangeEnd = async () => {
    if (!isFocus) {
      return
    }
    if (sliderValue === undefined || sliderValue === 0) {
      // go to cover page
      rendition.current?.display()
    } else {
      const cfi = rendition.current?.book.locations.cfiFromPercentage(sliderValue / 100)
      onLocationChange(cfi)
    }

    // can't setFocus in onTouchEnd,because onChangeEnd will be called after onTouchEnd
    const isMobile: boolean = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent,
    )
    isMobile && setFocus(false)
  }

  return (
    <Flex
      w="100%"
      paddingBottom="16px"
      backgroundColor={currentThemeData.backgroundColor}
      color={currentThemeData.color}
      direction="column"
      align="center"
    >
      <Text color="#9b9b9b" fontSize="14px">
        {chapter}
      </Text>

      <Flex w="100%" direction="row" justifyContent="center" px={{ base: '3rem', md: '0rem' }}>
        <Spacer />
        <Flex w={{ base: '75%', md: '50%' }}>
          <Slider
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            // for pc
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            // for mobile devices
            onTouchStart={() => {
              setShowTooltip(true)
              setFocus(true)
            }}
            onTouchEnd={() => setShowTooltip(false)}
            onChangeEnd={() => sliderOnChangeEnd()}
            onChange={v => onSliderValueChange(v)}
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
        </Flex>
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
            currentThemeData={currentThemeData}
            programContentBookmark={programContentBookmark}
            onLocationChange={onLocationChange}
            refetchBookmark={refetchBookmark}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

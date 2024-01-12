import { Flex, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text } from '@chakra-ui/react'
import { EbookBookmarkModal } from './EbookBookmarkModal'

export const EbookReaderControlBar: React.VFC<{
  totalPage: number
  currentPage: number
  chapter: string
  isCountingTotal: boolean
  programContentBookmark: Array<any>
  refetchBookmark: () => void
  sliderOnChange: (value: number) => void
  onLocationChange: (loc: number | string) => void
}> = ({
  refetchBookmark,
  currentPage,
  totalPage,
  chapter,
  isCountingTotal,
  programContentBookmark,
  sliderOnChange,
  onLocationChange,
}) => {
  return (
    <Flex w="100%" backgroundColor="white" align="center" direction="column">
      <Text>{chapter}</Text>
      <Flex w="100%" direction="row">
        <Flex w="25%"></Flex>
        <Flex w="50%">
          <Slider onChange={val => sliderOnChange(val)} value={currentPage} min={1} max={totalPage} step={1}>
            <SliderTrack bg="gray.100">
              <SliderFilledTrack bg="gray.900" />
            </SliderTrack>
            <SliderThumb boxSize={4} />
          </Slider>
        </Flex>
        <Flex w="25%" alignItems="center" className="ml-3">
          <Text>{`${currentPage}/${totalPage}`}</Text>
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

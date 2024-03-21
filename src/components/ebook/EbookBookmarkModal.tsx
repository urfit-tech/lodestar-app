import { gql, useApolloClient } from '@apollo/client'
import {
  Flex,
  Grid,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import { FaQuoteLeft } from 'react-icons/fa'
import { HiDotsVertical } from 'react-icons/hi'
import styled from 'styled-components'
import { Highlight } from '../../hooks/model/api/ebookHighlightQraphql'
import { ReactComponent as DeleteIcon } from '../../images/delete-o.svg'
import { ReactComponent as BookmarkIcon } from '../../images/icon-grid-view.svg'
import { ReactComponent as MarkIcon } from '../../images/mark.svg'
import { Bookmark } from '../program/ProgramContentEbookReader'

const StyledHighlight = styled.div`
  display: flex;
  align-items: start;
  width: 100%;
  gap: 8px;
  border-bottom: 1px solid var(--gray-light);

  .iconContainer {
    width: 10%;
  }

  .textContainer {
    cursor: pointer;
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .highlightText,
  .annotationText,
  .highlightChapter {
    margin-bottom: 8px;
  }
  .highlightChapter {
    font-family: NotoSansCJKtc;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: justify;
    color: var(--gray-dark);
  }

  .annotationContainer {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -20px;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 100%;
      background-color: var(--warning);
      border-radius: 2px;
    }
  }

  .actionContainer {
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

export const EbookBookmarkModal: React.VFC<{
  refetchBookmark: () => void
  onLocationChange: (loc: string) => void
  currentThemeData: { color: string; backgroundColor: string }
  programContentBookmarks: Array<Bookmark>
  programContentHighlights: Array<Highlight>
  setCurrentPageBookmarkIds: React.Dispatch<React.SetStateAction<string[]>>
  deleteHighlight: ({ id }: { id: string }) => void
  showDeleteHighlightModal: (cfiRange: string | null, id?: string | null) => void
  showCommentModal: (cfiRange: string | null, id?: string | null) => void
}> = ({
  refetchBookmark,
  onLocationChange,
  currentThemeData,
  programContentBookmarks,
  programContentHighlights,
  setCurrentPageBookmarkIds,
  deleteHighlight,
  showDeleteHighlightModal,
  showCommentModal,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const onLocationChangeAndCloseModel = (loc: string) => {
    onLocationChange(loc)
    onClose()
  }

  return (
    <Flex>
      <Tooltip label="書籤及註釋" aria-label="書籤及註釋" placement="top">
        <Icon
          ml={{ base: '20px', md: '16px' }}
          as={BookmarkIcon}
          fill={currentThemeData.color}
          cursor="pointer"
          onClick={onOpen}
        />
      </Tooltip>
      <Modal scrollBehavior="inside" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex={1500} />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>書籤</Tab>
                <Tab>畫線註釋</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Grid gap={3}>
                    {programContentBookmarks.map(bookmark => (
                      <BookmarkRow
                        key={bookmark.id}
                        onLocationChange={onLocationChangeAndCloseModel}
                        refetchBookmark={refetchBookmark}
                        bookmark={bookmark}
                        setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
                      />
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel>
                  <Grid gap={3}>
                    {programContentHighlights.map(highlight => (
                      <HighlightRow
                        key={highlight.id}
                        onLocationChange={onLocationChangeAndCloseModel}
                        refetchBookmark={refetchBookmark}
                        highlight={highlight}
                        setCurrentPageBookmarkIds={setCurrentPageBookmarkIds}
                        deleteHighlight={deleteHighlight}
                        showDeleteHighlightModal={showDeleteHighlightModal}
                        modelOnClose={onClose}
                        showCommentModal={showCommentModal}
                      />
                    ))}
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

const BookmarkRow: React.VFC<{
  onLocationChange: (loc: string) => void
  color?: string
  bookmark: Bookmark
  refetchBookmark: () => void
  setCurrentPageBookmarkIds: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ bookmark, refetchBookmark, onLocationChange, setCurrentPageBookmarkIds }) => {
  const apolloClient = useApolloClient()
  const [isDeleting, setDeleting] = useState<boolean>(false)

  const deleteBookmark = async (id: string) => {
    setDeleting(true)
    await apolloClient.mutate({
      mutation: deleteProgramContentEbookBookmark,
      variables: {
        id,
      },
    })
    await refetchBookmark()
    setCurrentPageBookmarkIds([])
    setDeleting(false)
  }

  return (
    <Flex w="100%" alignItems="start">
      <Flex w="10%">
        <MarkIcon fill="#FF7D62" />
      </Flex>
      <Flex
        cursor="pointer"
        w="80%"
        direction="column"
        onClick={() => {
          onLocationChange(bookmark.epubCfi)
        }}
      >
        <Text size="sm" color="#585858" noOfLines={1}>
          {bookmark.highlightContent}
        </Text>
        <Text fontSize="14px" color="#9b9b9b" fontWeight="500" noOfLines={1}>
          {bookmark.chapter}
        </Text>
      </Flex>
      <Flex cursor="pointer" w="10%">
        {isDeleting ? <Spinner size="sm" /> : <DeleteIcon onClick={() => deleteBookmark(bookmark.id)} />}
      </Flex>
    </Flex>
  )
}

const HighlightRow: React.VFC<{
  onLocationChange: (loc: string) => void
  highlight: Highlight
  refetchBookmark: () => void
  setCurrentPageBookmarkIds: React.Dispatch<React.SetStateAction<string[]>>
  deleteHighlight: ({ id }: { id: string }) => void
  showDeleteHighlightModal: (cfiRange: string | null, id?: string | null) => void
  modelOnClose: () => void
  showCommentModal: (cfiRange: string | null, id?: string | null) => void
}> = ({ highlight, onLocationChange, deleteHighlight, showDeleteHighlightModal, modelOnClose, showCommentModal }) => {
  const [isDeleting, setDeleting] = useState<boolean>(false)

  const handleDeleteHighlight = async (id: string) => {
    modelOnClose()
    showDeleteHighlightModal(null, highlight.id)
  }

  const handleCommentHighlight = async (id: string) => {
    modelOnClose()
    showCommentModal(null, highlight.id)
  }

  return (
    <StyledHighlight>
      <div className="iconContainer">
        <FaQuoteLeft style={{ color: 'orange' }} />
      </div>
      <div
        className="textContainer"
        onClick={() => {
          onLocationChange(highlight.cfiRange)
        }}
      >
        <p className="highlightText">{highlight.text}</p>
        {highlight.annotation && (
          <div className="annotationContainer">
            <p className="annotationText">{highlight.annotation}</p>
          </div>
        )}
        <p className="highlightChapter">{highlight.chapter}</p>
      </div>
      <div className="actionContainer">
        {isDeleting ? (
          <Spinner size="sm" />
        ) : (
          <Menu>
            <MenuButton as={IconButton} aria-label="Options" icon={<HiDotsVertical />} variant="ghost" />
            <MenuList minWidth="auto" width="fit-content">
              <MenuItem onClick={() => handleCommentHighlight(highlight.id)}>編輯</MenuItem>
              <MenuItem onClick={() => handleDeleteHighlight(highlight.id)}>刪除</MenuItem>
            </MenuList>
          </Menu>
        )}
      </div>
    </StyledHighlight>
  )
}
export const deleteProgramContentEbookBookmark = gql`
  mutation deleteEbookBookmark($id: uuid!) {
    delete_program_content_ebook_bookmark_by_pk(id: $id) {
      id
    }
  }
`

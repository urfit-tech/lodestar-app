import { gql, useApolloClient } from '@apollo/client'
import {
  Flex,
  Grid,
  Icon,
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
import { ReactComponent as DeleteIcon } from '../../images/delete-o.svg'
import { ReactComponent as BookmarkIcon } from '../../images/icon-grid-view.svg'
import { ReactComponent as MarkIcon } from '../../images/mark.svg'
import { Bookmark } from '../program/ProgramContentEbookReader'

export const EbookBookmarkModal: React.VFC<{
  refetchBookmark: () => void
  onLocationChange: (loc: string) => void
  currentThemeData: { color: string; backgroundColor: string }
  programContentBookmarks: Array<Bookmark>
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>
}> = ({ refetchBookmark, onLocationChange, currentThemeData, programContentBookmarks, setBookmarkId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Flex>
      <Tooltip label="書籤" aria-label="書籤" placement="top">
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
          <ModalCloseButton />
          <ModalBody>
            <Tabs>
              <TabList>
                <Tab>書籤</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Grid gap={3}>
                    {programContentBookmarks.map(bookmark => (
                      <BookmarkRow
                        key={bookmark.id}
                        onLocationChange={onLocationChange}
                        refetchBookmark={refetchBookmark}
                        bookmark={bookmark}
                        setBookmarkId={setBookmarkId}
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
  setBookmarkId: React.Dispatch<React.SetStateAction<string | undefined>>
}> = ({ bookmark, refetchBookmark, onLocationChange, setBookmarkId }) => {
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
    setBookmarkId(undefined)
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

export const deleteProgramContentEbookBookmark = gql`
  mutation deleteEbookBookmark($id: uuid!) {
    delete_program_content_ebook_bookmark_by_pk(id: $id) {
      id
    }
  }
`

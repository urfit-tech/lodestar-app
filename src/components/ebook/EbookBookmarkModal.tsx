import { gql, useApolloClient } from '@apollo/client'
import {
  Flex,
  Grid,
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
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ReactComponent as DeleteIcon } from '../../images/delete-o.svg'
import { ReactComponent as BookmarkIcon } from '../../images/icon-grid-view.svg'
import { ReactComponent as MarkIcon } from '../../images/mark.svg'

export const EbookBookmarkModal: React.VFC<{
  refetchBookmark: () => void
  onLocationChange: (loc: string) => void
  programContentBookmark: Array<any>
}> = ({ refetchBookmark, onLocationChange, programContentBookmark }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Tooltip label="書籤" aria-label="書籤" placement="top">
        <BookmarkIcon className="ml-2" cursor="pointer" onClick={onOpen} />
      </Tooltip>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} isCentered>
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
                    {programContentBookmark.map(bookmark => (
                      <BookmarkRow
                        key={bookmark.id}
                        epubCfi={bookmark.epubCfi}
                        onLocationChange={onLocationChange}
                        refetchBookmark={refetchBookmark}
                        id={bookmark.id}
                      />
                    ))}
                  </Grid>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const BookmarkRow: React.VFC<{
  onLocationChange: (loc: string) => void
  color?: string
  epubCfi: string
  id: string
  refetchBookmark: () => void
}> = ({ id, epubCfi, refetchBookmark, onLocationChange }) => {
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
    setDeleting(false)
  }

  return (
    <Flex w="100%" alignItems="center">
      <Flex w="10%">
        <MarkIcon fill="#FF7D62" />
      </Flex>
      <Flex
        cursor="pointer"
        w="80%"
        onClick={() => {
          onLocationChange(epubCfi)
        }}
      >
        <Text size="sm" noOfLines={1}>
          {epubCfi}
        </Text>
      </Flex>
      <Flex cursor="pointer" w="10%">
        {isDeleting ? <Spinner size="sm" /> : <DeleteIcon onClick={() => deleteBookmark(id)} />}
      </Flex>
    </Flex>
  )
}

const deleteProgramContentEbookBookmark = gql`
  mutation deleteEbookBookmark($id: uuid!) {
    delete_program_content_ebook_bookmark_by_pk(id: $id) {
      id
    }
  }
`

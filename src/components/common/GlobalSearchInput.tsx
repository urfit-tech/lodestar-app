import { Icon, Input, InputGroup, InputRightElement, useToast } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useRef } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { commonMessages } from '../../helpers/translation'
import messages from './translation'

const StyledInput = styled(Input)`
  padding-right: 2rem;
  color: var(--gray-darker);
  border-radius: 1.5rem;
  border-color: #e8e8e8;
  ::placeholder {
    color: var(--gray);
  }
  &:focus {
    border-color: var(--gray-dark);
    box-shadow: none;
  }
`

const GlobalSearchInput: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()
  const toast = useToast()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const handleSearch = () => {
    const searchKeyword = searchInputRef.current?.value || ''
    if (searchKeyword.length < 1) return
    if (searchKeyword.length <= 1) {
      toast({
        title: formatMessage(messages.GlobalSearchInput.atLeastTwoChar),
        status: 'error',
        duration: 3000,
        isClosable: false,
        position: 'top',
      })
      return
    }
    searchInputRef.current?.value && history.push(`/search?q=${searchKeyword}`)
  }
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleSearch()
      }}
    >
      <InputGroup size="sm">
        <StyledInput ref={searchInputRef} placeholder={formatMessage(commonMessages.ui.search)} />
        <InputRightElement
          children={<Icon as={AiOutlineSearch} className="cursor-pointer" onClick={() => handleSearch()} />}
        />
      </InputGroup>
    </form>
  )
}

export default GlobalSearchInput

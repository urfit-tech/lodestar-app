import { Icon, Input, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const SearchInput: React.FC<InputProps & { onSearch: (value: string) => void }> = ({ onSearch, ...inputProps }) => {
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSearch(searchInputRef.current?.value || '')
      }}
    >
      <InputGroup>
        <Input ref={searchInputRef} {...inputProps} />
        <InputRightElement
          children={
            <Icon
              as={AiOutlineSearch}
              className="cursor-pointer"
              onClick={() => onSearch(searchInputRef.current?.value || '')}
            />
          }
        />
      </InputGroup>
    </form>
  )
}

export default SearchInput

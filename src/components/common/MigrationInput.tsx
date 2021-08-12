import { ComponentWithAs, Input as ChakraInput, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'

const MigrationInput: ComponentWithAs<
  'input',
  InputProps & {
    suffix?: React.ReactNode
  }
> = ({ suffix, ...inputProps }) => {
  if (suffix) {
    return (
      <InputGroup>
        <ChakraInput {...inputProps} />
        <InputRightElement children={suffix} />
      </InputGroup>
    )
  }

  return <ChakraInput {...inputProps} />
}

export default MigrationInput

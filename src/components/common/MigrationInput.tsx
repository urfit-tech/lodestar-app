import { ComponentWithAs, Input as ChakraInput, InputGroup, InputProps, InputRightElement } from '@chakra-ui/react'

const MigrationInput: ComponentWithAs<
  'input',
  InputProps & {
    suffix?: React.ReactNode
    suffixWidth?: string
  }
> = ({ suffix, suffixWidth, ...inputProps }) => {
  if (suffix) {
    return (
      <InputGroup>
        <ChakraInput {...inputProps} />
        <InputRightElement width={suffixWidth || '2.5rem'} children={suffix} />
      </InputGroup>
    )
  }

  return <ChakraInput {...inputProps} />
}

export default MigrationInput

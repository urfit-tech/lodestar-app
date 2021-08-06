import { Box, useRadio, UseRadioProps, useTheme } from '@chakra-ui/react'

const RadioCard: React.VFC<{
  children: React.ReactNode
}> = props => {
  const theme = useTheme()
  const { getInputProps, getCheckboxProps } = useRadio(props as UseRadioProps)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderColor="#d8d8d8"
        borderWidth="1px"
        borderRadius="md"
        _checked={{
          bg: `${theme.colors.primary[500]}`,
          color: 'white',
          borderColor: `${theme.colors.primary[500]}`,
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard

import { Box, useRadio, UseRadioProps, useTheme } from '@chakra-ui/react'

const RadioCard: React.VFC<{
  size?: 'xs' | 'sm' | 'md' | 'lg'
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
        px={props.size === 'xs' ? 2 : props.size === 'sm' ? 3 : props.size === 'md' ? 4 : props.size === 'lg' ? 6 : 4}
        h={props.size === 'xs' ? 6 : props.size === 'sm' ? 8 : props.size === 'md' ? 10 : props.size === 'lg' ? 12 : 10}
        lineHeight={
          props.size === 'xs' ? 6 : props.size === 'sm' ? 8 : props.size === 'md' ? 10 : props.size === 'lg' ? 12 : 10
        }
        textAlign="center"
      >
        {props.children}
      </Box>
    </Box>
  )
}

export default RadioCard

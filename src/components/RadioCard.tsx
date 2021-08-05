import { Box, useRadio, UseRadioProps } from '@chakra-ui/react'
import { useApp } from '../containers/common/AppContext'

const RadioCard: React.VFC<{
  children: React.ReactNode
}> = props => {
  const { settings } = useApp()
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
          bg: `${settings['theme.@primary-color']}`,
          color: 'white',
          borderColor: `${settings['theme.@primary-color']}`,
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

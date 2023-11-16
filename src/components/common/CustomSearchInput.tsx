import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { LayoutProps } from '@chakra-ui/styled-system'
import React from 'react'
const CustomSearchInput: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  rightIcon?: React.ReactNode
  width?: LayoutProps['width']
  display?: LayoutProps['display']
  placeholder?: string
  className?: string
  defaultValue?: string
}> = ({ className, width, placeholder, onChange, rightIcon, display, defaultValue }) => {
  return (
    <InputGroup className={className} display={display} width={width} backgroundColor="white">
      <Input placeholder={placeholder} onChange={onChange} defaultValue={defaultValue} />
      {rightIcon && <InputRightElement>{rightIcon}</InputRightElement>}
    </InputGroup>
  )
}

export default CustomSearchInput

import { InputGroup, InputLeftElement } from '@chakra-ui/input'
import { Select } from '@chakra-ui/select'
import { LayoutProps } from '@chakra-ui/styled-system'
import React from 'react'
import styled from 'styled-components'

const StyledSelect = styled(Select)<{ 'with-icon'?: string }>`
  ${props =>
    props['with-icon'] === 'leftIcon' &&
    `
  padding-left: 35px !important;
`}
`

const CustomChakraSelect: React.FC<{
  options: { value: string; name: string }[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  defaultValue: string
  className?: string
  width?: LayoutProps['width']
  leftIcon?: React.ReactNode
  disabled?: boolean
}> = ({ className, width, options, leftIcon, onChange, defaultValue, disabled }) => {
  return (
    <InputGroup className={className} width={width} backgroundColor="white">
      {leftIcon && <InputLeftElement>{leftIcon}</InputLeftElement>}
      <StyledSelect
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        with-icon={leftIcon ? 'leftIcon' : ''}
      >
        {options.map(s => (
          <option key={s.value} value={s.value}>
            {s.name}
          </option>
        ))}
      </StyledSelect>
    </InputGroup>
  )
}

export default CustomChakraSelect

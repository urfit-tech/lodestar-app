import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import React from 'react'

const CustomMenuButton: React.FC<{
  buttonElement: React.ReactNode | string
  options: { className?: string; value: string; name: string }[]
  onClick: (value: string) => void
  className?: string
}> = ({ className, buttonElement, options, onClick }) => {
  return (
    <Menu>
      <MenuButton className={className}>{buttonElement}</MenuButton>
      <MenuList>
        {options.map((option, index) => (
          <MenuItem key={index} className={option.className} onClick={() => onClick(option.value)}>
            {option.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export default CustomMenuButton

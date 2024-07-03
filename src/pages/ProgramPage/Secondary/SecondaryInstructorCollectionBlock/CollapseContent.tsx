import { Flex, Box, Collapse, IconButton } from '@chakra-ui/react'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'

const CollapseContent: React.VFC<{ children: React.ReactNode; title: string }> = ({ title, children }) => {
  const theme = useAppTheme()
  const [show, setShow] = useState<boolean>(false)
  const handleToggle = () => setShow(!show)

  return (
    <Box fontSize="20px" fontWeight="bold" mb="2.5rem">
      <Flex
        as="h3"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="#fff"
        bg={theme.colors.primary[500]}
        borderRadius="4px"
        flex=""
      >
        <Box m="12px">{title}</Box>
        <IconButton
          icon={
            <div>
              <FaChevronDown
                style={{
                  transform: !!show ? 'rotate(0deg)' : 'rotate(270deg)',
                }}
              />
            </div>
          }
          aria-label="Rotate Icon"
          variant="ghost"
          onClick={() => handleToggle()}
        />
      </Flex>
      <React.Fragment>
        <Collapse in={show} transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}>
          {children}
        </Collapse>
      </React.Fragment>
    </Box>
  )
}
export default CollapseContent

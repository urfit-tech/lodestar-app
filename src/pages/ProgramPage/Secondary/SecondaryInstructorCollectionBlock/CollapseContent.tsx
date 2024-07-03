import { Box, Collapse, IconButton } from '@chakra-ui/react'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import React, { useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import styled from 'styled-components'
import { colors } from '../style'

const SectionTitle = styled.h3`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: ${colors.gray1};
`

const CollapseContent: React.VFC<{ children: React.ReactNode; title: string }> = ({ title, children }) => {
  const  theme  = useAppTheme()
  const [show, setShow] = useState<boolean>(false)
  const handleToggle = () => setShow(!show)

  return (
    <Box mb="2.5rem" bg={theme.colors.primary[500]}>
      <SectionTitle>
        {title}
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
        ></IconButton>
      </SectionTitle>

      <React.Fragment>
        <Collapse in={show} transition={{ exit: { delay: 1 }, enter: { duration: 0.5 } }}>
          {children}
        </Collapse>
      </React.Fragment>
    </Box>
  )
}
export default CollapseContent

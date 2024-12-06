import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import React, { useContext } from 'react'
import { Box, useDisclosure, Collapse } from '@chakra-ui/react'
import { List } from 'antd'
import styled from 'styled-components'
import LocaleContext, { SUPPORTED_LOCALES } from '../../contexts/LocaleContext'

const StyledCollapseIconWrapper = styled(Box)`
  && {
    margin: auto 0;
  }
`
const BlankIcon = styled.i`
  display: inline-block;
  width: 16px;
  height: 16px;
`

const LocaleCollapse: React.FC = () => {
  const { isOpen, onToggle } = useDisclosure()
  const { currentLocale, setCurrentLocale, languagesList } = useContext(LocaleContext)
  return (
    <>
      <Box d="flex" justifyContent="space-between" cursor="pointer" onClick={onToggle}>
        <Box>
          <List.Item style={{ cursor: 'pointer' }}>
            <BlankIcon className="mr-2" />
            {SUPPORTED_LOCALES.find(supportedLocale => supportedLocale.locale === currentLocale)?.label}
          </List.Item>
        </Box>
        <StyledCollapseIconWrapper>
          {isOpen ? <ChevronDownIcon w="16px" /> : <ChevronRightIcon w="16px" />}
        </StyledCollapseIconWrapper>
      </Box>
      <Collapse in={isOpen} animateOpacity style={{ background: '#f7f8f8', margin: '0 -12px' }}>
        {languagesList
          .filter(v => v.locale !== currentLocale)
          .map(v => (
            <Box ml="3rem" style={{ cursor: 'pointer' }}>
              <List.Item key={v.locale} onClick={() => setCurrentLocale?.(v.locale)}>
                <BlankIcon className="mr-2" />
                {v.label}
              </List.Item>
            </Box>
          ))}
      </Collapse>
    </>
  )
}

export default LocaleCollapse

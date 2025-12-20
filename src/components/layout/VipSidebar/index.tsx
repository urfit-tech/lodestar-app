import { ChevronRightIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
  AiOutlineBarChart,
  AiOutlineBell,
  AiOutlineBook,
  AiOutlineCode,
  AiOutlineDatabase,
  AiOutlineDollar,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineShareAlt,
  AiOutlineStar,
  AiOutlineTable,
  AiOutlineUser,
} from 'react-icons/ai'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const StyledSidebar = styled.div<{ isExpanded: boolean }>`
  position: fixed;
  left: 0;
  top: 64px;
  height: calc(100vh - 64px);
  width: ${props => (props.isExpanded ? '200px' : '64px')};
  background: #2f387b;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: ${props => (props.isExpanded ? 'flex-start' : 'center')};
  padding: ${props => (props.isExpanded ? '1rem 0.5rem' : '1rem 0')};
  transition: width 0.3s ease;
  z-index: 999;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
`

const MenuItem = styled.div<{ isActive?: boolean; isExpanded: boolean }>`
  display: flex;
  align-items: center;
  width: ${props => (props.isExpanded ? 'calc(100% - 1rem)' : '48px')};
  height: 48px;
  padding: ${props => (props.isExpanded ? '0 1rem' : '0')};
  margin: ${props => (props.isExpanded ? '0.25rem 0.5rem' : '0.5rem 0')};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => (props.isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  svg {
    font-size: 24px;
    flex-shrink: 0;
    margin-right: ${props => (props.isExpanded ? '12px' : '0')};
  }

  span {
    white-space: nowrap;
    opacity: ${props => (props.isExpanded ? '1' : '0')};
    transition: opacity 0.2s ease;
    font-size: 14px;
  }
`

const ExpandButtonWrapper = styled.div`
  margin-top: auto;
  padding: 1rem 0;
  display: flex;
  justify-content: center;
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const StyledExpandButton = styled(IconButton)<{ isExpanded: boolean }>`
  && {
    background: transparent;
    color: #ffffff;
    width: 40px;
    height: 40px;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    svg {
      transform: ${props => (props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')};
      transition: transform 0.3s ease;
    }
  }
`

interface MenuItemData {
  icon: React.ReactNode
  label: string
  href?: string
}

interface VipSidebarProps {
  onExpandChange?: (isExpanded: boolean) => void
}

const VipSidebar: React.FC<VipSidebarProps> = ({ onExpandChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const history = useHistory()

  const handleExpandToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const menuItems: MenuItemData[] = [
    { icon: <AiOutlineHome />, label: '首页', href: '/' },
    { icon: <AiOutlineBook />, label: '书签', href: '#' },
    { icon: <AiOutlineUser />, label: '用户', href: '#' },
    { icon: <AiOutlineBell />, label: '公告', href: '#' },
    { icon: <AiOutlineFileText />, label: '文档', href: '#' },
    { icon: <AiOutlineTable />, label: '数据', href: '#' },
    { icon: <AiOutlineDollar />, label: '交易', href: '#' },
    { icon: <AiOutlineBell />, label: '通知', href: '#' },
    { icon: <AiOutlineDatabase />, label: '数据库', href: '#' },
    { icon: <AiOutlineShareAlt />, label: '关系图', href: '#' },
    { icon: <AiOutlineBarChart />, label: '统计', href: '#' },
    { icon: <AiOutlineStar />, label: '收藏', href: '#' },
    { icon: <AiOutlineCode />, label: '开发', href: '#' },
  ]

  const handleMenuItemClick = (index: number, href?: string) => {
    setActiveIndex(index)
    if (href && href !== '#') {
      if (href.startsWith('/')) {
        history.push(href)
      } else {
        window.open(href, '_blank')
      }
    }
  }

  return (
    <StyledSidebar isExpanded={isExpanded}>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          isActive={activeIndex === index}
          isExpanded={isExpanded}
          onClick={() => handleMenuItemClick(index, item.href)}
        >
          {item.icon}
          <span>{item.label}</span>
        </MenuItem>
      ))}

      <ExpandButtonWrapper>
        <StyledExpandButton
          aria-label={isExpanded ? '折叠侧边栏' : '展开侧边栏'}
          icon={<ChevronRightIcon />}
          isExpanded={isExpanded}
          onClick={handleExpandToggle}
        />
      </ExpandButtonWrapper>
    </StyledSidebar>
  )
}

export default VipSidebar

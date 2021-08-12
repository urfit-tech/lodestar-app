import { Button, MenuButton, MenuItem, Tag } from '@chakra-ui/react'
import { Layout } from 'antd'
import { extname } from 'path'
import styled, { css } from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'
import { desktopViewMixin } from '../../helpers'

export const StyledLayout = styled(Layout)<{ variant?: 'white' }>`
  ${props => (props.variant === 'white' ? 'background: white;' : '')}
`
export const StyledLayoutHeader = styled(Layout.Header)`
  border-bottom: 1px solid #ececec;
  overflow: hidden;

  &.hidden {
    height: 0;
    border: 0;
  }
`
export const LogoBlock = styled.div`
  height: 36px;
  line-height: 36px;

  a {
    display: inline-block;
  }
`
export const SearchBlock = styled.div`
  max-width: 12rem;
`
export const StyledLogo = styled.img`
  width: auto;
  max-width: 100%;
  ${props => (props.src && extname(props.src) === '.svg' ? 'height: 100vh;' : '')}
  max-height: 36px;
`
export const StyledNavTag = styled(Tag)`
  && {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 0.25rem;
    line-height: 1rem;
    min-height: 1rem;
    font-size: 12px;
  }
`
export const StyledNavButton = styled(Button)`
  && {
    height: 3.5rem;
    color: #585858;
    line-height: 1.5;
  }
`
export const StyledMenuTag = styled(Tag)`
  && {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    padding: 0 0.25rem;
    line-height: 1rem;
    min-height: 1rem;
    font-size: 12px;
  }
`
export const StyledMenuButton = styled(MenuButton)`
  && {
    height: 3.5rem;
    color: #585858;
    line-height: 1.5;
  }
`
export const StyledMenuItem = styled(MenuItem)`
  && {
    position: relative;
    height: 3.5rem;
    color: #585858;
    line-height: 1.5;

    > ${StyledNavTag} {
      position: absolute;
      line-height: 1rem;
    }
  }
`
export const StyledLayoutContent = styled(Layout.Content)`
  position: relative;
  height: calc(100vh - 4rem);
  overflow-y: auto;

  &.full-height {
    padding-top: 4rem;
    height: 100vh;
  }
`
export const LayoutContentWrapper = styled.div<{ centeredBox?: boolean; footerHeight?: number }>`
  min-height: calc(100vh - 4rem - ${props => props.footerHeight}px);

  ${props =>
    props.centeredBox
      ? css`
          display: flex;
          align-items: center;
          justify-content: center;
        `
      : ''}
`
export const CenteredBox = styled.div`
  margin: 1rem;
  width: 100%;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);

  ${desktopViewMixin(
    css`
      width: calc(100% / 3);
    `,
  )}
`
export const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
  color: #585858;

  .ant-form-explain {
    font-size: 14px;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 4rem;
  }
`
export const EmptyBlock = styled.div<{ height?: string }>`
  height: ${props => props.height};
`

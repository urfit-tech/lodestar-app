import { PageHeader } from 'antd'
import styled from 'styled-components'
import { BREAK_POINT } from '../../components/common/Responsive'

export const StyledPageHeader = styled(PageHeader)`
  && {
    padding: 1rem 1.5rem;
    height: 4rem;
    background: white;
  }

  .ant-page-header-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .ant-page-header-heading-title,
  .ant-divider {
    display: none;
  }

  .ant-page-header-heading-extra {
    width: auto;
    padding: 0;
  }

  @media (min-width: ${BREAK_POINT}px) {
    .ant-page-header-heading-title {
      display: block;
      flex-grow: 1;
      font-size: 16px;
      line-height: 32px;
    }
  }
`

export const StyledSideBar = styled.div<{ menuVisible?: boolean }>`
  height: calc(100vh - 64px);
  overflow-y: auto;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) -3px 10px 10px 0px;
  z-index: 2;
  width: 100%;
  position: absolute;
`

export const StyledContentBlock = styled.div`
  padding: 1.25rem;
  background-color: white;
`

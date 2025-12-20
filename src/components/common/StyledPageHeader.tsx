import { PageHeader } from 'antd'
import styled from 'styled-components'
import { BREAK_POINT } from './Responsive'

export const StyledPageHeader = styled(PageHeader)<{ isVip?: boolean }>`
  && {
    padding: 1rem 1.5rem;
    height: 4rem;
    background: ${props => (props.isVip ? '#2F387B' : 'white')};
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
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

  .ant-page-header-back {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }

  .ant-page-header-back-button {
    color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
  }

  @media (min-width: ${BREAK_POINT}px) {
    .ant-page-header-heading-title {
      display: block;
      flex-grow: 1;
      font-size: 16px;
      line-height: 32px;
      color: ${props => (props.isVip ? '#ffffff' : 'inherit')};
    }
  }
`

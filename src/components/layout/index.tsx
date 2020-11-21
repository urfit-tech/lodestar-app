import { Form } from 'antd'
import styled from 'styled-components'

export const StyledBanner = styled.div`
  padding: 4rem 0;
  background-color: var(--gray-lighter);
`

export const StyledBannerTitle = styled.h1`
  margin-bottom: 2.5rem;
  color: var(--gray-darker);
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
`

export const StyledCollection = styled.div`
  padding: 2.5rem 0;
`

export const StyledForm = styled(Form)`
  .ant-row {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    .ant-row {
      flex-direction: row;
    }
  }
`

import { Card } from 'antd'
import styled, { css } from 'styled-components'

const AdminCard = styled(Card)<{ variant?: string }>`
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);

  .ant-card-meta-title {
    white-space: normal;
  }

  ${props =>
    props.variant === 'program' &&
    css`
      overflow: hidden;

      .ant-card-body {
        height: 13rem;
      }

      .ant-card-meta {
        height: 100%;
      }

      .ant-card-meta-detail {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .ant-card-meta-title {
        height: 42px;

        h1 {
          font-size: 18px;
        }
      }

      .ant-card-meta-description {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-grow: 1;

        .ant-typography {
          color: #9b9b9b;
        }
      }
    `}
`

export default AdminCard

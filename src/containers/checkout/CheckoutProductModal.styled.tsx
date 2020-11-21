import { Modal } from 'antd'
import styled from 'styled-components'

export const StyledModal = styled(Modal)`
  && {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin: 0;
    padding: 0;

    .ant-modal-content {
      min-height: 100vh;
    }
  }
`
export const StyledTitle = styled.h1`
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
export const StyledSubTitle = styled.div`
  margin-bottom: 0.75rem;
  color: var(--gray-darker);
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.8px;
`
export const StyledWrapper = styled.div`
  margin: 0 auto;
  max-width: 40rem;
`
export const StyledWarningText = styled.p`
  margin-top: 1.25rem;
  color: var(--gray-dark);
  font-size: 12px;
`
export const StyledCheckoutBlock = styled.div`
  color: var(--gray-darker);
  font-size: 14px;
  line-height: 1.71;
  letter-spacing: 0.4px;

  > div {
    margin-bottom: 0.75rem;

    > span:first-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
export const StyledCheckoutPrice = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 0.2px;
  text-align: right;
`

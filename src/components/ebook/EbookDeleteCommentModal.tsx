// CommentModal.tsx
import { Modal } from 'antd'
import React from 'react'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

const StyledCommentModal = styled(Modal)`
  .ant-modal-content {
    max-width: 400px;
    /* height: 402px; */
    width: auto;
    /* padding: 15px 15px 15px 15px; */
    border-radius: 4px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    background-color: #fff;
  }
  .ant-modal-body .headerContainer {
    color: #585858;
    font-size: 20px;
    font-weight: bold;
  }

  .ant-modal-body .modelContainer {
    margin-top: 25px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .ant-modal-body .modelContainer .quoteIcon {
    width: 40px;
    height: 45px;
    color: #ffbe1e;
    margin-right: 2px;
  }

  .ant-modal-body .modelContainer .commentArea p {
    margin-top: 25px;
    margin-bottom: 0px;
  }

  .ant-modal-footer {
    border-top: 0px;
    width: 100%;
  }

  .ant-btn-primary {
    background-color: #ff7d62;
    border-color: #ff7d62;
  }

  @media screen and (max-width: ${BREAK_POINT}px) {
    .ant-modal-body .modelContainer .commentArea p {
      margin-top: 15px;
    }
  }
`

type CommentModalProps = {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  programContentEbookHighlightId?: string | null | undefined
}

const EbookDeleteHighlightModal: React.FC<CommentModalProps> = ({
  visible,
  onOk,
  onCancel,
  programContentEbookHighlightId,
}) => {
  return (
    <StyledCommentModal visible={visible} onOk={onOk} onCancel={onCancel}>
      <div className="headerContainer">
        <h1>是否刪除所選的畫線</h1>
      </div>
      <div className="modelContainer">
        <div className="commentArea">
          <p>刪除即不可恢復，確定要刪除嗎？</p>
        </div>
      </div>
    </StyledCommentModal>
  )
}

export default EbookDeleteHighlightModal

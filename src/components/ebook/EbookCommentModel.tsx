// CommentModal.tsx
import { Input, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import { FaQuoteLeft } from 'react-icons/fa'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { Highlight } from '../../hooks/model/api/ebookHighlightGraphql'
import { BREAK_POINT } from '../common/Responsive'
import ebookMessages from './translation'

const StyledCommentModal = styled(Modal)`
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

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

  .ant-modal-body .modelContainer .commentArea {
    margin-right: 10px;
    width: 100%;
  }

  .ant-modal-body .modelContainer .commentArea .ant-input-textarea {
    width: 100%;
  }

  .ant-modal-body .modelContainer .commentArea h2 {
    font-size: 20px;
    font-weight: bold;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 0.2px;
    font-family: NotoSansCJKtc;
    color: var(--gray-darker);
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
    background-color: #10bad9;
    border-color: #10bad9;
  }

  @media screen and (max-width: ${BREAK_POINT}px) {
    /* .ant-modal-body .modelContainer .commentArea {
      min-width: 200px;
    } */
    .ant-modal-body .modelContainer .quoteIcon {
      width: 30px;
      height: 35px;
    }
    .ant-modal-body .modelContainer .commentArea h2 {
      font-size: 16px;
    }
    .ant-modal-body .modelContainer .commentArea p {
      margin-top: 15px;
    }
  }
`

type CommentModalProps = {
  visible: boolean
  onOk: () => void
  onCancel: () => void
  annotation: Highlight | null
  setAnnotation: React.Dispatch<React.SetStateAction<Highlight | null>>
}

const EbookCommentModal: React.FC<CommentModalProps> = ({ visible, onOk, onCancel, annotation, setAnnotation }) => {
  const { formatMessage } = useIntl()
  const [text, setText] = useState<string>('')

  useEffect(() => {
    setText(annotation?.text || '')
  }, [annotation])

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value

    if (annotation) {
      setAnnotation({ ...annotation, annotation: newComment })
    }
  }

  const handleOnOk = () => {
    onOk()
  }

  return (
    <StyledCommentModal
      visible={visible}
      okText={formatMessage(ebookMessages.EbookCommentModal.save)}
      onOk={handleOnOk}
      onCancel={onCancel}
    >
      <div
        onContextMenu={e => e.preventDefault()}
        onDragStart={e => e.preventDefault()}
        onCopy={e => e.preventDefault()}
      >
        <div className="headerContainer">
          <h1>{formatMessage(ebookMessages.EbookCommentModal.underlineComment)}</h1>
        </div>
        <div className="modelContainer">
          <div className="quoteIcon">
            <FaQuoteLeft style={{ color: 'orange' }} />
          </div>

          <div className="commentArea">
            <h2>{text}</h2>
            <p>{formatMessage(ebookMessages.EbookCommentModal.commentContent)}</p>
            <Input.TextArea
              rows={4}
              value={annotation?.annotation || ''}
              onChange={handleCommentChange}
              onContextMenu={e => e.stopPropagation()}
              onDragStart={e => e.stopPropagation()}
              onCopy={e => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </StyledCommentModal>
  )
}

export default EbookCommentModal

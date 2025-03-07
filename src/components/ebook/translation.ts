import { defineMessages } from 'react-intl'

const ebookMessages = {
  EbookCommentModal: defineMessages({
    underlineComment: {
      id: 'ebook.EbookCommentModel.underlineComment',
      defaultMessage: '畫線註釋',
    },
    commentContent: {
      id: 'ebook.EbookCommentModel.commentContent',
      defaultMessage: '註釋內容',
    },
    save: {
      id: 'ebook.EbookCommentModel.save',
      defaultMessage: '儲存',
    },
  }),
  EbookBookmarkModal: defineMessages({
    bookmarkAndAnnotation: {
      id: 'ebook.EbookBookmarkModal.bookmarkAndAnnotation',
      defaultMessage: '書籤及註釋',
    },
    bookmark: {
      id: 'ebook.EbookBookmarkModal.bookmark',
      defaultMessage: '書籤',
    },
    underlineAnnotation: {
      id: 'ebook.EbookBookmarkModal.underlineAnnotation',
      defaultMessage: '畫線註釋',
    },
    edit: {
      id: 'ebook.EbookBookmarkModal.edit',
      defaultMessage: '編輯',
    },
    delete: {
      id: 'ebook.EbookBookmarkModal.delete',
      defaultMessage: '刪除',
    },
  }),
  EbookStyledModal: defineMessages({
    minFontSizeReached: {
      id: 'ebook.EbookStyledModal.minFontSizeReached',
      defaultMessage: '已達最小字級',
    },
    maxFontSizeReached: {
      id: 'ebook.EbookStyledModal.maxFontSizeReached',
      defaultMessage: '已達最大字級',
    },
    decreaseFontSize: {
      id: 'ebook.EbookStyledModal.decreaseFontSize',
      defaultMessage: '縮小',
    },
    increaseFontSize: {
      id: 'ebook.EbookStyledModal.increaseFontSize',
      defaultMessage: '放大',
    },
    fontSizeLabel: {
      id: 'ebook.EbookStyledModal.fontSizeLabel',
      defaultMessage: '字級',
    },
    lineHeightLabel: {
      id: 'ebook.EbookStyledModal.lineHeightLabel',
      defaultMessage: '行距',
    },
    minLineHeightReached: {
      id: 'ebook.EbookStyledModal.minLineHeightReached',
      defaultMessage: '已達最小行距',
    },
    maxLineHeightReached: {
      id: 'ebook.EbookStyledModal.maxLineHeightReached',
      defaultMessage: '已達最大行距',
    },
    decreaseLineHeight: {
      id: 'ebook.EbookStyledModal.decreaseLineHeight',
      defaultMessage: '縮小',
    },
    increaseLineHeight: {
      id: 'ebook.EbookStyledModal.increaseLineHeight',
      defaultMessage: '增加',
    },
    theme: {
      id: 'ebook.EbookStyledModal.theme',
      defaultMessage: '主題',
    },
    lightTheme: {
      id: 'ebook.EbookStyledModal.lightTheme',
      defaultMessage: '亮色',
    },
    darkTheme: {
      id: 'ebook.EbookStyledModal.darkTheme',
      defaultMessage: '深色',
    },
  }),
  EbookDeleteCommentModel: defineMessages({
    deleteSelectedHighlight: {
      id: 'ebook.EbookDeleteCommentModel.deleteSelectedHighlight',
      defaultMessage: '是否刪除所選的畫線',
    },
    deleteConfirmation: {
      id: 'ebook.EbookDeleteCommentModel.deleteConfirmation',
      defaultMessage: '刪除即不可恢復，確定要刪除嗎？',
    },
  }),
  EbookReaderControlBar: defineMessages({
    basicSettings: {
      id: 'ebook.EbookReaderControlBar.basicSetting',
      defaultMessage: '基本設定',
    },
  }),
}

export default ebookMessages

import { defineMessages } from 'react-intl'

const additionalForm = {
  AdditionalForm: defineMessages({
    cardImageFile: {
      id: 'additionalForm.AdditionalForm.cardImageFile',
      defaultMessage: '證件上傳',
    },
    credentialImageFile: {
      id: 'additionalForm.AdditionalForm.credentialImageFile',
      defaultMessage: '證明上傳',
    },
    bankBookImageFile: {
      id: 'additionalForm.AdditionalForm.bankBookImageFile',
      defaultMessage: '存摺封面',
    },
    financialProof: {
      id: 'additionalForm.AdditionalForm.financialProof',
      defaultMessage: '財力證明電子對帳單、交易明細',
    },
    missingFieldsAlert: {
      id: 'additionalForm.AdditionalForm.missingFieldsAlert',
      defaultMessage: '缺少{errorMessages}請重新確認',
    },
    paymentSupplementForm: {
      id: 'additionalForm.AdditionalForm.paymentSupplementForm',
      defaultMessage: '金流補件表',
    },
    name: {
      id: 'additionalForm.AdditionalForm.name',
      defaultMessage: '姓名',
    },
    email: {
      id: 'additionalForm.AdditionalForm.email',
      defaultMessage: 'Email',
    },
    credentialImage1: {
      id: 'additionalForm.AdditionalForm.credentialImage1',
      defaultMessage: '證件上傳（學生證、工作證、軍公教證）',
    },
    credentialImage2: {
      id: 'additionalForm.AdditionalForm.credentialImage2',
      defaultMessage: '證明上傳（勞保、在職證明、在學證明、畢業證書）',
    },
    financialProofDescription: {
      id: 'additionalForm.AdditionalForm.financialProofDescription',
      defaultMessage:
        '財力證明電子對帳單、交易明細（此為近6個月的電子對帳單或交易明細，通常是PDF檔，若有鎖密碼請於備註填寫，不可使用App網銀截圖）',
    },
    notes: {
      id: 'additionalForm.AdditionalForm.notes',
      defaultMessage: '備註',
    },
    agree: {
      id: 'additionalForm.AdditionalForm.agree',
      defaultMessage:
        '以上資料僅限於申請現金分期相關服務使用，同意送出後視為學員同意貴司依照個人資料保護法規定蒐集、利用',
    },
    submit: {
      id: 'additionalForm.AdditionalForm.submit',
      defaultMessage: '送出',
    },
  }),
}

export default additionalForm

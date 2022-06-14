export const useCertificates = () => {
  const data = {
    certificates: [
      {
        id: '1',
        title: 'UIUX類課程完課證明',
        abstract:
          '我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘',
        code: 'AS500',
        expired_at: '2024-03-21T16:59:59+00:00',
      },
    ],
  }
  return {
    certificates: data.certificates,
  }
}

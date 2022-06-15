export const useCertificateColleaction = () => {
  const data = {
    certificates: [
      {
        id: '1',
        title: 'UIUX類課程完課證明',
        abstract: `我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明
我是摘要
說明我是摘要說明我是摘`,
        code: 'AS500',
        expired_at: '2024-03-21T16:59:59+00:00',
        certificate_id: 'GA000000001',
        member: {
          name: '曾聰明',
        },
        category: '資訊通識技術課程 (可自行填寫)',
        hours: 24,
        created_at: '2021-11-30T16:59:59+00:00',
        distributed_at: '2021-03-21T15:00:00+00:00',
      },
    ],
  }
  return {
    certificates: data.certificates,
  }
}

export const useCertificate = (certificateId: string) => {
  const data = {
    certificates: [
      {
        id: '1',
        title: 'UIUX類課程完課證明',
        abstract: `我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明我是摘要說明
我是摘要
說明我是摘要說明我是摘`,
        code: 'AS500',
        expired_at: '2024-03-21T16:59:59+00:00',
        certificate_id: 'GA000000001',
        member: {
          name: '曾聰明',
        },
        category: '資訊通識技術課程 (可自行填寫)',
        hours: 24,
        created_at: '2021-11-30T16:59:59+00:00',
        distributed_at: '2021-03-21T15:00:00+00:00',
      },
    ],
  }
  return {
    certificate: data.certificates[0],
  }
}

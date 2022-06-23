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
        expiredAt: '2024-03-21T16:59:59+00:00',
        certificateId: 'GA000000001',
        member: {
          name: '曾聰明',
        },
        category: '資訊通識技術課程 (可自行填寫)',
        hours: 24,
        createdAt: '2021-11-30T16:59:59+00:00',
        distributedAt: '2021-03-21T15:00:00+00:00',
        template: `<div style='border:1px solid #cccccc;padding:24px;height:667px;width:100%'>證書編號：{{certificat_id}}<br/>{{name}}<br/>{{category}}<br/>{{hours}}<br/>{{created_at}}</div>`,
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
        expiredAt: '2024-03-21T16:59:59+00:00',
        certificateId: 'GA000000001',
        member: {
          name: '曾聰明',
        },
        category: '資訊通識技術課程 (可自行填寫)',
        hours: 24,
        createdAt: '2021-11-30T16:59:59+00:00',
        distributedAt: '2021-03-21T15:00:00+00:00',
        template: `<div style='border:1px solid #cccccc;padding:24px;height:667px;width:100%'>證書編號：{{certificat_id}}<br/>{{name}}<br/>{{category}}<br/>{{hours}}<br/>{{created_at}}</div>`,
      },
    ],
  }
  return {
    certificate: data.certificates[0],
  }
}

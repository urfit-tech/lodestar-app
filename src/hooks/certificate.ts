import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import hasura from '../hasura'
import { getSharedCertificate } from '../helpers/publicResource'
import { Certificate, MemberCertificate, SharedCertificate } from '../types/certificate'

export const useMemberCertificateCollection = (memberId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_MEMBER_CERTIFICATE_COLLECTION,
    hasura.GET_MEMBER_CERTIFICATE_COLLECTIONVariables
  >(
    gql`
      query GET_MEMBER_CERTIFICATE_COLLECTION($memberId: String!) {
        member_certificate(where: { member_id: { _eq: $memberId } }) {
          id
          number
          values
          delivered_at
          expired_at
          member_id
          certificate {
            id
            title
            description
            code
            qualification
            period_type
            period_amount
            created_at
            updated_at
            certificate_template {
              id
              template
              background_image
            }
          }
        }
      }
    `,
    { variables: { memberId } },
  )

  const memberCertificates: MemberCertificate[] =
    loading || error || !data || !data.member_certificate
      ? []
      : data.member_certificate.map(memberCertificate => ({
          id: memberCertificate.id,
          number: memberCertificate.number,
          values: memberCertificate.values,
          deliveredAt: new Date(memberCertificate.delivered_at),
          expiredAt: memberCertificate.expired_at ? new Date(memberCertificate.expired_at) : null,
          memberId: memberCertificate.member_id,
          certificate: {
            id: memberCertificate.certificate?.id || '',
            title: memberCertificate.certificate?.title || '',
            description: memberCertificate.certificate?.description || '',
            code: memberCertificate.certificate?.code || '',
            template: memberCertificate.certificate?.certificate_template?.template || '',
            templateImage: memberCertificate.certificate?.certificate_template?.background_image || '',
            qualification: memberCertificate.certificate?.qualification || '',
            periodType: memberCertificate.certificate?.period_type || '',
            periodAmount: memberCertificate.certificate?.period_amount || '',
            createdAt: new Date(memberCertificate.certificate?.created_at),
          },
        }))

  return {
    loading,
    error,
    data: memberCertificates,
    refetch,
  }
}

// One request per id: no retry on error, no refetch on focus.
export const useMemberCertificate = (memberCertificateId: string) => {
  const [result, setResult] = useState<{ id: string; data: SharedCertificate | null; error: unknown }>()
  useEffect(() => {
    if (!memberCertificateId) return
    let active = true
    getSharedCertificate(memberCertificateId).then(
      data => active && setResult({ id: memberCertificateId, data: data || null, error: null }),
      error => active && setResult({ id: memberCertificateId, data: null, error }),
    )
    return () => {
      active = false
    }
  }, [memberCertificateId])
  // A result for another id is stale: report loading until this id's request settles.
  const current = memberCertificateId && result?.id === memberCertificateId ? result : null
  return { data: current?.data || null, error: current?.error, loading: !!memberCertificateId && !current }
}

export const useCertificate = (certificateId: string) => {
  const { loading, data, error, refetch } = useQuery<hasura.GET_CERTIFICATE, hasura.GET_CERTIFICATEVariables>(
    gql`
      query GET_CERTIFICATE($id: uuid!) {
        certificate_by_pk(id: $id) {
          id
          title
          description
          qualification
          period_type
          period_amount
          author_id
          created_at
          updated_at
          published_at
          deleted_at
          code
          certificate_template {
            id
            template
            background_image
          }
        }
      }
    `,
    { variables: { id: certificateId } },
  )
  const certificate: Certificate | null =
    loading || error || !data || !data.certificate_by_pk
      ? null
      : {
          id: data.certificate_by_pk.id,
          title: data.certificate_by_pk.title,
          description: data.certificate_by_pk.description || '',
          qualification: data.certificate_by_pk.qualification || '',
          periodType: data.certificate_by_pk.period_type || null,
          periodAmount: data.certificate_by_pk.period_amount,
          createdAt: new Date(data.certificate_by_pk.created_at),
          code: data.certificate_by_pk.code || null,
          template: data.certificate_by_pk.certificate_template?.template || null,
          templateImage: data.certificate_by_pk.certificate_template?.background_image || null,
        }

  return {
    loading,
    error,
    data: certificate,
    refetch,
  }
}

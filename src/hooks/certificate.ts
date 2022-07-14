import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import hasura from '../hasura'
import { Certificate, MemberCertificate } from '../types/certificate'

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

export const useMemberCertificate = (memberCertificateId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_MEMBER_CERTIFICATE,
    hasura.GET_MEMBER_CERTIFICATEVariables
  >(
    gql`
      query GET_MEMBER_CERTIFICATE($id: uuid!) {
        member_certificate_by_pk(id: $id) {
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
    { variables: { id: memberCertificateId } },
  )
  const memberCertificate: MemberCertificate | null =
    loading || error || !data || !data.member_certificate_by_pk
      ? null
      : {
          id: data.member_certificate_by_pk.id,
          number: data.member_certificate_by_pk.number,
          values: data.member_certificate_by_pk.values,
          deliveredAt: new Date(data.member_certificate_by_pk.delivered_at),
          expiredAt: data.member_certificate_by_pk.expired_at
            ? new Date(data.member_certificate_by_pk.expired_at)
            : null,
          memberId: data.member_certificate_by_pk.member_id,
          certificate: {
            id: data.member_certificate_by_pk.id,
            title: data.member_certificate_by_pk.certificate?.title || '',
            description: data.member_certificate_by_pk.certificate?.description || '',
            qualification: data.member_certificate_by_pk.certificate?.qualification || '',
            periodType: data.member_certificate_by_pk.certificate?.period_type || '',
            periodAmount: data.member_certificate_by_pk.certificate?.period_amount,
            createdAt: new Date(data.member_certificate_by_pk.certificate?.created_at),
            code: data.member_certificate_by_pk.certificate?.code || '',
            template: data.member_certificate_by_pk.certificate?.certificate_template?.template || null,
            templateImage: data.member_certificate_by_pk.certificate?.certificate_template?.background_image || null,
          },
        }

  return {
    loading,
    error,
    data: memberCertificate,
    refetch,
  }
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
          description: data.certificate_by_pk.description,
          qualification: data.certificate_by_pk.qualification,
          periodType: data.certificate_by_pk.period_type,
          periodAmount: data.certificate_by_pk.period_amount,
          createdAt: new Date(data.certificate_by_pk.created_at),
          code: data.certificate_by_pk.code,
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

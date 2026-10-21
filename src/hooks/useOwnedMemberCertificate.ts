import { gql, useQuery } from '@apollo/client'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import hasura from '../hasura'
import { MemberCertificate } from '../types/certificate'

// This query uses the member's existing Hasura permissions, never the public API
// or an admin credential. The explicit owner filter also applies to app owners.
export const OWNED_MEMBER_CERTIFICATE = gql`
  query OWNED_MEMBER_CERTIFICATE($id: uuid!, $memberId: String!) {
    member_certificate(where: { id: { _eq: $id }, member_id: { _eq: $memberId } }, limit: 1) {
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
        meta_tag
        certificate_template {
          id
          template
          background_image
        }
      }
    }
  }
`

export const useOwnedMemberCertificate = (id: string, enabled: boolean) => {
  const { currentMemberId, authToken } = useAuth()
  const certificateId = id.toLowerCase()
  const skip = !enabled || !id || !currentMemberId || !authToken
  const { data, loading, error } = useQuery<hasura.GET_MEMBER_CERTIFICATE_COLLECTION, { id: string; memberId: string }>(
    OWNED_MEMBER_CERTIFICATE,
    {
      variables: { id: certificateId, memberId: currentMemberId || '' },
      skip,
      fetchPolicy: 'no-cache',
      context: { headers: { Authorization: `Bearer ${authToken}` } },
    },
  )
  // Discard stale results immediately on logout, account or certificate changes.
  const row = !skip && !loading && !error ? data?.member_certificate[0] : null
  const certificate = row?.certificate
  const ownedCertificate: MemberCertificate | null =
    row?.id === certificateId && row.member_id === currentMemberId && certificate
      ? {
          id: row.id,
          memberId: row.member_id,
          number: row.number,
          values: row.values,
          deliveredAt: new Date(row.delivered_at),
          expiredAt: row.expired_at ? new Date(row.expired_at) : null,
          certificate: {
            id: certificate.id,
            title: certificate.title,
            description: certificate.description ?? null,
            code: certificate.code ?? null,
            qualification: certificate.qualification ?? null,
            periodType: certificate.period_type ?? null,
            periodAmount: certificate.period_amount ?? null,
            createdAt: new Date(certificate.created_at),
            metaTag: certificate.meta_tag,
            template: certificate.certificate_template?.template || null,
            templateImage: certificate.certificate_template?.background_image || null,
          },
        }
      : null
  return { data: ownedCertificate, loading: !skip && loading }
}

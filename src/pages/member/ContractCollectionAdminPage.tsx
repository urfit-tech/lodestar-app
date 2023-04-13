import { gql, useQuery } from '@apollo/client'
import { Card, List, Tag } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as CoinIcon } from '../../images/coin.svg'
import ForbiddenPage from '../ForbiddenPage'

const messages = defineMessages({
  duration: { id: 'contract.label.duration', defaultMessage: '合約期間' },
  serviceDuration: { id: 'contract.label.serviceDuration', defaultMessage: '服務期間' },
  disagreed: { id: 'contract.label.disagreed', defaultMessage: '尚未簽署' },
  agreed: { id: 'contract.label.agreed', defaultMessage: '已簽署且經過與「{agreeName}」再次確認合約生效' },
  revoked: { id: 'contract.label.revoked', defaultMessage: '已解約' },
})

const ContractCollectionAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const app = useApp()
  const { data: memberContractsData } = useQuery<hasura.GET_MEMBER_CONTRACTS, hasura.GET_MEMBER_CONTRACTSVariables>(
    GET_MEMBER_CONTRACTS,
    {
      variables: { memberId: currentMemberId || '' },
    },
  )

  if (!app.loading && !app.enabledModules.contract) {
    return <ForbiddenPage />
  }

  const data =
    memberContractsData?.member_contract
      .filter(memberContract => memberContract.agreed_at)
      .map(value => {
        return {
          id: value.id,
          title: value.contract.name,
          startedAt: value.started_at,
          endedAt: value.ended_at,
          agreedIp: value.agreed_ip,
          agreedAt: value.agreed_at,
          agreedOptions: value.agreed_options || {},
          revokedAt: value.revoked_at,
          options: value.options || {},
        }
      }) || []
  return (
    <MemberAdminLayout content={{ icon: CoinIcon, title: formatMessage(commonMessages.content.contracts) }}>
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <Link to={`/members/${currentMemberId}/contracts/${item.id}`}>
              <Card
                title={
                  <div className="d-flex justify-content-between">
                    <span className="mr-1">{item.title}</span>
                    {!item.agreedAt && <Tag>{formatMessage(messages.disagreed)}</Tag>}
                  </div>
                }
              >
                <div>
                  {formatMessage(messages.duration)}: {moment(item.startedAt).format('YYYY-MM-DD')} ~{' '}
                  {moment(item.endedAt).format('YYYY-MM-DD')}
                </div>
                {item.revokedAt && (
                  <div>
                    <span className="mr-1">{moment(item.revokedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    {formatMessage(messages.revoked)}
                  </div>
                )}
                {!item.revokedAt && item.agreedAt && (
                  <div>
                    <span className="mr-1">{moment(item.agreedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                    {formatMessage(messages.agreed, { agreeName: item.agreedOptions.agreedName })}
                  </div>
                )}
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </MemberAdminLayout>
  )
}

const GET_MEMBER_CONTRACTS = gql`
  query GET_MEMBER_CONTRACTS($memberId: String!) {
    member_contract(where: { member_id: { _eq: $memberId } }) {
      id
      agreed_at
      agreed_ip
      agreed_options
      revoked_at
      started_at
      ended_at
      options
      contract {
        name
      }
    }
  }
`

export default ContractCollectionAdminPage

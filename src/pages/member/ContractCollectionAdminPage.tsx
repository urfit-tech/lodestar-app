import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { Card, List, Tag, Typography } from 'antd'
import gql from 'graphql-tag'
import moment from 'moment'
import React from 'react'
import { defineMessages, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { useAuth } from '../../components/auth/AuthContext'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
import { useApp } from '../../containers/common/AppContext'
import hasura from '../../hasura'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as CoinIcon } from '../../images/coin.svg'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'

const messages = defineMessages({
  duration: { id: 'contract.label.duration', defaultMessage: '服務期間' },
  disagreed: { id: 'contract.label.disagreed', defaultMessage: '尚未簽署' },
  agreed: { id: 'contract.label.agreed', defaultMessage: '已簽署且經過與「{agreeName}」再次確認合約生效' },
  revoked: { id: 'contract.label.revoked', defaultMessage: '已解約' },
})

const ContractCollectionAdminPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()
  const { loading, enabledModules } = useApp()
  const { data: memberContractsData } = useQuery<hasura.GET_MEMBER_CONTRACTS, hasura.GET_MEMBER_CONTRACTSVariables>(
    GET_MEMBER_CONTRACTS,
    {
      variables: { memberId: currentMemberId || '' },
    },
  )

  if (loading) {
    return <LoadingPage />
  }

  if (!enabledModules.contract) {
    return <NotFoundPage />
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
          agreedOptions: value.agreed_options,
          revokedAt: value.revoked_at,
        }
      }) || []
  return (
    <MemberAdminLayout>
      <Typography.Title level={3} className="mb-4">
        <Icon as={CoinIcon} className="mr-3" />
        <span>{formatMessage(commonMessages.content.contracts)}</span>
      </Typography.Title>
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
                {formatMessage(messages.duration)}: {moment(item.startedAt).format('YYYY-MM-DD')} ~{' '}
                {moment(item.endedAt).format('YYYY-MM-DD')}
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
      contract {
        name
      }
    }
  }
`

export default ContractCollectionAdminPage

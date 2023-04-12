import { gql, useMutation } from '@apollo/client'
import { Card, Checkbox, Typography } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import Axios from 'axios'
import moment from 'moment'
import { render } from 'mustache'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { dateFormatter, handleError } from '../helpers'
import { useMemberContract } from '../hooks/data'
import NotFoundPage from './NotFoundPage'

const StyledTitle = styled(Typography.Title)`
  && {
    margin-bottom: 36px;
    font-size: 24px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: 0.77px;
  }
`
const StyledCard = styled(Card)`
  && {
    margin-bottom: 20px;
  }

  .ant-card-body {
    padding: 40px;
  }

  p,
  li {
    margin-bottom: 0;
    line-height: 1.69;
    letter-spacing: 0.2px;
  }

  ol {
    padding-left: 50px;
    li {
      padding-left: 16px;
    }
  }
`
const StyledSection = styled.section`
  background: #f7f8f8;
  padding-top: 56px;
  padding: 80px 0;
  text-align: justify;

  & > ${StyledTitle} {
    text-align: center;
  }
  ol p {
    text-indent: 2rem;
  }
`

const ContractPage: React.VFC = () => {
  const { memberContractId } = useParams<{ memberId: string; memberContractId: string }>()
  const [agreedIp, setAgreedIpAddress] = useState('unknown')
  const { memberContract, refetch: refetchMemberContract } = useMemberContract(memberContractId)
  const [agreeMemberContract] = useMutation<hasura.AGREE_MEMBER_CONTRACT, hasura.AGREE_MEMBER_CONTRACTVariables>(
    AGREE_MEMBER_CONTRACT,
  )

  useEffect(() => {
    Axios.get('https://api.ipify.org/').then(res => setAgreedIpAddress(res.data))
  }, [])

  if (!memberContract) {
    return <NotFoundPage />
  }

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked && window.confirm('同意後無法修改')) {
      agreeMemberContract({
        variables: {
          memberContractId,
          agreedAt: new Date(),
          agreedIp,
          agreedOptions: {
            agreedName: memberContract.values?.invoice?.name,
            agreedPhone: memberContract.values?.invoice?.phone,
          },
        },
      })
        .then(() => refetchMemberContract())
        .catch(handleError)
    }
  }

  return (
    <DefaultLayout>
      <StyledSection className="container">
        <StyledTitle level={1}>{'線上課程服務約款'}</StyledTitle>
        <StyledCard>
          <div
            dangerouslySetInnerHTML={{
              __html: render(memberContract.contract.template, {
                ...memberContract.values,
                startedAt: memberContract.values?.startedAt ? dateFormatter(memberContract.values.startedAt) : '',
                endedAt: memberContract.values?.endedAt ? dateFormatter(memberContract.values.endedAt) : '',
              }),
            }}
          />
        </StyledCard>

        <StyledCard>
          <div className="text-center">
            {memberContract.revokedAt ? (
              <p>已於 {moment(memberContract.revokedAt).format('YYYY-MM-DD HH:mm:ss')} 解除此契約</p>
            ) : memberContract.agreedAt ? (
              <p>已於 {moment(memberContract.agreedAt).format('YYYY-MM-DD HH:mm:ss')} 同意此契約</p>
            ) : memberContract.startedAt && moment() >= moment(memberContract.startedAt) ? (
              <p>此合約已失效</p>
            ) : (
              <Checkbox checked={!!memberContract.agreedAt} onChange={handleCheck}>
                我已詳細閱讀並同意上述契約並願意遵守規定
              </Checkbox>
            )}
          </div>
        </StyledCard>
      </StyledSection>
    </DefaultLayout>
  )
}

const AGREE_MEMBER_CONTRACT = gql`
  mutation AGREE_MEMBER_CONTRACT(
    $memberContractId: uuid!
    $agreedAt: timestamptz!
    $agreedIp: String!
    $agreedOptions: jsonb
  ) {
    update_member_contract(
      where: { id: { _eq: $memberContractId } }
      _set: { agreed_at: $agreedAt, agreed_ip: $agreedIp, agreed_options: $agreedOptions }
    ) {
      affected_rows
    }
  }
`

export default ContractPage

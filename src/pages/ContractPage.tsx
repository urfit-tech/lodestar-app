import { useMutation } from '@apollo/react-hooks'
import { Card, Checkbox, Typography } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox'
import Axios from 'axios'
import gql from 'graphql-tag'
import moment from 'moment'
import { render } from 'mustache'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useMemberContract } from '../hooks/data'
import types from '../types'

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
  padding-bottom: 80px;
  text-align: justify;

  & > ${StyledTitle} {
    text-align: center;
  }
  ol p {
    text-indent: 2rem;
  }
`

const ContractPage: React.FC = () => {
  const { memberContractId } = useParams<{ memberId: string; memberContractId: string }>()
  const [agreedIp, setAgreedIpAddress] = useState('unknown')
  const { memberContract, refetch: refetchMemberContract } = useMemberContract(memberContractId)
  const [agreeMemberContract] = useMutation<types.AGREE_MEMBER_CONTRACT, types.AGREE_MEMBER_CONTRACTVariables>(
    AGREE_MEMBER_CONTRACT,
  )
  const agreedOptions = {
    agreedName: memberContract.values?.invoice?.name,
    agreedPhone: memberContract.values?.invoice?.phone,
  }

  useEffect(() => {
    Axios.get('https://api.ipify.org/').then(res => setAgreedIpAddress(res.data))
  }, [])

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked && window.confirm('同意後無法修改')) {
      agreeMemberContract({
        variables: {
          memberContractId,
          agreedAt: new Date(),
          agreedIp,
          agreedOptions,
        },
      }).then(() => refetchMemberContract())
    }
  }
  return (
    <DefaultLayout>
      <StyledSection className="container">
        <StyledTitle level={1}>{'線上課程服務約款'}</StyledTitle>
        <StyledCard>
          <div dangerouslySetInnerHTML={{ __html: render(memberContract.contract.template, memberContract.values) }} />
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

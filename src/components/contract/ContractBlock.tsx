import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import Axios from 'axios'
import { render } from 'mustache'
import { Card, Checkbox, Typography } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Skeleton } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from '@chakra-ui/modal'
import hasura from '../../hasura'
import { dateFormatter, handleError } from '../../helpers'
import { gql, useMutation } from '@apollo/client'
import contractMessages from './translation'
import Embedded from 'lodestar-app-element/src/components/common/Embedded'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import dayjs from 'dayjs'
import { MemberContract } from '../../types/contract'

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

const ContractBlock: React.FC<{
  memberContract: MemberContract
  onMemberContractDataChange?: (memberContract: MemberContract) => void
}> = ({ memberContract, onMemberContractDataChange }) => {
  const { formatMessage } = useIntl()
  const { isAuthenticating, currentMemberId } = useAuth()
  const { settings } = useApp()
  const [agreedIp, setAgreedIpAddress] = useState('unknown')
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false)
  const [agreeMemberContract] = useMutation<hasura.AgreeMemberContract, hasura.AgreeMemberContractVariables>(
    AgreeMemberContract,
  )

  const memberContractId = memberContract?.id

  const customConfirmText =
    settings['custom.contract.confirm.text'] &&
    JSON.parse(settings['custom.contract.confirm.text'])[memberContract?.contract.id || '']

  useEffect(() => {
    Axios.get('https://api.ipify.org/').then(res => setAgreedIpAddress(res.data))
  }, [])

  const handleAgreeMemberContract = (memberContract: {
    startedAt: Date | null
    endedAt: Date | null
    values: any
    agreedAt: Date | null
    agreedIp: string | null
    agreedOptions: any
    memberId: string
    memberName: string | null
    memberEmail: string | null
    revokedAt: Date | null
    contract: {
      id: string
      name: string
      description: string
      template: string
    }
  }) => {
    return agreeMemberContract({
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
  }

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (
      e.target.checked &&
      window.confirm(formatMessage(contractMessages.ContractBlock.cannotModifyAfterAgree)) &&
      memberContract
    ) {
      handleAgreeMemberContract(memberContract)
        .then(() => {
          onMemberContractDataChange?.({
            ...memberContract,
            agreedAt: new Date(),
            agreedIp,
            agreedOptions: {
              agreedName: memberContract.values?.invoice?.name,
              agreedPhone: memberContract.values?.invoice?.phone,
            },
          })
        })
        .catch(handleError)
    }
  }

  return (
    <>
      <StyledSection className="container">
        <StyledTitle level={1}>
          {settings['contract_page.v2.enabled'] === '1'
            ? formatMessage(contractMessages.ContractBlock.contract)
            : formatMessage(contractMessages.ContractBlock.onlineCourseServiceTerms)}
        </StyledTitle>
        <StyledCard>
          {isAuthenticating ? (
            <Skeleton />
          ) : memberContract ? (
            <Embedded
              iframe={render(memberContract.contract.template, {
                ...memberContract.values,
                startedAt: memberContract.values?.startedAt ? dateFormatter(memberContract.values.startedAt) : '',
                endedAt: memberContract.values?.endedAt ? dateFormatter(memberContract.values.endedAt) : '',
              })}
            />
          ) : (
            formatMessage(contractMessages.ContractBlock.noContractContent)
          )}
        </StyledCard>

        {!isAuthenticating && memberContract && (
          <StyledCard>
            <div className="text-center">
              current page
              {memberContract.revokedAt ? (
                <>
                  <p>
                    {formatMessage(contractMessages.ContractBlock.name)}：{memberContract.memberName} /{' '}
                    {formatMessage(contractMessages.ContractBlock.email)}：{memberContract.memberEmail}
                  </p>
                  <b>
                    {formatMessage(contractMessages.ContractBlock.revokedOn, {
                      date: dayjs(memberContract.revokedAt).format('YYYY-MM-DD HH:mm:ss'),
                    })}
                  </b>
                </>
              ) : memberContract.agreedAt ? (
                <>
                  <p>
                    {formatMessage(contractMessages.ContractBlock.name)}：{memberContract.memberName} /
                    {formatMessage(contractMessages.ContractBlock.email)}：{memberContract.memberEmail}
                  </p>
                  <b>
                    {formatMessage(contractMessages.ContractBlock.agreedOn, {
                      date: dayjs(memberContract.agreedAt).format('YYYY-MM-DD HH:mm:ss'),
                    })}
                  </b>
                </>
              ) : memberContract.startedAt && dayjs() >= dayjs(memberContract.startedAt) ? (
                <b> {formatMessage(contractMessages.ContractBlock.contractExpired)}</b>
              ) : !!(currentMemberId && currentMemberId === memberContract.memberId) ? (
                <>
                  <p>
                    {formatMessage(contractMessages.ContractBlock.name)}：{memberContract.memberName} /
                    {formatMessage(contractMessages.ContractBlock.email)}：{memberContract.memberEmail}
                  </p>
                  <Checkbox
                    checked={!!memberContract.agreedAt}
                    onChange={
                      settings['contract_page.v2.enabled'] === '1' ? () => setIsOpenApproveModal(true) : handleCheck
                    }
                  >
                    <b> {formatMessage(contractMessages.ContractBlock.alreadyReadAndAgree)}</b>
                  </Checkbox>
                </>
              ) : (
                <b> {formatMessage(contractMessages.ContractBlock.requireContractingParty)}</b>
              )}
            </div>
          </StyledCard>
        )}
      </StyledSection>

      {/* settings['contract_page.v2.enabled'] === '1' */}
      <Modal
        onClose={() => {
          setIsOpenApproveModal(false)
        }}
        isOpen={isOpenApproveModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody style={{ marginTop: 24 }}>
            {customConfirmText || formatMessage(contractMessages.ContractBlock.confirmContractTerms)}
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-4"
              w="100%"
              onClick={() => {
                setIsOpenApproveModal(false)
              }}
            >
              {formatMessage(contractMessages.ContractBlock.disagree)}
            </Button>
            <Button
              colorScheme="primary"
              w="100%"
              onClick={() => {
                memberContract &&
                  handleAgreeMemberContract(memberContract)
                    .then(() => {
                      onMemberContractDataChange?.({
                        ...memberContract,
                        agreedAt: new Date(),
                        agreedIp,
                        agreedOptions: {
                          agreedName: memberContract.values?.invoice?.name,
                          agreedPhone: memberContract.values?.invoice?.phone,
                        },
                      })
                      setIsOpenApproveModal(false)
                    })
                    .catch(handleError)
              }}
            >
              {formatMessage(contractMessages.ContractBlock.agree)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
const AgreeMemberContract = gql`
  mutation AgreeMemberContract(
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

export default ContractBlock

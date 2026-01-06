import { gql, useMutation } from '@apollo/client'
import { Button } from '@chakra-ui/button'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay } from '@chakra-ui/modal'
import { Card, Checkbox, Skeleton, Typography } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import Axios from 'axios'
import Embedded from 'lodestar-app-element/src/components/common/Embedded'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import { render } from 'mustache'
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../components/auth/AuthModal'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { dateFormatter, handleError } from '../helpers'
import { useAuthModal } from '../hooks/auth'
import { useMemberContract } from '../hooks/data'
import pageMessages from './translation'

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

const ContractPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { isAuthenticating, isAuthenticated, currentMemberId } = useAuth()
  const { settings } = useApp()
  const authModal = useAuthModal()
  const { memberContractId, memberId } = useParams<{ memberId: string; memberContractId: string }>()
  const [agreedIp, setAgreedIpAddress] = useState('unknown')
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false)
  const {
    memberContract,
    refetch: refetchMemberContract,
    loading: memberContractLoading,
  } = useMemberContract(memberContractId)
  const [agreeMemberContract] = useMutation<hasura.AGREE_MEMBER_CONTRACT, hasura.AGREE_MEMBER_CONTRACTVariables>(
    AGREE_MEMBER_CONTRACT,
  )

  useEffect(() => {
    Axios.get('https://api.ipify.org/').then(res => setAgreedIpAddress(res.data))
  }, [])

  const customConfirmText =
    settings['custom.contract.confirm.text'] &&
    JSON.parse(settings['custom.contract.confirm.text'])[memberContract?.contract.id || '']

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (
      e.target.checked &&
      window.confirm(formatMessage(pageMessages.ContractPage.cannotModifyAfterAgree)) &&
      memberContract
    ) {
      agreeMemberContract({
        variables: {
          memberContractId,
          agreedAt: new Date(),
          agreedIp,
          agreedOptions: {
            agreedName: memberContract.values?.invoice?.name,
            agreedPhone: memberContract.values?.invoice?.phone,
            agreedAnnouncement: formatMessage(pageMessages.ContractPage.alreadyReadAndAgree),
          },
        },
      })
        .then(() => refetchMemberContract())
        .catch(handleError)
    }
  }

  return (
    <DefaultLayout>
      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => {
          if (!memberContract && !isAuthenticating && !isAuthenticated) {
            authModal.open(setAuthModalVisible)
          }
          return <></>
        }}
      </AuthModalContext.Consumer>
      <StyledSection className="container">
        <StyledTitle level={1}>
          {settings['contract_page.v2.enabled'] === '1'
            ? formatMessage(pageMessages.ContractPage.contract)
            : formatMessage(pageMessages.ContractPage.onlineCourseServiceTerms)}
        </StyledTitle>
        <StyledCard>
          {isAuthenticating || memberContractLoading ? (
            <Skeleton active />
          ) : memberContract ? (
            <Embedded
              iframe={render(memberContract.contract.template, {
                ...memberContract.values,
                startedAt: memberContract.values?.startedAt ? dateFormatter(memberContract.values.startedAt) : '',
                endedAt: memberContract.values?.endedAt ? dateFormatter(memberContract.values.endedAt) : '',
              })}
            />
          ) : (
            formatMessage(pageMessages.ContractPage.noContractContent)
          )}
        </StyledCard>

        {!isAuthenticating && !memberContractLoading && memberContract && (
          <StyledCard>
            <div className="text-center">
              {memberContract.revokedAt ? (
                <>
                  <p>
                    {formatMessage(pageMessages.ContractPage.name)}：{memberContract.memberName} /{' '}
                    {formatMessage(pageMessages.ContractPage.email)}：{memberContract.memberEmail}
                  </p>
                  <b>
                    {formatMessage(pageMessages.ContractPage.revokedOn, {
                      date: moment(memberContract.revokedAt).format('YYYY-MM-DD HH:mm:ss'),
                    })}
                  </b>
                </>
              ) : memberContract.agreedAt ? (
                <>
                  <p>
                    {formatMessage(pageMessages.ContractPage.name)}：{memberContract.memberName} /{' '}
                    {formatMessage(pageMessages.ContractPage.email)}：{memberContract.memberEmail}
                  </p>
                  <b>
                    {formatMessage(pageMessages.ContractPage.agreedOn, {
                      date: moment(memberContract.agreedAt).format('YYYY-MM-DD HH:mm:ss'),
                    })}
                  </b>
                  {memberContract.agreedOptions.agreedAnnouncement ? (
                    <>
                      <br />
                      <b>{memberContract.agreedOptions.agreedAnnouncement}</b>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              ) : memberContract.startedAt && moment() >= moment(memberContract.startedAt) ? (
                <b> {formatMessage(pageMessages.ContractPage.contractExpired)}</b>
              ) : !!(currentMemberId && currentMemberId === memberId) ? (
                <>
                  <p>
                    {formatMessage(pageMessages.ContractPage.name)}：{memberContract.memberName} /{' '}
                    {formatMessage(pageMessages.ContractPage.email)}：{memberContract.memberEmail}
                  </p>
                  <Checkbox
                    checked={!!memberContract.agreedAt}
                    onChange={
                      settings['contract_page.v2.enabled'] === '1' ? () => setIsOpenApproveModal(true) : handleCheck
                    }
                  >
                    <b> {formatMessage(pageMessages.ContractPage.alreadyReadAndAgree)}</b>
                  </Checkbox>
                </>
              ) : (
                <b> {formatMessage(pageMessages.ContractPage.requireContractingParty)}</b>
              )}
            </div>
          </StyledCard>
        )}
      </StyledSection>
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
            {customConfirmText || formatMessage(pageMessages.ContractPage.confirmContractTerms)}
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-4"
              w="100%"
              onClick={() => {
                setIsOpenApproveModal(false)
              }}
            >
              {formatMessage(pageMessages.ContractPage.disagree)}
            </Button>
            <Button
              colorScheme="primary"
              w="100%"
              onClick={() => {
                memberContract &&
                  agreeMemberContract({
                    variables: {
                      memberContractId,
                      agreedAt: new Date(),
                      agreedIp,
                      agreedOptions: {
                        agreedName: memberContract.values?.invoice?.name,
                        agreedPhone: memberContract.values?.invoice?.phone,
                        agreedAnnouncement: formatMessage(pageMessages.ContractPage.alreadyReadAndAgree),
                      },
                    },
                  })
                    .then(() =>
                      // memberContract.values.paymentOptions?.paymentGateway?.includes('spgateway')
                      //   ? (window.location.href = `/members/${memberId}/contracts/${memberContractId}/deal`)
                      //   : window.location.reload(),
                      window.location.reload(),
                    )
                    .catch(handleError)
              }}
            >
              {formatMessage(pageMessages.ContractPage.agree)}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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

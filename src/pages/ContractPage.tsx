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
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { AuthModalContext } from '../components/auth/AuthModal'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { dateFormatter, handleError } from '../helpers'
import { useAuthModal } from '../hooks/auth'
import { useMemberContract } from '../hooks/data'

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

  if (currentMemberId && currentMemberId !== memberId) {
    return <DefaultLayout>無法查看他人合約</DefaultLayout>
  }
  const customConfirmText =
    settings['custom.contract.confirm.text'] &&
    JSON.parse(settings['custom.contract.confirm.text'])[memberContract?.contract.id || '']

  const handleCheck = (e: CheckboxChangeEvent) => {
    if (e.target.checked && window.confirm('同意後無法修改') && memberContract) {
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
      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => {
          if (!memberContract && !isAuthenticating && !isAuthenticated) {
            authModal.open(setAuthModalVisible)
          }
          return <></>
        }}
      </AuthModalContext.Consumer>
      <StyledSection className="container">
        <StyledTitle level={1}>{'線上課程服務約款'}</StyledTitle>
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
            '無合約內容'
          )}
        </StyledCard>

        {!isAuthenticating && !memberContractLoading && memberContract && (
          <StyledCard>
            <div className="text-center">
              {memberContract.revokedAt ? (
                <>
                  <p>
                    姓名：{memberContract.memberName} / 信箱：{memberContract.memberEmail}
                  </p>
                  <b>已於 {moment(memberContract.revokedAt).format('YYYY-MM-DD HH:mm:ss')} 解除此契約</b>
                </>
              ) : memberContract.agreedAt ? (
                <>
                  <p>
                    姓名：{memberContract.memberName} / 信箱：{memberContract.memberEmail}
                  </p>
                  <b>已於 {moment(memberContract.agreedAt).format('YYYY-MM-DD HH:mm:ss')} 同意此契約</b>
                </>
              ) : memberContract.startedAt && moment() >= moment(memberContract.startedAt) ? (
                <b>此合約已失效</b>
              ) : (
                <>
                  <p>
                    姓名：{memberContract.memberName} / 信箱：{memberContract.memberEmail}
                  </p>
                  <Checkbox
                    checked={!!memberContract.agreedAt}
                    onChange={
                      settings['contract_page.v2.enabled'] === '1' ? () => setIsOpenApproveModal(true) : handleCheck
                    }
                  >
                    <b> 我已詳細閱讀並同意上述契約並願意遵守規定</b>
                  </Checkbox>
                </>
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
            {customConfirmText || '請確認您已了解並同意此合約條款，在合約期間內，雙方將遵守此條款，不可任意修改。'}
          </ModalBody>
          <ModalFooter>
            <Button
              className="mr-4"
              w="100%"
              onClick={() => {
                setIsOpenApproveModal(false)
              }}
            >
              不同意
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
                      },
                    },
                  })
                    .then(() => (window.location.href = `/members/${memberId}/contracts/${memberContractId}/deal`))
                    .catch(handleError)
              }}
            >
              確認同意
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

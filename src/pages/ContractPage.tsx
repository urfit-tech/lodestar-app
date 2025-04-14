import { Skeleton } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useParams } from 'react-router-dom'
import { AuthModalContext } from '../components/auth/AuthModal'
import ContractBlock from '../components/contract/ContractBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useAuthModal } from '../hooks/auth'
import { useMemberContract } from '../hooks/data'
import pageMessages from './translation'
import dayjs from 'dayjs'

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
  const { isAuthenticating, isAuthenticated } = useAuth()
  const authModal = useAuthModal()
  const { memberContractId } = useParams<{ memberId: string; memberContractId: string }>()
  const { memberContract, setMemberContractData, loading: memberContractLoading } = useMemberContract(memberContractId)

  return (
    <DefaultLayout>
      <AuthModalContext.Consumer>
        {({ setVisible: setAuthModalVisible }) => {
          if (!isAuthenticating && !isAuthenticated) {
            authModal.open(setAuthModalVisible)
          }
          return null
        }}
      </AuthModalContext.Consumer>
      {memberContractLoading ? (
        <Skeleton />
      ) : memberContract ? (
        <ContractBlock memberContract={memberContract} onMemberContractDataChange={setMemberContractData} />
      ) : null}
    </DefaultLayout>
  )
}

export default ContractPage

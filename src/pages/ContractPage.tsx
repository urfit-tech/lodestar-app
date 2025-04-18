import { Skeleton } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React from 'react'
import { useParams } from 'react-router-dom'
import { AuthModalContext } from '../components/auth/AuthModal'
import ContractBlock from '../components/contract/ContractBlock'
import DefaultLayout from '../components/layout/DefaultLayout'
import { useAuthModal } from '../hooks/auth'
import { useMemberContract } from '../hooks/data'

const ContractPage: React.FC = () => {
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

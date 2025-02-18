import { defineMessages } from 'react-intl'

const contractMessages = {
  ContractBlock: defineMessages({
    contractDuration: {
      id: 'contract.ContractBlock.contractDuration',
      defaultMessage: `Contract duration`,
    },
    cannotModifyAfterAgree: {
      id: 'contract.ContractBlock.cannotModifyAfterAgree',
      defaultMessage: `Can't modify after consent`,
    },
    onlineCourseServiceTerms: {
      id: 'contract.ContractBlock.onlineCourseServiceTerms',
      defaultMessage: 'Online Course Service Terms',
    },
    contract: {
      id: 'contract.ContractBlock.contract',
      defaultMessage: 'Contract',
    },
    noContractContent: {
      id: 'contract.ContractBlock.noContractContent',
      defaultMessage: 'No Contract Content',
    },
    name: {
      id: 'contract.ContractBlock.name',
      defaultMessage: 'Name',
    },
    email: {
      id: 'contract.ContractBlock.email',
      defaultMessage: 'Email',
    },
    agreedOn: {
      id: 'contract.ContractBlock.agreedOn',
      defaultMessage: 'Agreed to this contract on {date}',
    },
    revokedOn: {
      id: 'contract.ContractBlock.revokedOn',
      defaultMessage: 'Revoked to this contract on {date}',
    },
    terminatedOn: {
      id: 'contract.ContractBlock.terminatedOn',
      defaultMessage: 'This contract was terminated on {date}',
    },
    contractExpired: {
      id: 'contract.ContractBlock.contractExpired',
      defaultMessage: 'This contract has expired',
    },
    alreadyReadAndAgree: {
      id: 'contract.ContractBlock.alreadyReadAndAgree',
      defaultMessage: 'I have carefully read and agree to the above contract and am willing to abide by the terms.',
    },
    requireContractingParty: {
      id: 'contract.ContractBlock.requireContractingParty',
      defaultMessage: 'Signature Required by the Contracting Party',
    },
    disagree: {
      id: 'contract.ContractBlock.disagree',
      defaultMessage: 'Disagree',
    },
    agree: {
      id: 'contract.ContractBlock.agree',
      defaultMessage: 'Agree',
    },
    confirmContractTerms: {
      id: 'contract.ContractBlock.confirmContractTerms',
      defaultMessage: '請確認您已了解並同意此合約條款，在合約期間內，雙方將遵守此條款，不可任意修改。',
    },
  }),
}

export default contractMessages

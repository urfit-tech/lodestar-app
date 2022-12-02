import { Button, Select, useDisclosure, useToast } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useIntl } from 'react-intl'
import ApplyTagButton from './ApplyTagButton'
import CommonModal from './CommonModal'
import { commonMessages } from '../../helpers/translation'
import styled from 'styled-components'
import { AuthModalContext } from '../auth/AuthModal'
import { useContext, useState } from 'react'
import { useAuthModal } from '../../hooks/auth'
import { useMutateProjectRole } from '../../hooks/project'

const StyledContentText = styled.div`
  width: 58px;
  height: 24px;
  margin: 3px 73px 4px 0;
  font-family: NotoSansCJKtc;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: 0.4px;
  color: var(--gray-darker);
`

const ApplyTagModal: React.VFC<{
  projectId: string
  renderTrigger?: React.VFC<{
    setVisible: () => void
  }>
}> = ({ projectId, renderTrigger }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { isAuthenticated } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const authModal = useAuthModal()
  const { formatMessage } = useIntl()
  // TODO: selectedIdentityId initial value
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('62a4828a-3042-421f-82fb-5fe352a4ff8b')
  const { insertProjectRole } = useMutateProjectRole(projectId, selectedIdentityId)

  const handleOpen = () => {
    if (!isAuthenticated) {
      // TODO: open auth modal after login
      authModal.open(setAuthModalVisible)
    } else {
      onOpen()
    }
  }

  const handleSubmit = async () => {
    await insertProjectRole()
    // TODO: toast style
    toast({
      title: formatMessage(commonMessages.text.appliedTag),
      status: 'success',
      duration: 1500,
      position: 'top',
    })
    onClose()
  }

  return (
    <>
      {renderTrigger?.({ setVisible: handleOpen }) || <ApplyTagButton onClick={handleOpen} />}
      <CommonModal
        isOpen={isOpen}
        onClose={onClose}
        title={formatMessage(commonMessages.label.applyTag)}
        renderFooter={() => (
          <>
            {/* TODO: button style */}
            <Button className="mt-n3" mr="0.75rem" onClick={onClose}>
              {formatMessage(commonMessages.ui.cancel)}
            </Button>
            <Button colorScheme="primary" className="mt-n3" onClick={handleSubmit}>
              {formatMessage(commonMessages.ui.submit)}
            </Button>
          </>
        )}
        closeOnOverlayClick={false}
        isCentered
      >
        <StyledContentText>{formatMessage(commonMessages.label.participateRole)}</StyledContentText>
        <Select
          color="var(--gray)"
          placeholder={formatMessage(commonMessages.form.placeholder.selectRole)}
          onChange={e => setSelectedIdentityId(e.target.value)}
        >
          {/* TODO: get identity id, name */}
          <option value={'62a4828a-3042-421f-82fb-5fe352a4ff8b'}>製作人</option>
        </Select>
      </CommonModal>
    </>
  )
}

export default ApplyTagModal

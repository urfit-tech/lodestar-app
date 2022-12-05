import { Button, Select, useDisclosure, useToast } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useIntl } from 'react-intl'
import ApplyTagButton from './ApplyTagButton'
import CommonModal from './CommonModal'
import { commonMessages } from '../../helpers/translation'
import styled from 'styled-components'
import { AuthModalContext } from '../auth/AuthModal'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useAuthModal } from '../../hooks/auth'
import { useMutateProjectRole, useProjectRole } from '../../hooks/project'
import Cookies from 'js-cookie'
import { uniqBy } from 'ramda'

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
  const [selectedIdentityId, setSelectedIdentityId] = useState<string | null>(null)
  const { insertProjectRole } = useMutateProjectRole(projectId, selectedIdentityId)
  const { projectRoles } = useProjectRole(projectId)
  const participateRoles = uniqBy(v => v.identityId, projectRoles)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleOpen = useCallback(() => {
    if (!isAuthenticated) {
      Cookies.set('isApplyingTag', 'true')
      authModal.open(setAuthModalVisible)
    } else {
      onOpen()
    }
  }, [isAuthenticated, authModal, setAuthModalVisible, onOpen])

  const handleClose = () => {
    Cookies.remove('isApplyingTag')
    onClose()
  }

  const handleSubmit = async () => {
    if (!insertProjectRole) {
      return toast({
        title: formatMessage(commonMessages.form.placeholder.selectRole),
        status: 'error',
        duration: 1500,
        position: 'top',
      })
    }
    setIsLoading(true)
    await insertProjectRole()
    toast({
      title: formatMessage(commonMessages.text.appliedTag),
      status: 'success',
      duration: 1500,
      position: 'top',
    })
    setIsLoading(false)
    onClose()
  }

  useEffect(() => {
    if (Boolean(Cookies.get('isApplyingTag'))) {
      handleOpen()
      Cookies.remove('isApplyingTag')
    }
  }, [handleOpen])

  return (
    <>
      {renderTrigger?.({ setVisible: handleOpen }) || <ApplyTagButton onClick={handleOpen} />}
      <CommonModal
        isOpen={isOpen}
        onClose={handleClose}
        title={formatMessage(commonMessages.label.applyTag)}
        renderFooter={() => (
          <>
            <Button mr="0.75rem" onClick={handleClose}>
              {formatMessage(commonMessages.ui.cancel)}
            </Button>
            <Button isLoading={isLoading} colorScheme="primary" onClick={handleSubmit}>
              {formatMessage(commonMessages.ui.submit)}
            </Button>
          </>
        )}
        isCentered
      >
        <StyledContentText>{formatMessage(commonMessages.label.participateRole)}</StyledContentText>
        <Select
          placeholder={formatMessage(commonMessages.form.placeholder.selectRole)}
          onChange={e => setSelectedIdentityId(e.target.value)}
        >
          {participateRoles.map(role => (
            <option value={role.identityId}>{role.identityName}</option>
          ))}
        </Select>
      </CommonModal>
    </>
  )
}

export default ApplyTagModal

import { Button, Select, useDisclosure, useToast } from '@chakra-ui/react'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useIntl } from 'react-intl'
import ApplyTagButton from './ApplyTagButton'
import CommonModal from './CommonModal'
import { commonMessages } from '../../helpers/translation'
import styled from 'styled-components'
import { AuthModalContext } from '../auth/AuthModal'
import { useContext, useEffect, useState } from 'react'
import { useAuthModal } from '../../hooks/auth'
import { useMutateProjectRole, useProjectRole } from '../../hooks/project'
import Cookies from 'js-cookie'
import { uniqBy } from 'ramda'
import { handleError } from '../../helpers'

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
  const { isAuthenticated, currentMemberId } = useAuth()
  const { setVisible: setAuthModalVisible } = useContext(AuthModalContext)
  const authModal = useAuthModal()
  const { formatMessage } = useIntl()
  const [selectedIdentityId, setSelectedIdentityId] = useState<string | null>(null)
  const { insertProjectRole } = useMutateProjectRole(projectId, selectedIdentityId)
  const { projectRoles, refetchProjectRoles } = useProjectRole(projectId)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const uniqueProjectRoles = uniqBy(v => v.identityId, projectRoles)
  const appliedRoleIds = projectRoles
    .filter(v => v.memberId === currentMemberId && v.rejectAt === null)
    .map(v => v.identityId)
  const applyingRoleIds = projectRoles.filter(
    v => v.memberId === currentMemberId && v.rejectAt === null && v.agreedAt === null,
  )

  const handleOpen = () => {
    if (!isAuthenticated) {
      Cookies.set('isApplyingTag', 'true')
      authModal.open(setAuthModalVisible)
    } else {
      onOpen()
    }
  }

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
    refetchProjectRoles().catch(handleError)
  }

  useEffect(() => {
    if (Boolean(Cookies.get('isApplyingTag'))) {
      handleOpen()
      Cookies.remove('isApplyingTag')
    }
  }, [])

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
          {uniqueProjectRoles
            .filter(role => role.identityName !== 'author')
            .map(role => (
              <option
                key={role.id}
                value={role.identityId}
                disabled={appliedRoleIds.includes(role.identityId) || applyingRoleIds.includes(role.identityId)}
              >
                {role.identityName}
              </option>
            ))}
        </Select>
      </CommonModal>
    </>
  )
}

export default ApplyTagModal

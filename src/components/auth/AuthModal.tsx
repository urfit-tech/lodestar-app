import { Divider, Modal } from 'antd'
import { CommonLargeTitleMixin } from 'lodestar-app-element/src/components/common'
import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import { useCustomRenderer } from '../../contexts/CustomRendererContext'
import { AuthState } from '../../types/member'
import { BREAK_POINT } from '../common/Responsive'
import LoginSection from './login/LoginSection'
import RegisterSection from './RegisterSection'

const StyledContainer = styled.div`
  .ant-form-explain {
    font-size: 14px;
  }

  .ant-form-item {
    margin-bottom: 1.25rem;
  }

  @media (min-width: ${BREAK_POINT}px) {
    padding: 1rem;
  }
  user-select: none;
`
export const StyledTitle = styled.h1`
  ${CommonLargeTitleMixin}
  margin-bottom: 1.5rem;
  text-align: center;
`
export const StyledDivider = styled(Divider)`
  && {
    padding: 1rem;

    .ant-divider-inner-text {
      color: #9b9b9b;
      font-size: 12px;
    }
  }
`
export const StyledAction = styled.div`
  color: #9b9b9b;
  font-size: 14px;
  text-align: center;
`

export const AuthModalContext = React.createContext<{
  visible: boolean
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>
  isBusinessMember?: boolean
  setIsBusinessMember?: React.Dispatch<React.SetStateAction<boolean>>
}>({ visible: false, isBusinessMember: false })

type AuthModalProps = {
  defaultAuthState?: AuthState
  noGeneralLogin?: boolean
  onAuthStateChange?: (authState: AuthState) => void
  renderTitle?: () => React.ReactNode
}
const AuthModal: React.FC<AuthModalProps> = ({ defaultAuthState, noGeneralLogin, onAuthStateChange, renderTitle }) => {
  const { renderAuthModal } = useCustomRenderer()
  const { visible, setVisible, isBusinessMember, setIsBusinessMember } = useContext(AuthModalContext)
  const [authState, setAuthState] = useState(defaultAuthState || 'login')

  return (
    renderAuthModal?.(visible) || (
      <Modal
        className="m-sm-5 p-sm-0 pt-4"
        centered
        width={window.innerWidth > BREAK_POINT ? window.innerWidth / 2.5 : window.innerWidth}
        footer={null}
        onCancel={() => {
          setVisible?.(false)
          setIsBusinessMember?.(false)
        }}
        visible={visible}
        maskClosable={!(authState === 'register')}
      >
        <StyledContainer>
          {authState === 'login' ? (
            <LoginSection
              onAuthStateChange={setAuthState}
              noGeneralLogin={noGeneralLogin}
              renderTitle={renderTitle}
              isBusinessMember={isBusinessMember}
            />
          ) : authState === 'register' ? (
            <RegisterSection onAuthStateChange={setAuthState} isBusinessMember={isBusinessMember} />
          ) : null}
        </StyledContainer>
      </Modal>
    )
  )
}

export default AuthModal

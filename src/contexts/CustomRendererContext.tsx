import React, { createContext, useContext } from 'react'
import { RenderMemberAdminMenuProps } from '../components/common/AdminMenu'

export type CustomRendererProps = {
  renderCopyright?: (name?: string) => React.ReactNode
  renderRegisterTerm?: () => React.ReactNode
  renderMemberProfile?: (member: {
    id: string
    name: string
    username: string
    email: string
    pictureUrl: string
  }) => React.ReactNode
  renderFooter?: (props: { DefaultFooter: React.VFC }) => React.ReactElement
  renderAuthButton?: (setAuthModalVisible?: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode
  renderAuthModal?: (visible: boolean) => React.ReactElement
  renderLogout?: (props: {
    logout?: () => void
    DefaultLogout: React.VFC<{ onClick?: React.MouseEventHandler<HTMLDivElement> }>
  }) => React.ReactElement
  renderMemberAdminMenu?: (props: RenderMemberAdminMenuProps) => React.ReactElement
}

const CustomRendererContext = createContext<CustomRendererProps>({})

export const CustomRendererProvider: React.FC<{
  renderer?: CustomRendererProps
}> = ({ renderer = {}, children }) => {
  const { Provider } = CustomRendererContext

  return <Provider value={renderer}>{children}</Provider>
}

export const useCustomRenderer = () => useContext(CustomRendererContext)

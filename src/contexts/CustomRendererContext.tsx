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
  renderAuthButton?: (setAuthModalVisible?: React.Dispatch<React.SetStateAction<boolean>>) => React.ReactNode
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

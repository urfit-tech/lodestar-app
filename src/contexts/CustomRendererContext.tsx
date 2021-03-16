import React, { createContext, useContext } from 'react'

export type CustomRendererProps = {
  renderCopyright?: () => React.ReactNode
}

const CustomRendererContext = createContext<CustomRendererProps>({})

export const CustomRendererProvider: React.FC<{ renderer?: CustomRendererProps }> = ({ renderer = {}, children }) => {
  const { Provider } = CustomRendererContext

  return <Provider value={renderer}>{children}</Provider>
}

export const useCustomRenderer = () => useContext(CustomRendererContext)

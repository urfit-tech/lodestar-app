import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React, { useState } from 'react'
import GlobalSearchInput from '../../common/GlobalSearchInput'
import { SearchBlock } from './DefaultLayout.styled'

const GlobalSearchModal: React.FC = () => {
  const { enabledModules } = useApp()
  const [isOpen, setIsModalOpen] = useState(true)

  return (
    <CommonModal title="" isOpen={isOpen} onClose={() => {}}>
      <></>
      <SearchBlock>
        <GlobalSearchInput />
      </SearchBlock>
    </CommonModal>
  )
}

export default GlobalSearchModal

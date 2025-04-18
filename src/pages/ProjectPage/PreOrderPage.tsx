import React from 'react'
import { useIntl } from 'react-intl'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { ProjectProps } from '../../types/project'
import ProjectPageMessages from './translation'

const PreOrderPage: React.FC<ProjectProps> = () => {
  const { formatMessage } = useIntl()
  return (
    <DefaultLayout white noFooter>
      {formatMessage(ProjectPageMessages.PreOrderPage.defaultPreOrderContent)}
    </DefaultLayout>
  )
}

export default PreOrderPage

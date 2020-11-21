import React from 'react'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { ProjectProps } from '../../types/project'

const PreOrderPage: React.FC<ProjectProps> = () => {
  return (
    <DefaultLayout white noFooter>
      Default Pre Order Content
    </DefaultLayout>
  )
}

export default PreOrderPage

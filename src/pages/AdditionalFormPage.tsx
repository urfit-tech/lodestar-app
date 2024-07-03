import { Box } from '@chakra-ui/react'
import { BooleanParam, useQueryParams } from 'use-query-params'
import AdditionalForm from '../components/additionalForm/AdditionalForm'
import DefaultLayout from '../components/layout/DefaultLayout'

const AdditionalFormPage: React.FC = () => {
  const [{ noHeader, noFooter }] = useQueryParams({
    noHeader: BooleanParam,
    noFooter: BooleanParam,
  })

  return (
    <DefaultLayout noFooter={noFooter} noHeader={noHeader}>
      <Box display="flex" justifyContent="center" justifyItems="center">
        <Box width={{ base: '100%', md: '50%' }} backgroundColor="white" marginY={{ base: '0', md: '30px' }}>
          <AdditionalForm />
        </Box>
      </Box>
    </DefaultLayout>
  )
}

export default AdditionalFormPage

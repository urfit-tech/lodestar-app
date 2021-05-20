import { Button } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'

const ForbiddenPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const history = useHistory()

  return (
    <DefaultLayout>
      <div className="vw-100 pt-5 text-center">
        <div className="mb-3">{formatMessage(commonMessages.content.noAuthority)}</div>
        <Button variant="outline" className="mr-2" onClick={() => history.goBack()}>
          {formatMessage(commonMessages.button.previousPage)}
        </Button>
        <Button colorScheme="primary" onClick={() => history.push('/')}>
          {formatMessage(commonMessages.button.home)}
        </Button>
      </div>
    </DefaultLayout>
  )
}

export default ForbiddenPage

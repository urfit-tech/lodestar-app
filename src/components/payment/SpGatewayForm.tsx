import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

type SpGatewayFormProps = {
  formHtml?: string
  clientBackUrl: string
}
const SpGatewayForm: React.FC<SpGatewayFormProps> = ({ formHtml, clientBackUrl }) => {
  const history = useHistory()
  useEffect(() => {
    formHtml ? document.write(formHtml) : history.push(clientBackUrl)
  }, [history, clientBackUrl, formHtml])
  return <div>導向藍新...</div>
}

export default SpGatewayForm

import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

type GatewayFormProps = {
  formHtml?: string
  clientBackUrl: string
}
const GatewayForm: React.FC<GatewayFormProps> = ({ formHtml, clientBackUrl }) => {
  const history = useHistory()
  useEffect(() => {
    formHtml ? document.write(formHtml) : history.push(clientBackUrl)
  }, [history, clientBackUrl, formHtml])
  return <div>導向付款...</div>
}

export default GatewayForm

import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { commonMessages } from '../helpers/translation'

const StyledContainer = styled.div`
  padding: 4rem 1rem;
  color: #585858;
  text-align: center;
`
const ResetPasswordSuccessPage = () => {
  const { formatMessage } = useIntl()
  return (
    <DefaultLayout noFooter centeredBox>
      <StyledContainer>
        <p>{formatMessage(commonMessages.content.resetPassword)}</p>
        <div>
          <Link to="/">{formatMessage(commonMessages.button.home)}</Link>
        </div>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default ResetPasswordSuccessPage

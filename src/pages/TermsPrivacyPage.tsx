import { Card, Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { termPrivacyMessages } from './translation'

const StyledTitle = styled(Typography.Title)`
  && {
    margin-bottom: 36px;
    font-size: 24px;
    font-weight: bold;
    line-height: 1.3;
    letter-spacing: 0.77px;
  }
`
const StyledSubTitle = styled(Typography.Title)`
  && {
    margin-top: 41px;
    margin-bottom: 13px;
    font-size: 20px;
    font-weight: bold;
  }
`
const StyledCard = styled(Card)`
  && {
    margin-bottom: 20px;
  }

  .ant-card-body {
    padding: 40px;
  }

  p,
  li {
    margin-bottom: 0;
    line-height: 1.69;
    letter-spacing: 0.2px;
  }

  ol {
    padding-left: 50px;
    li {
      padding-left: 16px;
    }
  }
`
const StyledSection = styled.section`
  background: #f7f8f8;
  padding-top: 56px;
  padding-bottom: 80px;
  text-align: justify;

  & > ${StyledTitle} {
    text-align: center;
  }
`

const TermsPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { name, settings } = useApp()
  const appName = settings['name'] || name

  return (
    <DefaultLayout>
      <StyledSection>
        <StyledTitle level={1}>{formatMessage(termPrivacyMessages.Defaults.term)}</StyledTitle>

        <div className="container">
          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termPrivacyMessages.TermPrivacyTitlePage.title)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item1)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item1, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item2)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item2, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item3)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item3, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item4)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item4, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item5)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item5, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item6)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item6, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item7)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item7, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item8)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item8, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termPrivacyMessages.TermPrivacyClausePage.item9)}</StyledSubTitle>
            <p>{formatMessage(termPrivacyMessages.TermPrivacyParagraphPage.item9, { name: appName })}</p>
          </StyledCard>
        </div>
      </StyledSection>
    </DefaultLayout>
  )
}

export default TermsPage

import { Card, Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { termMessages, termsPrivacy, termsPrivacyMessages } from '../helpers/translation'

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
        <StyledTitle level={1}>{formatMessage(termMessages.defaults.term)}</StyledTitle>

        <div className="container">
          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termsPrivacy.title.termsPrivacy)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.one)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.one, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.two)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.two, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.three)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.three, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.four)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.four, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.five)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.five, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.six)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.six, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.seven)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.seven, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.eight)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.eight, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termsPrivacy.clause.nine)}</StyledSubTitle>
            <p>{formatMessage(termsPrivacyMessages.paragraph.nine, { name: appName })}</p>
          </StyledCard>
        </div>
      </StyledSection>
    </DefaultLayout>
  )
}

export default TermsPage

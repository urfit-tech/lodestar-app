import { Card, Typography } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import DefaultLayout from '../components/layout/DefaultLayout'
import { termMessages } from '../helpers/translation'

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

const TermsPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { name, settings } = useApp()
  const appName = settings['name'] || name

  return (
    <DefaultLayout>
      <StyledSection>
        <StyledTitle level={1}>{formatMessage(termMessages.defaults.term)}</StyledTitle>

        <div className="container">
          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.term)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.scope)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.scope, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.personalData)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.personalData, { name: appName })}</p>
            <p>{formatMessage(termMessages.paragraph.personalData2)}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.link, { name: appName })}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.link, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.policy)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.policy, { name: appName })}</p>
            <p>{formatMessage(termMessages.paragraph.policy2, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.personalInfo)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.personalInfo, { name: appName })}</p>
            <p>{formatMessage(termMessages.paragraph.personalInfo2, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.cookie)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.cookie, { name: appName })}</p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.terms)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.terms)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.terms, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.confidentiality)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.confidentiality, { name: appName })}</p>
            <p>{formatMessage(termMessages.paragraph.confidentiality2, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.condition)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.condition, { name: appName })}</p>
            <ol className="mt-4">
              <li>{formatMessage(termMessages.list.item1, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item2, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item3, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item4, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item5, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item6, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item7, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item8, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item9, { name: appName })}</li>
              <li>{formatMessage(termMessages.list.item10, { name: appName })}</li>
            </ol>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.suspension)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.suspension)}</p>
            <p>{formatMessage(termMessages.paragraph.suspension2, { name: appName })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.userResponsibility)}</StyledSubTitle>
            <ol className="mt-4">
              <li>{formatMessage(termMessages.list.userResponsibility1)}</li>
              <li>
                {formatMessage(termMessages.list.userResponsibility2, { name: appName })}
                <ol>
                  <li>{formatMessage(termMessages.list.userResponsibility21)}</li>
                  <li>{formatMessage(termMessages.list.userResponsibility22)}</li>
                  <li>{formatMessage(termMessages.list.userResponsibility23, { name: appName })}</li>
                  <li>{formatMessage(termMessages.list.userResponsibility24, { name: appName })}</li>
                  <li>{formatMessage(termMessages.list.userResponsibility25, { name: appName })}</li>
                </ol>
              </li>
              <li>{formatMessage(termMessages.list.userResponsibility3, { name: appName })}</li>
            </ol>

            <StyledSubTitle level={3}>{formatMessage(termMessages.title.report)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.report, { name: appName })}</p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.refund)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.refundPolicy)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.refund1)}</p>
            <p>{formatMessage(termMessages.paragraph.refund2)}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.refundMethod)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.refund3)}</p>
            <p>{formatMessage(termMessages.paragraph.refund4)}</p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.purchaseNotice)}</StyledTitle>
            <p>{formatMessage(termMessages.paragraph.purchaseNotice1)}</p>
            <p>{formatMessage(termMessages.paragraph.purchaseNotice2)}</p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.facebookDataDeletion)}</StyledTitle>
            <p>{formatMessage(termMessages.paragraph.facebookDataDeletion)}</p>
            <p>
              <ol>
                <li>{formatMessage(termMessages.list.facebookDataDeletionStep1)}</li>
                <li>{formatMessage(termMessages.list.facebookDataDeletionStep2)}</li>
                <li>{formatMessage(termMessages.list.facebookDataDeletionStep3, { name: appName })}</li>
                <li>{formatMessage(termMessages.list.facebookDataDeletionStep4)}</li>
              </ol>
            </p>
          </StyledCard>
        </div>
      </StyledSection>
    </DefaultLayout>
  )
}

export default TermsPage

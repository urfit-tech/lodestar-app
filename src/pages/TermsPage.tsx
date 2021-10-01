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

const TermsPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { name } = useApp()

  return (
    <DefaultLayout>
      <StyledSection>
        <StyledTitle level={1}>{formatMessage(termMessages.defaults.term)}</StyledTitle>

        <div className="container">
          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.term)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.scope)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.scope, { name })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.personalData)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.personalData, { name })}</p>
            <p>{formatMessage(termMessages.paragraph.personalData2)}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.link, { name })}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.link, { name })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.policy)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.policy, { name })}</p>
            <p>{formatMessage(termMessages.paragraph.policy2, { name })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.cookie)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.cookie, { name })}</p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>{formatMessage(termMessages.title.terms)}</StyledTitle>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.terms)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.terms, { name })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.confidentiality)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.confidentiality, { name })}</p>
            <p>{formatMessage(termMessages.paragraph.confidentiality2, { name })}</p>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.condition)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.condition, { name })}</p>
            <ol className="mt-4">
              <li>{formatMessage(termMessages.list.item1, { name })}</li>
              <li>{formatMessage(termMessages.list.item2, { name })}</li>
              <li>{formatMessage(termMessages.list.item3, { name })}</li>
              <li>{formatMessage(termMessages.list.item4, { name })}</li>
              <li>{formatMessage(termMessages.list.item5, { name })}</li>
              <li>{formatMessage(termMessages.list.item6, { name })}</li>
              <li>{formatMessage(termMessages.list.item7, { name })}</li>
              <li>{formatMessage(termMessages.list.item8, { name })}</li>
              <li>{formatMessage(termMessages.list.item9, { name })}</li>
              <li>{formatMessage(termMessages.list.item10, { name })}</li>
            </ol>

            <StyledSubTitle level={3}>{formatMessage(termMessages.subtitle.suspension)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.suspension)}</p>
            <p>{formatMessage(termMessages.paragraph.suspension2, { name })}</p>

            <StyledSubTitle level={3}>用戶責任</StyledSubTitle>
            <ol className="mt-4">
              <li>用戶應自行承擔責任使用本服務，對於在本服務所從事的所有行為及其結果應自行負擔一切責任。</li>
              <li>
                若用戶發生或可能發生下列情事，{name}不須事先告知用戶，即可中止該用戶使用本服務之全部或一部，停用或刪除
                {name}帳戶、取消用戶與{name}之間關於本服務的合約（包括但不限於依據本條款成立的合約，以下皆同），或採取
                {name}合理認為必要及適當的任何其他措施：
                <ol>
                  <li>用戶違反相關法令、本條款、或任何個別條款；</li>
                  <li>用戶為反社會勢力或相關黨派成員；</li>
                  <li>用戶透過散播不實資訊，例如利用詐欺方式或勢力，或透過其他不法方破壞{name}的信譽；</li>
                  <li>
                    用戶遭聲請被扣押、假扣押、拍賣、進入破產、民事重整或類似程序，或{name}
                    合理認為用戶的信用有不確定性；或
                  </li>
                  <li>
                    用戶與{name}之間的信任關係已不存在，或因上列第(1)款至第(4)款以外事由，使{name}合理認為{name}
                    不再適合向用戶提供本服務。
                  </li>
                </ol>
              </li>
              <li>
                起因於用戶使用本服務（包括但不限於{name}遭第三人對於用戶使用本服務提出損害賠償請求），致{name}
                直接或間接蒙受任何損失/損害（包括但不限於律師費用的負擔）時，用戶應依照{name}的要求立即給予補償賠償。
              </li>
            </ol>

            <StyledSubTitle level={3}>{formatMessage(termMessages.title.report)}</StyledSubTitle>
            <p>{formatMessage(termMessages.paragraph.report, { name })}</p>
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
            <StyledTitle level={2}>購買須知</StyledTitle>
            <p>
              民法規定之無行為能力人（如未滿七歲之未成年人）購買本課程，應由其法定代理人為之；限制行為能力人（滿七歲但未滿二十歲），應得法定代理人之同意，方能購買本課程。
            </p>
            <p>
              一旦註冊及代表「同意購買須知」，即表示您已經同意並願意完全遵守本購買須知所有內容；且若為民法規定之無行為能力人、限制行為能力人，則視為由無行為能力人之法定代理人代為購買本課程，或限制行為能力人之法定代理人已同意購買本課程。
            </p>
          </StyledCard>

          <StyledCard>
            <StyledTitle level={2}>Facebook 資料刪除指示</StyledTitle>
            <p>
              根據 Facebook 政策，我們必須提供「Facebook 資料刪除指示說明」，如果您想刪除此平台上的 Facebook
              登入應用數據，您可以按照以下步驟進行：
            </p>
            <p>
              <ol>
                <li>進入您的 Facebook 帳號的「設定和隱私」選單並點擊「設定」</li>
                <li>向下滾動並點擊「應用程式和網站」</li>
                <li>找到並點擊此應用程式（{name}）</li>
                <li>點擊「移除」按鈕，即成功地刪除了您的應用程式活動。</li>
              </ol>
            </p>
          </StyledCard>
        </div>
      </StyledSection>
    </DefaultLayout>
  )
}

export default TermsPage

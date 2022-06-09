import { Skeleton, Tabs } from 'antd'
import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { defineMessages, useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseBlock from '../components/merchandise/MerchandiseBlock'
import { useMerchandise } from '../hooks/merchandise'

const messages = defineMessages({
  overview: { id: 'product.merchandise.tab.overview', defaultMessage: '商品概述' },
  qa: { id: 'product.merchandise.tab.qa', defaultMessage: '問與答' },
})

const StyledContainer = styled.div`
  max-width: 960px;
`

const MerchandisePage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { merchandiseId } = useParams<{ merchandiseId: string }>()
  const { merchandise } = useMerchandise(merchandiseId)

  useEffect(() => {
    if (merchandise) {
      let index = 1
      for (let spec of merchandise.specs) {
        ReactGA.plugin.execute('ec', 'addImpression', {
          id: spec.id,
          name: `${merchandise.title} - ${spec.title}`,
          category: 'MerchandiseSpec',
          price: `${spec.listPrice}`,
          position: index,
        })
        index += 1
        if (index % 20 === 0) ReactGA.ga('send', 'pageview')
      }
      ReactGA.ga('send', 'pageview')
    }
  }, [merchandise])

  return (
    <DefaultLayout white>
      <StyledContainer className="container">
        <div className="my-4">{merchandise && <MerchandiseBlock merchandise={merchandise} withPaymentButton />}</div>

        <Tabs defaultActiveKey="overview" className="mb-5">
          <Tabs.TabPane tab={formatMessage(messages.overview)} key="overview" className="my-3">
            {merchandise ? <BraftContent>{merchandise.description}</BraftContent> : <Skeleton />}
          </Tabs.TabPane>
        </Tabs>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default MerchandisePage

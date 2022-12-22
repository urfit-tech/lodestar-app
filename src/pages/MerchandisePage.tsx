import { Skeleton, Tabs } from 'antd'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import React, { useEffect } from 'react'
import ReactGA from 'react-ga'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import PageHelmet from '../components/common/PageHelmet'
import DefaultLayout from '../components/layout/DefaultLayout'
import MerchandiseBlock from '../components/merchandise/MerchandiseBlock'
import { useMerchandise } from '../hooks/merchandise'
import pageMessages from './translation'

const StyledContainer = styled.div`
  max-width: 960px;
`

const MerchandisePage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { merchandiseId } = useParams<{ merchandiseId: string }>()
  const { merchandise } = useMerchandise(merchandiseId)
  const { id: appId, loading: loadingApp } = useApp()
  const { resourceCollection } = useResourceCollection([`${appId}:merchandise:${merchandiseId}`], true)

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
      {resourceCollection[0] && <Tracking.Detail resource={resourceCollection[0]} />}
      {/* // TODO: need to extend page helmet */}
      {!loadingApp && <PageHelmet title={merchandise?.title} />}
      <StyledContainer className="container">
        <div className="my-4">{merchandise && <MerchandiseBlock merchandise={merchandise} withPaymentButton />}</div>

        <Tabs defaultActiveKey="overview" className="mb-5">
          <Tabs.TabPane tab={formatMessage(pageMessages.MerchandisePageTabs.overview)} key="overview" className="my-3">
            {merchandise ? <BraftContent>{merchandise.description}</BraftContent> : <Skeleton />}
          </Tabs.TabPane>
        </Tabs>
      </StyledContainer>
    </DefaultLayout>
  )
}

export default MerchandisePage

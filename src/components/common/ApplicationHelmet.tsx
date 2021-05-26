import React from 'react'
import { Helmet } from 'react-helmet'
import { Organization, WithContext } from 'schema-dts'
import { useApp } from '../../containers/common/AppContext'
import { useGA, useGTM, useHotjar, usePixel } from '../../hooks/util'

const ApplicationHelmet: React.VFC = () => {
  const { settings, id: appId } = useApp()
  const linkedJson: WithContext<Organization> | null = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings['seo.name'],
    logo: settings['seo.logo'],
    url: settings['seo.url'],
  }

  useGA()
  usePixel()
  useHotjar()
  useGTM()

  return (
    <Helmet>
      <link rel="shortcut icon" href={settings['favicon']} />
      <title>{settings['title'] || appId}</title>
      <meta name="description" content={settings['description'] || appId} />

      {/* open graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={settings['open_graph.title']} />
      <meta property="og:url" content={settings['open_graph.url']} />
      <meta property="og:image" content={settings['open_graph.image']} />
      <meta property="og:description" content={settings['open_graph.description']} />

      {/* JSON LD */}
      {!!linkedJson && <script type="application/ld+json">{JSON.stringify(linkedJson)}</script>}
    </Helmet>
  )
}

export default ApplicationHelmet

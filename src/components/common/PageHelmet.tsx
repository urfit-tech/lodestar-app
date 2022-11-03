import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Thing, WithContext } from 'schema-dts'
import xss from 'xss'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getOgLocale } from '../../helpers'

const PageHelmet: React.FC<
  Partial<{
    title: string
    description: string
    keywords: string[]
    jsonLd: WithContext<Thing>[]
    openGraph: { property: string; content: string }[]
    onLoaded: () => void
  }>
> = props => {
  const app = useApp()
  const { defaultLocale } = useContext(LocaleContext)
  const ogLocale = getOgLocale(defaultLocale)

  const openGraph = props.openGraph || [
    { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:title', content: app.settings['open_graph.title'] || app.settings['title'] },
    { property: 'og:description', content: app.settings['open_graph.description'] || app.settings['description'] },
    { property: 'og:image', content: app.settings['open_graph.image'] || app.settings['logo'] },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: ogLocale },
  ]

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: 'titleChange', title: props.title || app.settings['title'] })
  }, [app.settings, props.title])

  return (
    <Helmet onChangeClientState={() => props.onLoaded?.()}>
      <title>{xss(props.title || app.settings['title'])}</title>
      <meta
        key="description"
        name="description"
        content={xss(getBraftContent(props.description || '{}').slice(0, 150) || app.settings['description']) || ''}
      />
      <meta key="keywords" name="keywords" content={xss(props.keywords?.join() || app.settings['keywords'])} />
      {props.jsonLd && <script type="application/ld+json">{xss(JSON.stringify(props.jsonLd))}</script>}
      {openGraph.map(({ property, content }, index) => (
        <meta key={index} property={property} content={xss(content)} />
      ))}
      {props.children}
    </Helmet>
  )
}

export default PageHelmet

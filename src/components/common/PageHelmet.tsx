import { keyBy, merge, values } from 'lodash'
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
    appTitleConcat: boolean
    description: string
    keywords: string[]
    keywordsConcat: boolean
    jsonLd: WithContext<Thing>[]
    isNoIndex: boolean
    openGraph: { property: string; content: string }[]
    openGraphConcat: boolean
    onLoaded: () => void
  }>
> = props => {
  const app = useApp()
  const { defaultLocale } = useContext(LocaleContext)
  const appTitleConcat = props.appTitleConcat || app.settings['title_concat'] || false
  const keywordsConcat = props.keywordsConcat || app.settings['keywords_concat'] || false
  const openGraphConcat = props.openGraphConcat || app.settings['open_graph.concat'] || false

  const title = props.title
    ? `${props.title}${appTitleConcat ? ` | ${app.settings['title']}` : ''}`
    : app.settings['title']
  const keywords = props.keywords
    ? `${props.keywords}${keywordsConcat ? `,${app.settings['keywords']}` : ''}`
    : app.settings['keywords']

  const prefetchingList = [
    'https://cdnjs.cloudflare.com',
    'https://fonts.googleapis.com',
    `https://${window.location.host}/api/v1/`,
    `https://${window.location.host}/api/v2/`,
    `https://${window.location.host}/api/v2/`,
    `https://${window.location.host}/api/enterprise`,
    process.env.REACT_APP_S3_BUCKET,
    process.env.REACT_APP_GRAPHQL_PH_ENDPOINT,
    process.env.REACT_APP_GRAPHQL_RH_ENDPOINT,
  ]

  const defaultOpenGraph = [
    { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
    { property: 'og:site_name', content: app.settings['name'] },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:title', content: app.settings['open_graph.title'] || title },
    { property: 'og:description', content: app.settings['open_graph.description'] || app.settings['description'] },
    { property: 'og:locale', content: getOgLocale(defaultLocale) },
    { property: 'og:image', content: app.settings['open_graph.image'] || app.settings['logo'] },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
  ]
  const openGraph = props.openGraph
    ? openGraphConcat
      ? values(merge(keyBy(defaultOpenGraph, 'property'), keyBy(props.openGraph, 'property')))
      : props.openGraph
    : defaultOpenGraph

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: 'titleChange', title })
  }, [title])

  return (
    <Helmet onChangeClientState={() => props.onLoaded?.()}>
      <title>{xss(title)}</title>
      <meta
        key="description"
        name="description"
        content={xss(getBraftContent(props.description || '{}').slice(0, 150) || app.settings['description']) || ''}
      />
      <meta key="keywords" name="keywords" content={xss(keywords)} />
      <meta http-equiv="x-dns-prefetch-control" content="on" />
      {prefetchingList.map(url => (
        <link rel="dns-prefetch" href={url} />
      ))}
      {props.jsonLd && <script type="application/ld+json">{xss(JSON.stringify(props.jsonLd))}</script>}
      {props.isNoIndex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {openGraph.map(({ property, content }, index) => (
        <meta key={index} property={property} content={xss(content)} />
      ))}
      {app.settings['google-site-verification'] && (
        <meta name="google-site-verification" content={xss(app.settings['google-site-verification'])} />
      )}
      {props.children}
    </Helmet>
  )
}

export default PageHelmet

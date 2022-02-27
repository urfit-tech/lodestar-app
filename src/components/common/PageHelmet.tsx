import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { Helmet } from 'react-helmet'
import { Thing, WithContext } from 'schema-dts'
import xss from 'xss'

const PageHelmet: React.VFC<
  Partial<{
    title: string
    description: string
    keywords: string[]
    jsonLd: WithContext<Thing>[]
    openGraph: { property: string; content: string }[]
  }>
> = props => {
  const app = useApp()
  const openGraph = props.openGraph || [
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    { property: 'og:title', content: app.settings['open_graph.title'] },
    { property: 'og:description', content: app.settings['open_graph.description'] },
    { property: 'og:image', content: app.settings['open_graph.image'] },
  ]
  return (
    <Helmet>
      <title>{xss(props.title || app.settings['title'])}</title>
      <meta key="description" name="description" content={xss(props.description || app.settings['description'])} />
      <meta key="keywords" name="keywords" content={xss(props.keywords?.join() || app.settings['keywords'])} />
      {props.jsonLd && <script type="application/ld+json">{xss(JSON.stringify(props.jsonLd))}</script>}
      {openGraph.map(({ property, content }, index) => (
        <meta key={index} property={property} content={xss(content)} />
      ))}
    </Helmet>
  )
}

export default PageHelmet

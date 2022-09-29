import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Thing, WithContext } from 'schema-dts'
import xss from 'xss'
import { getBraftContent } from '../../helpers'
import { MetaTag } from '../../types/metaTag'

const PageHelmet: React.FC<
  Partial<{
    title: string
    description: string
    keywords: string[]
    jsonLd: WithContext<Thing>[]
    openGraph: { property: string; content: string }[]
    pageCraftData: { [key: string]: any } | null
    pageMetaTags?: MetaTag | null
    onLoaded: () => void
  }>
> = props => {
  const app = useApp()
  const { defaultOgImg, defaultOgDescription } = usePageDefaultMetaValues(props.pageCraftData)

  const openGraph = props.openGraph || [
    { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    {
      property: 'og:title',
      content:
        props.pageMetaTags?.openGraph?.title ||
        props.title ||
        app.settings['open_graph.title'] ||
        app.settings['title'],
    },
    {
      property: 'og:description',
      content:
        props.pageMetaTags?.openGraph?.description ||
        defaultOgDescription ||
        app.settings['open_graph.description'] ||
        app.settings['description'],
    },
    {
      property: 'og:image',
      content:
        props.pageMetaTags?.openGraph?.image ||
        defaultOgImg ||
        app.settings['open_graph.image'] ||
        app.settings['logo'],
    },
    { property: 'og:imageAlt', content: props.pageMetaTags?.openGraph?.imageAlt || '' },
  ]

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: 'titleChange', title: props.title || app.settings['title'] })
  }, [props.title])

  return (
    <Helmet onChangeClientState={() => props.onLoaded?.()}>
      <title>{xss(props.pageMetaTags?.seo?.pageTitle || props.title || app.settings['title'])}</title>
      <meta
        key="description"
        name="description"
        content={
          xss(props.pageMetaTags?.seo?.description || '') ||
          xss(getBraftContent(props.description || '{}').slice(0, 150) || app.settings['description'])
        }
      />
      <meta
        key="keywords"
        name="keywords"
        content={xss(props.pageMetaTags?.seo?.keywords || props.keywords?.join() || app.settings['keywords'])}
      />
      {props.jsonLd && <script type="application/ld+json">{xss(JSON.stringify(props.jsonLd))}</script>}
      {openGraph.map(({ property, content }, index) => (
        <meta key={index} property={property} content={xss(content)} />
      ))}
      {props.children}
    </Helmet>
  )
}

export default PageHelmet

const usePageDefaultMetaValues = (craftData?: { [key: string]: any } | null) => {
  let defaultOgImg = ''
  let defaultOgDescription = ''
  if (craftData) {
    craftData?.ROOT?.nodes?.forEach((node: string) => {
      if (!defaultOgImg && craftData && craftData[node].type.resolvedName === 'CraftImage') {
        defaultOgImg = craftData[node].props.customStyle.backgroundImage.match(/\(([^)]+)\)/, '')[1]
      }
      if (!defaultOgDescription && craftData && craftData[node].type.resolvedName === 'CraftParagraph') {
        defaultOgDescription = craftData[node].props.content.substr(0, 150)
      }
    })
  }
  return { defaultOgImg: defaultOgImg, defaultOgDescription: defaultOgDescription }
}

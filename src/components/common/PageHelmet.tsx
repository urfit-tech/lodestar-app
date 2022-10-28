import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Thing, WithContext } from 'schema-dts'
import xss from 'xss'
import { getBraftContent } from '../../helpers'
import { MetaTag } from '../../types/general'

const PageHelmet: React.FC<
  Partial<{
    title: string
    description: string
    keywords: string[]
    jsonLd: WithContext<Thing>[]
    openGraph: { property: string; content: string }[]
    pageCraftData: { [key: string]: any } | null
    pageMetaTag?: MetaTag | null
    onLoaded: () => void
  }>
> = props => {
  const app = useApp()
  const { defaultImg, defaultDescription } = usePageDefaultMetaValues(props.pageCraftData)

  const openGraph = props.openGraph || [
    { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: window.location.href },
    {
      property: 'og:title',
      content:
        props.pageMetaTag?.openGraph?.title || props.title || app.settings['open_graph.title'] || app.settings['title'],
    },
    {
      property: 'og:description',
      content:
        props.pageMetaTag?.openGraph?.description ||
        defaultDescription ||
        app.settings['open_graph.description'] ||
        app.settings['description'],
    },
    {
      property: 'og:image',
      content:
        props.pageMetaTag?.openGraph?.image || defaultImg || app.settings['open_graph.image'] || app.settings['logo'],
    },
    { property: 'og:image:alt', content: props.pageMetaTag?.openGraph?.imageAlt || '' },
  ]

  useEffect(() => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ event: 'titleChange', title: props.title || app.settings['title'] })
  }, [props.title])

  return (
    <Helmet onChangeClientState={() => props.onLoaded?.()}>
      <title>{xss(props.pageMetaTag?.seo?.pageTitle || props.title || app.settings['title'])}</title>
      <meta
        key="description"
        name="description"
        content={
          xss(props.pageMetaTag?.seo?.description || '') ||
          xss(defaultDescription) ||
          xss(getBraftContent(props.description || '{}')?.slice(0, 150) || app.settings['description'])
        }
      />
      <meta
        key="keywords"
        name="keywords"
        content={xss(props.pageMetaTag?.seo?.keywords || props.keywords?.join() || app.settings['keywords'])}
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
  let defaultImg = ''
  let defaultDescription = ''
  if (craftData) {
    craftData?.ROOT?.nodes?.forEach((node: string) => {
      if (!defaultImg && craftData && craftData[node].type.resolvedName === 'CraftImage') {
        defaultImg = craftData[node]?.props?.customStyle?.backgroundImage?.match(/\(([^)]+)\)/, '')[1]
      }
      if (!defaultDescription && craftData && craftData[node].type.resolvedName === 'CraftParagraph') {
        defaultDescription = craftData[node]?.props?.content?.substr(0, 150)
      }
    })
  }
  return { defaultImg: defaultImg, defaultDescription: defaultDescription }
}

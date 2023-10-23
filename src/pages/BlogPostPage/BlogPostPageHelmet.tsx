import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useContext } from 'react'
import PageHelmet from '../../components/common/PageHelmet'
import LocaleContext from '../../contexts/LocaleContext'
import { getBraftContent, getInfinityDate, getOgLocale, notEmpty } from '../../helpers'
import { Post } from '../../types/blog'

const BlogPostPageHelmet: React.VFC<{ post: Post }> = ({ post }) => {
  const app = useApp()
  const { defaultLocale } = useContext(LocaleContext)
  const ogLocale = getOgLocale(defaultLocale)

  return (
    <PageHelmet
      title={post.metaTag?.seo?.pageTitle || post.title}
      description={post.metaTag?.seo?.description || post.description || post.abstract || ''}
      keywords={post.metaTag?.seo?.keywords?.split(',') || post.tags}
      isNoIndex={!post.publishedAt}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: post.title,
          image: post.coverUrl || app.settings['logo'],
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          author: [
            {
              '@type': 'Person',
              name: post.author.name,
              url: window.location.origin + `/members/${post.author.id}`,
            },
          ],
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:site_name', content: app.settings['name'] },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: post.metaTag?.openGraph?.title || post.title || app.settings['title'] },
        {
          property: 'og:description',
          content: getBraftContent(
            post.metaTag?.openGraph?.description ||
              post.description ||
              post.abstract ||
              app.settings['open_graph.description'] ||
              app.settings['description'] ||
              '{}',
          )?.slice(0, 150),
        },
        { property: 'og:locale', content: ogLocale },
        {
          property: 'og:image',
          content:
            post.metaTag?.openGraph?.image || post.coverUrl || app.settings['open_graph.image'] || app.settings['logo'],
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: post.metaTag?.openGraph?.imageAlt || '' },
        { property: 'article:published_time', content: post.publishedAt?.toISOString() || '' },
        { property: 'article:modified_time', content: post.updatedAt.toISOString() },
        { property: 'article:expiration_time', content: getInfinityDate().toISOString() },
        {
          property: 'article:section',
          content: post.categories
            .map(category => category?.name)
            .filter(notEmpty)
            .join('|'),
        },
        ...post.tags.map(tag => ({ property: 'article:tag', content: tag })),
      ]}
    >
      <link rel="canonical" href={window.location.origin + `/posts/${post.id}`} />
    </PageHelmet>
  )
}

export default BlogPostPageHelmet

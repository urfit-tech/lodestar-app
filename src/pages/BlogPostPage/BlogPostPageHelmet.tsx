import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import PageHelmet from '../../components/common/PageHelmet'
import { getBraftContent, getInfinityDate, notEmpty } from '../../helpers'
import { Post } from '../../types/blog'

const BlogPostPageHelmet: React.VFC<{ post: Post }> = ({ post }) => {
  const app = useApp()
  const nameSlices = post.author.name.split(' ')
  const lastName = nameSlices.pop() || ''
  const firstName = nameSlices.join(' ') || ''

  return (
    <PageHelmet
      title={post.metaTags.seo?.pageTitle || post.title}
      description={
        post.metaTags.openGraph?.description?.slice(0, 150) ||
        getBraftContent(post.description || '').slice(0, 150) ||
        post.abstract?.slice(0, 150) ||
        app.settings['description']
      }
      keywords={post.metaTags.seo?.keywords?.split(',') || post.tags}
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
        { property: 'og:type', content: 'article' },
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
        { property: 'profile:first_name', content: firstName },
        { property: 'profile:last_name', content: lastName },
        { property: 'profile:username', content: post.author.username },
        ...post.tags.map(tag => ({ property: 'article:tag', content: tag })),
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: post.metaTags.openGraph?.title || post.title || app.settings['title'] },
        {
          property: 'og:description',
          content:
            post.metaTags.openGraph?.description?.slice(0, 150) ||
            getBraftContent(post.description || '').slice(0, 150) ||
            post.abstract?.slice(0, 150) ||
            app.settings['description'],
        },
        {
          property: 'og:image',
          content: post.metaTags.openGraph?.image || post.coverUrl || app.settings['open_graph.image'],
        },
        { property: 'og:image:alt', content: post.metaTags.openGraph?.imageAlt || '' },
      ]}
    >
      <link rel="canonical" href={window.location.origin + `/posts/${post.id}`} />
    </PageHelmet>
  )
}

export default BlogPostPageHelmet

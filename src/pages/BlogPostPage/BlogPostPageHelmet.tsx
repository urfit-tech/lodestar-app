import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import PageHelmet from '../../components/common/PageHelmet'
import { Post } from '../../types/blog'

const BlogPostPageHelmet: React.VFC<{ post: Post }> = ({ post }) => {
  const app = useApp()
  const nameSlices = post.author.name.split(' ')
  const lastName = nameSlices.pop() || ''
  const firstName = nameSlices.join(' ') || ''

  return (
    <PageHelmet
      title={post.title}
      description={post.abstract || app.settings['description']}
      keywords={post.tags}
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
        { property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: post.publishedAt?.toISOString() || '' },
        { property: 'article:modified_time', content: post.updatedAt.toISOString() },
        // TODO: add article expiration time
        // { property: 'article:expiration_time', content: '' },
        // TODO: add main section
        // { property: 'article:section', content: '' },
        { property: 'profile:first_name', content: firstName },
        { property: 'profile:last_name', content: lastName },
        { property: 'profile:username', content: post.author.username },
        ...post.tags.map(tag => ({ property: 'article:tag', content: tag })),
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: post.title || app.settings['title'] },
        { property: 'og:description', content: post.abstract || app.settings['description'] },
        { property: 'og:image', content: post.coverUrl || app.settings['open_graph.image'] },
      ]}
    >
      <link rel="canonical" href={window.location.origin + `/posts/${post.id}`} />
    </PageHelmet>
  )
}

export default BlogPostPageHelmet

import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import PageHelmet from '../../components/common/PageHelmet'
import { useNav } from '../../hooks/data'
import { ProjectIntroProps } from '../../types/project'

const ProjectCollectionPageHelmet: React.VFC<{ projects: ProjectIntroProps[] }> = ({ projects }) => {
  const { settings } = useApp()
  const { pageTitle } = useNav()

  const seoMeta:
    | {
        title?: string
        description?: string
        image?: string
      }
    | undefined = JSON.parse(settings['seo.meta'] || '{}')?.ProjectCollectionPage

  const title = seoMeta?.title || pageTitle || settings['title']
  return (
    <PageHelmet
      title={title}
      keywords={projects.map(project => project.title)}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: window.location.origin + `/projects/${project.id}`,
          })),
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: settings['auth.facebook_app_id'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: title },
        { property: 'og:image', content: seoMeta?.image || settings['open_graph.image'] },
        { property: 'og:description', content: seoMeta?.description || settings['open_graph.description'] },
      ]}
    />
  )
}

export default ProjectCollectionPageHelmet

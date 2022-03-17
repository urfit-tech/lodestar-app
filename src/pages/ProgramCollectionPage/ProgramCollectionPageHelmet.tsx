import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import PageHelmet from '../../components/common/PageHelmet'
import { Program } from '../../types/program'

const ProgramCollectionPageHelmet: React.VFC<{ title: string; programs: Pick<Program, 'id' | 'title'>[] }> = ({
  title,
  programs,
}) => {
  const app = useApp()
  return (
    <PageHelmet
      title={title}
      keywords={programs.map(program => program.title)}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: programs.map((program, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: window.location.origin + `/programs/${program.id}`,
          })),
        },
      ]}
      openGraph={[
        { property: 'fb:app_id', content: app.settings['auth.facebook_app_id'] },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: title || app.settings['title'] },
        { property: 'og:image', content: app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ProgramCollectionPageHelmet

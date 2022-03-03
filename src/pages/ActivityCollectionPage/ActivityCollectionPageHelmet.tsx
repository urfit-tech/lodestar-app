import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import PageHelmet from '../../components/common/PageHelmet'
import { Activity } from '../../types/activity'

const ActivityCollectionPageHelmet: React.VFC<{ title: string; activities: Pick<Activity, 'id' | 'title'>[] }> = ({
  title,
  activities,
}) => {
  const app = useApp()
  return (
    <PageHelmet
      title={title}
      keywords={activities.map(activity => activity.title)}
      jsonLd={[
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: activities.map((activity, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: window.location.origin + `/activities/${activity.id}`,
          })),
        },
      ]}
      openGraph={[
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:title', content: title || app.settings['title'] },
        { property: 'og:image', content: app.settings['open_graph.image'] },
      ]}
    />
  )
}

export default ActivityCollectionPageHelmet

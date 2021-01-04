import React from 'react'
import { Helmet } from 'react-helmet'
import DefaultLayout from '../../components/layout/DefaultLayout'
import OnSaleCallToActionSection from '../../components/project/OnSaleCallToActionSection'
import OnSaleCommentSection from '../../components/project/OnSaleCommentSection'
import OnSaleComparisonSection from '../../components/project/OnSaleComparisonSection'
import OnSaleCoverSection from '../../components/project/OnSaleCoverSection'
import OnSaleIntroductionSection from '../../components/project/OnSaleIntroductionSection'
import OnSaleProjectPlanSection from '../../components/project/OnSaleProjectPlanSection'
import OnSaleRoadmapSection from '../../components/project/OnSaleRoadmapSection'
import OnSaleSkillSection from '../../components/project/OnSaleSkillSection'
import OnSaleTrialSection from '../../components/project/OnSaleTrialSection'
import { useApp } from '../../containers/common/AppContext'
import EmptyCover from '../../images/empty-cover.png'
import { ProjectProps } from '../../types/project'

const OnSalePage: React.FC<ProjectProps> = ({
  id,
  expiredAt,
  coverType,
  coverUrl,
  title,
  abstract,
  description,
  introduction,
  contents,
  updates,
  comments,
  projectPlans,
}) => {
  const { settings } = useApp()

  let seoMeta: { title?: string; description?: string } | undefined
  try {
    seoMeta = JSON.parse(settings['seo.meta']).ProjectPage[`${id}`]
  } catch (error) {}

  const siteTitle = seoMeta?.title || title
  const siteDescription = seoMeta?.description || description

  const ldData = JSON.stringify({
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: siteTitle,
    image: coverUrl,
    description: siteDescription,
    url: window.location.href,
    brand: {
      '@type': 'Brand',
      name: siteTitle,
      description: siteDescription,
    },
  })

  return (
    <DefaultLayout white noFooter>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={coverUrl || EmptyCover} />
        <meta property="og:description" content={siteDescription || ''} />
        <script type="application/ld+json">{ldData}</script>
      </Helmet>

      <OnSaleCoverSection
        cover={{ title, abstract, description, url: coverUrl, type: coverType }}
        expiredAt={expiredAt}
        {...contents.slogan}
      />

      <OnSaleIntroductionSection introduction={introduction || ''} />

      <OnSaleSkillSection {...contents.skill} />
      <OnSaleRoadmapSection roadmaps={contents.roadmaps} />
      <OnSaleTrialSection {...contents.trial} />
      <OnSaleComparisonSection comparisons={contents.comparisons} />

      <OnSaleProjectPlanSection projectPlans={projectPlans || []} />

      <OnSaleCommentSection comments={comments} />
      <OnSaleCallToActionSection updates={updates} expiredAt={expiredAt} projectId={id} />
    </DefaultLayout>
  )
}

export default OnSalePage

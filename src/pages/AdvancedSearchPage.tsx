import { Button, Icon, SkeletonText } from '@chakra-ui/react'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { isEmpty, uniq } from 'ramda'
import { defineMessage, useIntl } from 'react-intl'
import { Link, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { FilterType } from '../components/layout/DefaultLayout/GlobalSearchModal'
import { useSearchProductCollection } from '../hooks/search'
import EmptyCover from '../images/empty-cover.png'
import { ReactComponent as EmptyBoxIcon } from '../images/icons-empty-box.svg'
import { ReactComponent as StarIcon } from '../images/star-current-color.svg'

const StyledTitle = styled.div`
  color: var(--gray-darker);
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 0.8px;

  @media (min-width: ${BREAK_POINT}px) {
    text-align: left;
    font-size: 24px;
    letter-spacing: 0.2px;
  }
`

const StyledContainer = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 70vh;
`

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media (min-width: ${BREAK_POINT}px) {
    grid-template-columns: repeat(4, 1fr);
  }
`

const StyledProgramCover = styled.div<{ src: string }>`
  padding-top: 56.25%;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`

const StyledProgramTitle = styled.h3`
  && {
    height: 3rem;
    overflow: hidden;
    ${CommonTitleMixin}
    ${MultiLineTruncationMixin}
  }
`
const StyledName = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme['@primary-color']};
`

const StyledText = styled.div`
  letter-spacing: 0.2px;
  line-height: 1.5;
  font-size: 16px;
  font-weight: 500;
  color: var(--gray-darker);
`

const StyledButton = styled(Button)`
  && {
    width: 160px;
    height: 44px;
    padding: 10px 56px;
    border-radius: 4px;
    border: solid 1px #979797;
  }
`

const getTypeDisplayName = (type: string, originalCategories: string[]) => {
  if (originalCategories.length > 0) {
    return originalCategories
  }

  const typeMap: Record<string, string[]> = {
    program: ['課程'],
    project: ['專案'],
    activity: ['線上講座'],
    post: ['文章'],
    podcast_program: ['Podcast'],
    merchandise: ['商品'],
    program_package: ['課程包'],
  }

  return typeMap[type] || []
}

const AdvancedSearchPage: React.FC = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const { state } = useLocation<{ title: string; memberId?: string; memberRoles?: string[] } & FilterType>()

  const hasAdvancedParams = !!(
    state?.categoryIdSList?.length ||
    state?.tagNameSList?.length ||
    state?.durationRange ||
    state?.score
  )

  const { loadingSearchResults: isLoading, searchResults } = useSearchProductCollection(
    state?.memberId || null,
    state?.memberRoles || ['instructor', 'content-creator'],
    {
      title: state?.title || null,
      tag: null,
      ...(hasAdvancedParams && {
        advancedFilters: {
          categoryIds: state.categoryIdSList,
          tagNames: state.tagNameSList,
          durationRange: state.durationRange || undefined,
          score: state.score || undefined,
          onlyPrograms: true,
        },
      }),
    },
  )

  const data = hasAdvancedParams
    ? searchResults.programs.map(program => {
        const plan = program.plans?.[0]
        return {
          id: program.id,
          coverUrl: program.coverUrl,
          title: program.title,
          score: program.score || null,
          categoryNames: uniq(
            (program.categories || []).map(cat => (cat.name.includes('/') ? cat.name.split('/')[1] : cat.name)),
          ),
          type: 'program',
          listPrice: plan?.listPrice ?? null,
          salePrice: plan?.salePrice ?? null,
          soldAt: plan?.soldAt ?? null,
          currencyId: plan?.currency?.id ?? 'TWD',
        }
      })
    : [
        ...searchResults.programs.map(program => {
          const originalCategories = program.categories?.map(cat => cat.name) || []
          const plan = program.plans?.[0]
          return {
            id: program.id,
            coverUrl: program.coverUrl,
            title: program.title,
            score: null,
            categoryNames: getTypeDisplayName('program', originalCategories),
            type: 'program',
            listPrice: plan?.listPrice ?? null,
            salePrice: plan?.salePrice ?? null,
            soldAt: plan?.soldAt ?? null,
            currencyId: plan?.currency?.id ?? 'TWD',
          }
        }),
        ...searchResults.projects.map(project => {
          const originalCategories = project.categories?.map(cat => cat.name) || []
          return {
            id: project.id,
            coverUrl: project.coverUrl,
            title: project.title,
            score: null,
            categoryNames: getTypeDisplayName('project', originalCategories),
            type: 'project',
            listPrice: null,
            salePrice: null,
            soldAt: null,
            currencyId: 'TWD',
          }
        }),
        ...searchResults.activities.map(activity => {
          const originalCategories = activity.categories?.map(cat => cat.name) || []
          return {
            id: activity.id,
            coverUrl: activity.coverUrl,
            title: activity.title,
            score: null,
            categoryNames: getTypeDisplayName('activity', originalCategories),
            type: 'activity',
            listPrice: null,
            salePrice: null,
            soldAt: null,
            currencyId: 'TWD',
          }
        }),
        ...searchResults.posts.map(post => {
          const originalCategories: string[] = []
          return {
            id: post.id,
            coverUrl: post.coverUrl,
            title: post.title,
            score: null,
            categoryNames: getTypeDisplayName('post', originalCategories),
            type: 'post',
            listPrice: null,
            salePrice: null,
            soldAt: null,
            currencyId: 'TWD',
          }
        }),
        ...searchResults.podcastPrograms.map(podcast => {
          const originalCategories = podcast.categories?.map(cat => cat.name) || []
          return {
            id: podcast.id,
            coverUrl: podcast.coverUrl,
            title: podcast.title,
            score: null,
            categoryNames: getTypeDisplayName('podcast_program', originalCategories),
            type: 'podcast_program',
            listPrice: null,
            salePrice: null,
            soldAt: null,
            currencyId: 'TWD',
          }
        }),
        ...searchResults.merchandises.map(merchandise => {
          const originalCategories = merchandise.categories?.map(cat => cat.name) || []
          return {
            id: merchandise.id,
            coverUrl: merchandise.images?.[0]?.url || null,
            title: merchandise.title,
            score: null,
            categoryNames: getTypeDisplayName('merchandise', originalCategories),
            type: 'merchandise',
            listPrice: null,
            salePrice: null,
            soldAt: null,
            currencyId: 'TWD',
          }
        }),
        ...searchResults.programPackages.map(packageItem => {
          const originalCategories: string[] = []
          return {
            id: packageItem.id,
            coverUrl: packageItem.coverUrl,
            title: packageItem.title,
            score: null,
            categoryNames: getTypeDisplayName('program_package', originalCategories),
            type: 'program_package',
            listPrice: (packageItem as any).listPrice ?? null,
            salePrice: (packageItem as any).salePrice ?? null,
            soldAt: (packageItem as any).soldAt ?? null,
            currencyId: 'TWD',
          }
        }),
      ]

  return (
    <DefaultLayout white>
      <div className="container">
        <StyledTitle className="my-5">
          {formatMessage(defineMessage({ id: 'common.text.searchResult', defaultMessage: '搜尋結果' }))}
        </StyledTitle>
        {isLoading ? (
          <SkeletonText mt="1" noOfLines={4} spacing="4" />
        ) : isEmpty(data) ? (
          <StyledContainer>
            <div className="d-flex flex-column align-items-center">
              <StyledIcon as={EmptyBoxIcon} className="mb-4" />
              <StyledText>
                {formatMessage(
                  defineMessage({ id: 'common.text.noMatch', defaultMessage: '很抱歉，目前還沒有對應的組合' }),
                )}
              </StyledText>
              <StyledButton className="mt-4" variant="outline" onClick={() => history.push('/')}>
                {formatMessage(defineMessage({ id: 'common.text.backToHome', defaultMessage: '到首頁' }))}
              </StyledButton>
            </div>
          </StyledContainer>
        ) : (
          <StyledLayout className="mb-4">
            {data.map(item => (
              <Link key={item.id} to={getItemLink(item)}>
                <div>
                  <StyledProgramCover className="mb-3" src={item.coverUrl || EmptyCover} />
                  <StyledProgramTitle className="mb-2">{item.title}</StyledProgramTitle>
                  <div className="d-flex">
                    <StyledName className="flex-grow-1">{item.categoryNames?.slice(0, 3).join('．') || ''}</StyledName>
                    {!!item.score && (
                      <div className="flex-shrink-0 d-flex justify-content-center align-items-center">
                        <span className="mr-1">{item.score}</span>
                        <StyledIcon as={StarIcon} />
                      </div>
                    )}
                  </div>
                  {(item.type === 'program' || item.type === 'program_package') && item.listPrice !== null && (
                    <PriceLabel
                      variant="inline"
                      listPrice={item.listPrice}
                      salePrice={item.soldAt && new Date(item.soldAt) > new Date() ? item.salePrice : undefined}
                      currencyId={item.currencyId}
                    />
                  )}
                </div>
              </Link>
            ))}
          </StyledLayout>
        )}
      </div>
    </DefaultLayout>
  )
}

const getItemLink = (item: any) => {
  const pathMap: Record<string, string> = {
    program: 'programs',
    program_package: 'program-packages',
    activity: 'activities',
    project: 'projects',
    post: 'posts',
    podcast_program: 'podcast-programs',
    merchandise: 'merchandises',
  }

  const route = pathMap[item.type] || 'programs'
  return `/${route}/${item.id}`
}

export default AdvancedSearchPage

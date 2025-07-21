import { gql, useQuery } from '@apollo/client'
import { Button, Icon, SkeletonText } from '@chakra-ui/react'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { isEmpty, uniq } from 'ramda'
import { defineMessage, useIntl } from 'react-intl'
import { Link, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { FilterType } from '../components/layout/DefaultLayout/GlobalSearchModal'
import hasura from '../hasura'
import { useSearchProductCollection } from '../hooks/search' // 引入 search.ts 的 hook
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

// 獲取類型顯示名稱的輔助函數
const getTypeDisplayName = (type: string, originalCategories: string[]) => {
  // 如果原本就有分類名稱，優先使用
  if (originalCategories.length > 0) {
    return originalCategories
  }

  // 如果沒有分類，則根據類型提供預設名稱
  const typeMap: Record<string, string[]> = {
    program: ['課程'],
    project: ['專案'],
    activity: ['線上講座'], // 通常 activity 會有自己的分類，這是備用
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

  // 檢查是否有進階搜尋參數（除了 title 以外的其他篩選條件）
  const hasAdvancedParams = !!(
    state?.categoryIdSList?.length ||
    state?.tagNameSList?.length ||
    state?.durationRange ||
    state?.score
  )

  // 當有進階搜尋參數時，使用原本的 useSearchPrograms
  const {
    isLoading: advancedLoading,
    data: advancedData,
    error: advancedError,
  } = useSearchPrograms(
    hasAdvancedParams
      ? {
          is_private: { _eq: false },
          published_at: { _is_null: false },
          title: state?.title ? { _like: `%${state.title}%` } : undefined,
          _and: [
            ...(state?.categoryIdSList?.map(categoryIdS => ({
              program_categories: {
                category_id: { _in: categoryIdS },
              },
            })) || []),
            ...(state?.tagNameSList?.map(tagNameS => ({
              program_tags: {
                tag_name: { _in: tagNameS },
              },
            })) || []),
          ],
          program_duration: state?.durationRange
            ? {
                _and: [
                  { duration: { _lte: state.durationRange[0] * 60 } },
                  { duration: { _gt: state.durationRange[1] * 60 } },
                ],
              }
            : undefined,
          program_review_score: state?.score ? { score: { _gt: state.score } } : undefined,
        }
      : undefined, // 沒有進階參數時不執行查詢
  )

  // 當沒有進階搜尋參數時，使用 SEARCH_PRODUCT_COLLECTION
  const {
    loadingSearchResults: generalLoading,
    searchResults,
    errorSearchResults: generalError,
  } = useSearchProductCollection(
    state?.memberId || null,
    state?.memberRoles || ['instructor', 'content-creator'],
    !hasAdvancedParams
      ? {
          title: state?.title || null,
          tag: null,
        }
      : undefined, // 有進階參數時不執行查詢
  )

  // 根據搜尋模式決定使用哪個結果
  const isLoading = hasAdvancedParams ? advancedLoading : generalLoading
  const error = hasAdvancedParams ? advancedError : generalError

  // 整合搜尋結果
  const data = hasAdvancedParams
    ? advancedData?.map(item => ({
        ...item,
        type: 'program',
        // 進階搜尋的 programs 已經有 categoryNames 了
      })) || []
    : [
        ...searchResults.programs.map(program => {
          const originalCategories: string[] = [] // programs 通常沒有分類資料
          return {
            id: program.id,
            coverUrl: program.coverUrl,
            title: program.title,
            score: null,
            categoryNames: getTypeDisplayName('program', originalCategories),
            type: 'program',
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
          }
        }),
        ...searchResults.posts.map(post => {
          const originalCategories: string[] = [] // posts 通常沒有分類資料
          return {
            id: post.id,
            coverUrl: post.coverUrl,
            title: post.title,
            score: null,
            categoryNames: getTypeDisplayName('post', originalCategories),
            type: 'post',
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
          }
        }),
        ...searchResults.programPackages.map(packageItem => {
          const originalCategories: string[] = [] // 課程包通常沒有分類資料
          return {
            id: packageItem.id,
            coverUrl: packageItem.coverUrl,
            title: packageItem.title,
            score: null,
            categoryNames: getTypeDisplayName('program_package', originalCategories),
            type: 'program_package',
          }
        }),
      ]

  return (
    <DefaultLayout white>
      <div className="container">
        <StyledTitle className="my-5">
          {formatMessage(defineMessage({ id: 'common.text.searchResult', defaultMessage: '搜尋結果' }))}
          {!hasAdvancedParams && (
            <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '10px' }}>(包含所有產品類型)</span>
          )}
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
                </div>
              </Link>
            ))}
          </StyledLayout>
        )}
      </div>
    </DefaultLayout>
  )
}

// 根據項目類型生成正確的連結
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

const useSearchPrograms = (condition?: hasura.GET_ADVANCE_SEARCH_PROGRAMSVariables['condition']) => {
  const { loading, data, error } = useQuery<
    hasura.GET_ADVANCE_SEARCH_PROGRAMS,
    hasura.GET_ADVANCE_SEARCH_PROGRAMSVariables
  >(
    gql`
      query GET_ADVANCE_SEARCH_PROGRAMS($condition: program_bool_exp!) {
        program(where: $condition) {
          id
          title
          cover_url
          program_categories(order_by: { position: asc }) {
            id
            category {
              id
              name
            }
          }
          program_review_score {
            score
          }
        }
      }
    `,
    {
      variables: {
        condition: condition || {},
      },
      skip: !condition, // 沒有條件時跳過查詢
    },
  )

  return {
    isLoading: loading,
    data:
      data?.program.map(v => ({
        id: v.id,
        coverUrl: v.cover_url || null,
        title: v.title,
        score: v.program_review_score?.score || null,
        categoryNames: uniq(
          v.program_categories.map(w =>
            w.category.name.includes('/') ? w.category.name.split('/')[1] : w.category.name,
          ),
        ),
      })) || [],
    error,
  }
}

export default AdvancedSearchPage

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
    ? advancedData?.map(item => ({ ...item, type: 'program' })) || []
    : [
        ...searchResults.programs.map(program => ({
          id: program.id,
          coverUrl: program.coverUrl,
          title: program.title,
          score: null,
          categoryNames: [], // 可以從 program 資料中提取分類
          type: 'program',
        })),
        ...searchResults.projects.map(project => ({
          id: project.id,
          coverUrl: project.coverUrl,
          title: project.title,
          score: null,
          categoryNames: project.categories?.map(cat => cat.name) || [],
          type: 'project',
        })),
        ...searchResults.activities.map(activity => ({
          id: activity.id,
          coverUrl: activity.coverUrl,
          title: activity.title,
          score: null,
          categoryNames: activity.categories?.map(cat => cat.name) || [],
          type: 'activity',
        })),
        ...searchResults.posts.map(post => ({
          id: post.id,
          coverUrl: post.coverUrl,
          title: post.title,
          score: null,
          categoryNames: [],
          type: 'post',
        })),
        ...searchResults.podcastPrograms.map(podcast => ({
          id: podcast.id,
          coverUrl: podcast.coverUrl,
          title: podcast.title,
          score: null,
          categoryNames: podcast.categories?.map(cat => cat.name) || [],
          type: 'podcast_program',
        })),
        ...searchResults.merchandises.map(merchandise => ({
          id: merchandise.id,
          coverUrl: merchandise.images?.[0]?.url || null,
          title: merchandise.title,
          score: null,
          categoryNames: merchandise.categories?.map(cat => cat.name) || [],
          type: 'merchandise',
        })),
        ...searchResults.programPackages.map(packageItem => ({
          id: packageItem.id,
          coverUrl: packageItem.coverUrl,
          title: packageItem.title,
          score: null,
          categoryNames: [],
          type: 'program_package',
        })),
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

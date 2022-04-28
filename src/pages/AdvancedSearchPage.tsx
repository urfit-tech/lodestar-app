import { useQuery } from '@apollo/react-hooks'
import { Button, Icon, SkeletonText } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { isEmpty, uniq } from 'ramda'
import { defineMessage, useIntl } from 'react-intl'
import { Link, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import { FilterType } from '../components/layout/DefaultLayout/GlobalSearchModal'
import hasura from '../hasura'
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
  const { state } = useLocation<{ title: string } & FilterType>()

  const { isLoading, data } = useSearchPrograms({
    is_private: { _eq: false },
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
  })

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
            {data.map(program => (
              <Link to={`/programs/${program.id}`}>
                <div>
                  <StyledProgramCover className="mb-3" src={program.coverUrl || EmptyCover} />
                  <StyledProgramTitle className="mb-2">{program.title}</StyledProgramTitle>
                  <div className="d-flex">
                    <StyledName className="flex-grow-1">{program.categoryNames.slice(0, 3).join('．')}</StyledName>
                    {!!program.score && (
                      <div className="flex-shrink-0 d-flex justify-content-center align-items-center">
                        <span className="mr-1">{program.score}</span>
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

const useSearchPrograms = (condition: hasura.GET_ADVANCE_SEARCH_PROGRAMSVariables['condition']) => {
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
        condition,
      },
    },
  )

  return {
    isLoading: loading,
    data:
      data?.program.map(v => ({
        id: v.id,
        coverUrl: v.cover_url,
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

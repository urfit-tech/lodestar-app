import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { uniq } from 'ramda'
import { defineMessage, useIntl } from 'react-intl'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { BREAK_POINT } from '../components/common/Responsive'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import EmptyCover from '../images/empty-cover.png'
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

const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 1rem;

  @media (min-width: ${BREAK_POINT}px) {
    grid-template-columns: repeat(5, 1fr);
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
  font-family: NotoSansCJKtc;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: var(--gray-dark);
`

const StyledIcon = styled(Icon)`
  color: ${props => props.theme['@primary-color']};
`

const AdvancedSearchPage: React.FC = () => {
  const { formatMessage } = useIntl()
  const { state: query } = useLocation<{
    title: string
    categoryCollectionList: string[][]
    tagNameCollectionList: string[][]
    durationRange: number[]
    score: number
  }>()
  const { title, categoryCollectionList, tagNameCollectionList, durationRange, score } = query

  const { data } = useSearchPrograms({
    title: title ? { _like: `%${title}%` } : undefined,
    _and: [
      ...categoryCollectionList.map(categoryCollection => ({
        program_categories: {
          category_id: { _in: categoryCollection },
        },
      })),
      ...tagNameCollectionList.map(tagNameCollection => ({
        program_tags: {
          tag_name: { _in: tagNameCollection },
        },
      })),
    ],
    program_duration: {
      _and: [{ duration: { _lte: durationRange[0] * 60 } }, { duration: { _gt: durationRange[1] * 60 } }],
    },
    program_review_score: score ? { score: { _gt: 4 } } : undefined,
  })

  return (
    <DefaultLayout white>
      <div className="container">
        <StyledTitle className="my-5">
          {formatMessage(defineMessage({ id: 'common.text.searchResult', defaultMessage: '搜尋結果' }))}
        </StyledTitle>
        <StyledLayout>
          {data.map(program => (
            <div>
              <StyledProgramCover className="mb-3" src={program.coverUrl || EmptyCover} />
              <StyledProgramTitle>{program.title}</StyledProgramTitle>
              <div className="d-flex">
                <StyledName className="flex-grow-1">{program.categoryNames.join('．')}</StyledName>
                {program.score ? (
                  <div className="flex-shrink-0 d-flex justify-content-center align-items-center">
                    <span className="mr-1">{program.score}</span>
                    <StyledIcon as={StarIcon} />
                  </div>
                ) : (
                  <StyledName>
                    {formatMessage(defineMessage({ id: 'common.text.noReview', defaultMessage: '尚未有評價' }))}
                  </StyledName>
                )}
              </div>
            </div>
          ))}
        </StyledLayout>
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
          title
          cover_url
          program_categories {
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
        coverUrl: v.cover_url,
        title: v.title,
        score: v.program_review_score?.score || null,
        categoryNames: uniq(v.program_categories.map(v => v.category.name.split('/')[0])),
      })) || [],
    error,
  }
}

export default AdvancedSearchPage

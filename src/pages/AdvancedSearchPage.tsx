import { useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { CommonTitleMixin, MultiLineTruncationMixin } from 'lodestar-app-element/src/components/common'
import { uniq } from 'ramda'
import { defineMessage, useIntl } from 'react-intl'
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
const StyledCategoryName = styled.span`
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
  const { data } = useSearchPrograms()

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
                <StyledCategoryName className="flex-grow-1">{program.categoryNames.join('．')}</StyledCategoryName>
                <div className="flex-shrink-0 d-flex justify-content-center align-items-center">
                  <span className="mr-1">{program.score}</span>
                  <StyledIcon as={StarIcon} />
                </div>
              </div>
            </div>
          ))}
        </StyledLayout>
      </div>
    </DefaultLayout>
  )
}

const useSearchPrograms = () => {
  const { loading, data, error } = useQuery<hasura.GET_ADVANCE_SEARCH_PROGRAMS>(gql`
    query GET_ADVANCE_SEARCH_PROGRAMS {
      program(where: { program_review_score: { score: { _is_null: false } } }) {
        cover_url
        title
        program_review_score {
          program_id
          score
        }
        program_categories {
          id
          category {
            id
            name
          }
        }
      }
    }
  `)

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

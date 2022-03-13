import { useQuery } from '@apollo/react-hooks'
import { Button, Checkbox, Icon, Input } from '@chakra-ui/react'
import gql from 'graphql-tag'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { complement, equals, flatten, groupBy, includes, isEmpty, map, pluck, toPairs } from 'ramda'
import React, { useEffect, useRef, useState } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { commonMessages } from '../../../helpers/translation'
import { ReactComponent as SearchIcon } from '../../../images/search.svg'

const StyleSearchIcon = styled(Icon)`
  cursor: pointer;
`

export type FilterType = {
  categoryIdSList: string[][]
  tagNameSList: string[][]
  durationRange: [number, number] | null
  score: number | null
}

const GlobalSearchModal: React.VFC = () => {
  const history = useHistory()
  const { formatMessage } = useIntl()
  const [isOpen, setIsModalOpen] = useState(false)
  const keywordRef = useRef('')
  const [filter, setFilter] = useState<FilterType>({
    categoryIdSList: [],
    tagNameSList: [],
    durationRange: null,
    score: null,
  })

  return (
    <>
      <StyleSearchIcon as={SearchIcon} className="mr-2" onClick={() => setIsModalOpen(true)} />
      <CommonModal isFullWidth title="" isOpen={isOpen} onClose={() => setIsModalOpen(false)}>
        <div className="d-flex mb-3">
          <Input
            className="flex-grow-1"
            onChange={e => (keywordRef.current = e.target.value)}
            placeholder={formatMessage(defineMessage({ id: 'common.ui.enterKeyword', defaultMessage: '輸入關鍵字' }))}
          />
          <Button
            className="flex-shrink-0"
            colorScheme="primary"
            onClick={() => {
              history.push('/search/advanced', {
                title: keywordRef.current,
                ...filter,
              })
            }}
          >
            {formatMessage(commonMessages.ui.search)}
          </Button>
        </div>
        <GlobalSearchFilter onChange={value => setFilter(value)} />
      </CommonModal>
    </>
  )
}

const StyledFilterTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 4px 0;
  letter-spacing: 0.2px;
  color: var(--gray-darker);
`

const StyledFilterSubTitle = styled.h4`
  font-size: 14px;
  font-weight: bold;
  text-align: justify;
  color: var(--gray-dark);
`

const StyledGroup = styled.div<{ active: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: 4px;
  border: solid 1px ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};

  &:hover {
    border: solid 1px #002e6d;
  }
`

const StyledRoundedButton = styled(Button)<{ active: boolean }>`
  && {
    height: 36px;
    padding: 6px 20px;
    border-radius: 30px;

    color: ${props => props.active && props.theme['@primary-color']};
    border: solid 1px ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};
    background-color: ${props => (props.active ? props.theme['@primary-color'] : 'fff')}22;
    &:hover {
      background: initial;
    }
  }
`

const GlobalSearchFilter: React.VFC<{
  type?: 'program' | 'activity' | 'member' | 'merchandise' | 'podcastProgram' | 'post'
  onChange?: (filter: FilterType) => void
}> = ({ type, onChange }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const {
    isLoading,
    filterOptionGroup: { categories, tags },
  } = useFilterOptions(type)
  const [filter, setFilter] = useState<FilterType>({
    categoryIdSList: [],
    tagNameSList: [],
    durationRange: null,
    score: null,
  })

  useEffect(() => {
    onChange?.(filter)
  }, [onChange, filter])

  if (isLoading === true) {
    return <></>
  }

  return (
    <div>
      <div>
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選分類' }))}
        </StyledFilterTitle>
        {categories.map(category => {
          const isCategoryActive = includes(
            category.id ? [category.id] : pluck('id', category.subCategories),
            filter.categoryIdSList,
          )
          return (
            <StyledGroup active={isCategoryActive} key={category.id} className="mb-2">
              <div className="d-flex align-items-center">
                <Checkbox
                  isChecked={isCategoryActive}
                  onChange={() => {
                    setFilter(prev => ({
                      ...prev,
                      categoryIdSList: isCategoryActive
                        ? [
                            ...prev.categoryIdSList.filter(
                              categoryIdS =>
                                !equals(categoryIdS, category.id ? [category.id] : pluck('id', category.subCategories)),
                            ),
                          ]
                        : [...prev.categoryIdSList, category.id ? [category.id] : pluck('id', category.subCategories)],
                    }))
                  }}
                />
                <span className="ml-2">{category.name}</span>
              </div>
              {category.subCategories.length > 0 && (
                <div className="mt-3 ml-4">
                  {category.subCategories.map(subCategory => {
                    const isSubCategoryActive = flatten(filter.categoryIdSList).includes(subCategory.id)
                    return (
                      <StyledRoundedButton
                        active={isSubCategoryActive}
                        onClick={() =>
                          setFilter(prevFilter => {
                            return {
                              ...prevFilter,
                              categoryIdSList: isSubCategoryActive
                                ? [
                                    ...prevFilter.categoryIdSList.filter(
                                      categoryIdS => !categoryIdS.includes(subCategory.id),
                                    ),
                                    [
                                      ...(prevFilter.categoryIdSList
                                        .find(categoryIdS => categoryIdS.includes(subCategory.id))
                                        ?.filter(categoryIdS => !categoryIdS.includes(subCategory.id)) || []),
                                    ],
                                  ].filter(complement(isEmpty))
                                : [
                                    ...prevFilter.categoryIdSList.filter(categoryIdS =>
                                      categoryIdS.every(categoryId =>
                                        pluck('id', category.subCategories).includes(categoryId),
                                      ),
                                    ),
                                    [
                                      ...(!!prevFilter.categoryIdSList.find(categoryIdS =>
                                        categoryIdS.every(categoryId =>
                                          pluck('id', category.subCategories).includes(categoryId),
                                        ),
                                      )
                                        ? [
                                            ...(prevFilter.categoryIdSList.find(categoryIdS =>
                                              categoryIdS.every(categoryId =>
                                                pluck('id', category.subCategories).includes(categoryId),
                                              ),
                                            ) || []),
                                            subCategory.id,
                                          ]
                                        : [subCategory.id]),
                                    ].sort(),
                                  ],
                            }
                          })
                        }
                        key={`${category.id}_${subCategory.id}`}
                        colorScheme="primary"
                        variant="outline"
                        className="mr-2"
                      >
                        {subCategory.name}
                      </StyledRoundedButton>
                    )
                  })}
                </div>
              )}
            </StyledGroup>
          )
        })}
      </div>
      <div>
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.filterCategory', defaultMessage: '篩選條件' }))}
        </StyledFilterTitle>
        {tags.map(tag => {
          const isTagActive = includes(tag.id ? [tag.name] : pluck('name', tag.subTags), filter.tagNameSList)
          return (
            <StyledGroup active={isTagActive} key={tag.id} className="mb-2">
              <div className="d-flex align-items-center">
                <Checkbox
                  isChecked={isTagActive}
                  onChange={() =>
                    setFilter(prev => ({
                      ...prev,
                      tagNameSList: isTagActive
                        ? [
                            ...prev.tagNameSList.filter(
                              tagNameS => !equals(tagNameS, tag.id ? [tag.name] : pluck('name', tag.subTags)),
                            ),
                          ]
                        : [...prev.tagNameSList, tag.id ? [tag.name] : pluck('name', tag.subTags)],
                    }))
                  }
                />
                <span className="ml-2">{tag.name}</span>
              </div>
              {tag.subTags.length > 0 && (
                <div className="mt-3 ml-4">
                  {tag.subTags.map(subTag => {
                    const isSubTagActive = flatten(filter.tagNameSList).includes(subTag.name)
                    return (
                      <StyledRoundedButton
                        active={isSubTagActive}
                        onClick={() => {
                          setFilter(prevFilter => ({
                            ...prevFilter,
                            tagNameSList: isSubTagActive
                              ? [
                                  ...prevFilter.tagNameSList.filter(tagNameS => !tagNameS.includes(subTag.name)),
                                  [
                                    ...(prevFilter.tagNameSList
                                      .find(tagNameS => tagNameS.includes(subTag.name))
                                      ?.filter(tagNameS => !tagNameS.includes(subTag.name)) || []),
                                  ],
                                ].filter(complement(isEmpty))
                              : [
                                  ...prevFilter.tagNameSList.filter(
                                    tagNameS =>
                                      !tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                  ),
                                  [
                                    ...(!!prevFilter.tagNameSList.find(tagNameS =>
                                      tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                    )
                                      ? [
                                          ...(prevFilter.tagNameSList.find(tagNameS =>
                                            tagNameS.every(tagName => pluck('name', tag.subTags).includes(tagName)),
                                          ) || []),
                                          subTag.name,
                                        ].sort()
                                      : [subTag.name]),
                                  ],
                                ],
                          }))
                        }}
                        key={subTag.id}
                        colorScheme="primary"
                        variant="outline"
                        className="mr-2"
                      >
                        {subTag.name}
                      </StyledRoundedButton>
                    )
                  })}
                </div>
              )}
            </StyledGroup>
          )
        })}
      </div>
      <div>
        <StyledFilterTitle>
          {formatMessage(defineMessage({ id: 'common.ui.advancedCondition', defaultMessage: '進階條件' }))}
        </StyledFilterTitle>

        <div className="mb-2">
          <StyledFilterSubTitle>
            {formatMessage(defineMessage({ id: 'common.ui.duration', defaultMessage: '時長' }))}
          </StyledFilterSubTitle>

          {Array.from(Array(4).keys())
            .map((_, index) => index * Number(settings['global_search.minute_interval']))
            .map((minute, i, minutes) => (
              <StyledRoundedButton
                onClick={() => {
                  setFilter(prev => ({
                    ...prev,
                    durationRange: equals(prev.durationRange, [minute, minutes[i + 1]])
                      ? null
                      : [minute, minutes[i + 1]],
                  }))
                }}
                active={equals(filter.durationRange, [minute, minutes[i + 1]])}
                className="mr-2"
                colorScheme="primary"
                variant="outline"
              >
                {i === 0 ? (
                  <span>&lt; {minutes[i + 1]}</span>
                ) : i === minutes.length - 1 ? (
                  <span>{minute} &gt;</span>
                ) : (
                  <span>
                    {minute} ~ {minutes[i + 1]}
                  </span>
                )}
              </StyledRoundedButton>
            ))}
        </div>
        <div className="mb-2">
          <StyledFilterSubTitle>
            {formatMessage(defineMessage({ id: 'common.ui.score', defaultMessage: '評分' }))}
          </StyledFilterSubTitle>
          <div>
            {[4.8, 4.5, 4.0].map(score => (
              <StyledRoundedButton
                onClick={() =>
                  setFilter(prev => ({
                    ...prev,
                    score: prev.score === score ? null : score,
                  }))
                }
                active={filter.score === score}
                className="mr-2"
                colorScheme="primary"
                variant="outline"
              >
                <span>&gt; {score}</span>
              </StyledRoundedButton>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type Category = {
  id: string
  name: string
}

type Tag = {
  id: string
  name: string
}

const useFilterOptions: (type?: 'program' | 'activity' | 'member' | 'merchandise' | 'podcastProgram' | 'post') => {
  isLoading: boolean
  filterOptionGroup: {
    categories: (Category & { subCategories: Category[] })[]
    tags: (Tag & { subTags: Tag[] })[]
  }
} = type => {
  const { loading, data } = useQuery(
    gql`
      query GET_PRODUCT_FILTER_OPTIONS($class: String) {
        category(where: { class: { _eq: $class } }) {
          id
          name
        }
        tag {
          name
        }
      }
    `,
    {
      variables: {
        class: type,
      },
    },
  )
  const categories = map(([categoryName, subCategories]) => {
    if (subCategories.length === 1) {
      return {
        ...subCategories[0],
        subCategories: [],
      }
    }

    return {
      id: subCategories.filter(cat => cat.name === categoryName)[0]?.id,
      name: categoryName,
      subCategories: subCategories
        .filter(cat => cat.name !== categoryName)
        .map(cat => ({ id: cat.id, name: cat.name.split('/')[1] })),
    }
  }, toPairs(groupBy<{ id: string; name: string }>(category => category.name.split('/')[0], data?.category || [])))

  const tags = map(([tagName, subTags]) => {
    if (subTags.length === 1) {
      return {
        ...subTags[0],
        subTags: [],
      }
    }

    return {
      id: subTags.filter(tag => tag.name === tagName)[0]?.name,
      name: tagName,
      subTags: subTags
        .filter(tag => tag.name !== tagName)
        .map(tag => ({
          id: tag.name,
          name: tag.name,
        })),
    }
  }, toPairs(groupBy<{ id: string; name: string }>(tag => tag.name.split('/')[0], data?.tag || [])))

  return {
    isLoading: loading,
    filterOptionGroup: {
      categories,
      tags,
    },
  }
}

export default GlobalSearchModal

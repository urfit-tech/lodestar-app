import { Icon } from '@chakra-ui/react'
import { Button } from 'antd'
import { flatten, prop, sortBy, uniq } from 'ramda'
import React, { useState } from 'react'
import { AiOutlineRight, AiOutlineUnorderedList } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import { ProgramPackageProgram } from '../../types/programPackage'

const StyledCategoryButton = styled(Button)<{ selected?: boolean }>`
  transition: background-color 0.2s ease-in-out;

  &,
  &:active,
  &:hover,
  &:focus {
    background-color: ${props => (props.selected ? props.theme['@primary-color'] : 'transparent')};
    color: ${props => (props.selected ? 'white' : props.theme['@primary-color'])};
  }
`
const StyledSwitchButton = styled.div`
  display: inline-block;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    color: ${props => props.theme['@primary-color']};
  }
`

const ProgramCollection: React.VFC<{
  programs: ProgramPackageProgram[]
  renderItem: React.VFC<{
    program: ProgramPackageProgram
    displayType: 'grid' | 'list'
  }>
  defaultDisplayType?: 'grid' | 'list'
  noDisplayTypeButton?: boolean
}> = ({ programs, renderItem, defaultDisplayType = 'grid', noDisplayTypeButton }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [displayType, setDisplayType] = useState<'grid' | 'list'>(defaultDisplayType)
  const { formatMessage } = useIntl()

  const categories = sortBy(prop('position'))(uniq(flatten(programs.map(program => program.categories))))

  return (
    <div className="container p-4">
      <div className="d-flex align-items-center justify-content-start flex-wrap mb-5">
        <StyledCategoryButton
          type="link"
          shape="round"
          className="mr-2"
          onClick={() => setSelectedCategory(null)}
          selected={!selectedCategory}
        >
          {formatMessage(commonMessages.button.allCategory)}
        </StyledCategoryButton>

        {categories.map(category => (
          <StyledCategoryButton
            key={category.id}
            type="link"
            shape="round"
            className="mr-2"
            onClick={() => setSelectedCategory(category.id)}
            selected={selectedCategory === category.id}
          >
            {category.name}
          </StyledCategoryButton>
        ))}
      </div>

      {!noDisplayTypeButton && (
        <StyledSwitchButton className="mb-3">
          {displayType === 'grid' && (
            <div onClick={() => setDisplayType('list')}>
              <Icon as={AiOutlineUnorderedList} className="mr-2" />
              <span>{formatMessage(commonMessages.term.list)}</span>
            </div>
          )}
          {displayType === 'list' && (
            <div onClick={() => setDisplayType('grid')}>
              <Icon as={AiOutlineRight} className="mr-2" />
              <span>{formatMessage(commonMessages.term.grid)}</span>
            </div>
          )}
        </StyledSwitchButton>
      )}

      <div className="row mb-5">
        {programs
          .filter(
            program => !selectedCategory || program.categories.map(category => category.id).includes(selectedCategory),
          )
          .map(program => renderItem && renderItem({ displayType, program }))}
      </div>
    </div>
  )
}

export default ProgramCollection

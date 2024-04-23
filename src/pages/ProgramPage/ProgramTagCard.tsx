import { Button } from '@chakra-ui/react'
import CommonModal from 'lodestar-app-element/src/components/modals/CommonModal'
import React, { useState } from 'react'
import { defineMessage, useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

const StyledProgramTagCard = styled.div`
  position: sticky;
  top: 20px;
  margin-top: 20px;
  border-radius: 4px;
  padding: 24px;
  background-color: #fff;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
`

const StyleSubCategoryTag = styled(Button)`
  && {
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }
`

const StyledViewAllButton = styled(Button)`
  && {
    font-size: 14px;

    &:hover {
      text-decoration: none;
    }
  }
`

const ProgramTagCard: React.VFC<{ tags: { id: string; name: string }[] }> = ({ tags }) => {
  const { formatMessage } = useIntl()
  const [isOpen, setIsOpen] = useState(false)
  const history = useHistory()

  const resultTags = tags.map(tag => ({
    id: tag.id,
    name: tag.name.includes('/') ? tag.name.split('/')[1] : tag.name,
  }))

  return (
    <StyledProgramTagCard>
      {resultTags.slice(0, 8).map(tag => (
        <StyleSubCategoryTag
          className="mb-2 mr-2"
          variant="outline"
          colorScheme="primary"
          onClick={() =>
            history.push('/search/advanced', {
              tagNameSList: [[tag.id]],
            })
          }
        >
          {tag.name}
        </StyleSubCategoryTag>
      ))}

      {resultTags.length > 8 && (
        <div className="mt-2 mb-3">
          <CommonModal title="" isOpen={isOpen} onClose={() => setIsOpen(false)}>
            {resultTags.map(tag => (
              <StyleSubCategoryTag
                className="mb-2 mr-2"
                variant="outline"
                colorScheme="primary"
                onClick={() =>
                  history.push('/search/advanced', {
                    tagNameSList: [[tag.id]],
                  })
                }
              >
                {tag.name}
              </StyleSubCategoryTag>
            ))}
          </CommonModal>
          <StyledViewAllButton className="d-block" variant="link" onClick={() => setIsOpen(true)}>
            {formatMessage(defineMessage({ id: 'common.ui.viewAll', defaultMessage: '查看全部' }))}
          </StyledViewAllButton>
        </div>
      )}
    </StyledProgramTagCard>
  )
}

export default ProgramTagCard

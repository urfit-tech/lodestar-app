import { Icon } from '@chakra-ui/react'
import { Button } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { flatten, uniqBy } from 'ramda'
import React, { useState } from 'react'
import { AiFillAppstore } from 'react-icons/ai'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CommonTextMixin, MultiLineTruncationMixin } from '../components/common'
import { CustomRatioImage } from '../components/common/Image'
import { StyledBanner, StyledBannerTitle, StyledCollection } from '../components/layout'
import DefaultLayout from '../components/layout/DefaultLayout'
import { notEmpty } from '../helpers'
import { commonMessages } from '../helpers/translation'
import { useNav } from '../hooks/data'
import { usePublishedCreator } from '../hooks/member'
import DefaultAvatar from '../images/avatar.svg'
import ForbiddenPage from './ForbiddenPage'

const StyledCreatorName = styled.h2`
  height: 20px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.77px;
  color: var(--gray-darker);
`

const StyledCreatorTitle = styled.h3`
  height: 14px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.18px;
  color: var(--gray-darker);
`

const StyledCreatorAbstract = styled.p`
  ${MultiLineTruncationMixin}
  ${CommonTextMixin}
`

export const StyledCreatorTag = styled.span`
  &:before {
    content: '#';
    margin-right: 2px;
  }

  margin-bottom: 0.5rem;
  border-radius: 2px;
  padding: 4px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
  color: ${props => props.theme['@primary-color']};
  background-color: ${props => props.theme['@primary-color']}22;

  &:not(last-child) {
    margin-right: 0.4rem;
  }
`

const CreatorDisplayedPage: React.VFC<{}> = () => {
  const app = useApp()
  const { pageTitle } = useNav()
  const { formatMessage } = useIntl()
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const { creators } = usePublishedCreator()

  if (!app.loading && !app.enabledModules.creator_display) {
    return <ForbiddenPage />
  }

  const categories = uniqBy(v => v.name, flatten(creators.map(v => v.categories).filter(notEmpty)))

  const filteredCreators = creators.filter(
    v => !selectedCategoryId || v.categories.map(w => w.id).includes(selectedCategoryId),
  )

  return (
    <DefaultLayout white>
      <StyledBanner>
        <div className="container">
          <StyledBannerTitle className="d-flex align-items-center">
            <Icon as={AiFillAppstore} className="mr-3" />
            <span>{pageTitle}</span>
          </StyledBannerTitle>

          <Button
            type={selectedCategoryId === null ? 'primary' : 'default'}
            shape="round"
            className="mb-2"
            onClick={() => setSelectedCategoryId(null)}
          >
            {formatMessage(commonMessages.button.allCategory)}
          </Button>

          {categories.map(v => (
            <Button
              key={v.id}
              type={selectedCategoryId === v.id ? 'primary' : 'default'}
              shape="round"
              className="ml-2 mb-2"
              onClick={() => setSelectedCategoryId(v.id)}
            >
              {v.name}
            </Button>
          ))}
        </div>
      </StyledBanner>

      <StyledCollection>
        <div className="container">
          <div className="row">
            {filteredCreators.map(v => (
              <div className="col-12 col-md-6 col-lg-3 mb-4">
                <Link to={`/creators/${v.id}?tabkey=appointments`}>
                  <CustomRatioImage
                    width="100%"
                    ratio={1}
                    src={v.pictureUrl || DefaultAvatar}
                    className="mb-3"
                    shape="rounded"
                  />
                  <StyledCreatorName className="mb-2">{v.name}</StyledCreatorName>
                  <StyledCreatorTitle className="mb-3">{v.title}</StyledCreatorTitle>
                  <StyledCreatorAbstract className="mb-3">{v.abstract}</StyledCreatorAbstract>
                  <div className="d-flex flex-wrap">
                    {v.specialtyNames.map(w => (
                      <StyledCreatorTag>{w}</StyledCreatorTag>
                    ))}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </StyledCollection>
    </DefaultLayout>
  )
}

export default CreatorDisplayedPage

import { Button } from 'antd'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import { commonMessages } from '../../helpers/translation'
import BlurredBanner from '../common/BlurredBanner'

const StyledTitleBlock = styled.div<{ withChildren?: boolean }>`
  position: relative;
  padding: ${props => (props.withChildren ? '4rem 0 2rem' : '10rem 1rem')};
  color: white;
`
const StyledCategoryLabel = styled.span`
  letter-spacing: 0.8px;
  font-size: 14px;

  :not(:first-child) {
    margin-left: 0.5rem;
  }
`
const StyledExtraBlock = styled.div`
  position: relative;
  margin-bottom: -1px;
  padding: 2px;
  background: linear-gradient(to bottom, transparent 60%, white 60%);
`
const StyledTitle = styled.h1`
  color: white;
  font-size: 40px;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 1px;
`
const StyledQRCode = styled.div`
  display: inline-block;
  padding: 2.5rem;
  background: white;
  line-height: normal;
  box-shadow: 0 2px 21px 0 rgba(0, 0, 0, 0.15);
`

const ActivityBanner: React.FC<{
  coverImage?: string
  activityCategories: {
    id: string
    name: string
  }[]
  activityTitle: string
}> = ({ coverImage, activityCategories, activityTitle, children }) => {
  const { formatMessage } = useIntl()
  return (
    <BlurredBanner coverUrl={coverImage}>
      <StyledTitleBlock withChildren={!!children} className="text-center">
        <div className="mb-4">
          {activityCategories.map(activityCategory => (
            <StyledCategoryLabel key={activityCategory.id}>#{activityCategory.name}</StyledCategoryLabel>
          ))}
        </div>
        <StyledTitle className="m-0">{activityTitle}</StyledTitle>
      </StyledTitleBlock>

      {children && (
        <StyledExtraBlock className="text-center">
          <StyledQRCode className="mb-4">{children}</StyledQRCode>
          <div>
            <Button type="link" onClick={() => window.print()}>
              {formatMessage(commonMessages.button.print)}
            </Button>
          </div>
        </StyledExtraBlock>
      )}
    </BlurredBanner>
  )
}

export default ActivityBanner

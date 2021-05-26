import React, { useEffect } from 'react'
import styled from 'styled-components'
import PeriodTypeLabel from '../common/PeriodTypeLabel'
import PriceLabel from '../common/PriceLabel'

const StyledPodcastPlanLabel = styled.div<{ active?: boolean }>`
  && {
    border-radius: 4px;
    border: 1px solid ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};
    padding: 16px;
    user-select: none;
    cursor: pointer;

    h3 {
      color: ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray-darker)')};
    }
  }
`
const StyledPodcastPlanPrice = styled.div<{ active?: boolean }>`
  span:first-child {
    color: ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray-darker)')};
  }
  span:nth-child(2) {
    text-decoration: line-through;
    color: ${props => (props.active ? props.theme['@primary-color'] : 'var(--gray)')};
  }
`

type PodcastPlanProps = {
  id: string
  periodAmount: number
  periodType: 'D' | 'W' | 'M' | 'Y'
  listPrice: number
  salePrice?: number
  soldAt: Date | null
}

const PodcastPlanSelector: React.VFC<{
  value?: string
  defaultValue?: string
  onChange?: (podcastPlanId: string) => void
  podcastPlans: PodcastPlanProps[]
}> = ({ podcastPlans, value, defaultValue, onChange }) => {
  // trigger change event if default value exists
  useEffect(() => {
    onChange && defaultValue && onChange(defaultValue)
  }, [defaultValue, onChange])

  return (
    <div className="row">
      {podcastPlans.map(podcastPlan => {
        const isActive = podcastPlan.id === value

        return (
          <div className="col-lg-4 col-6" key={podcastPlan.id}>
            <StyledPodcastPlanLabel
              className="mb-3"
              active={isActive}
              onClick={() => onChange && onChange(podcastPlan.id)}
            >
              <h3>
                <PeriodTypeLabel periodType={podcastPlan.periodType} periodAmount={podcastPlan.periodAmount} />
              </h3>

              <span className="mr-1">
                <PriceLabel
                  variant="inline"
                  listPrice={podcastPlan.listPrice}
                  salePrice={(podcastPlan.soldAt?.getTime() || 0) > Date.now() ? podcastPlan.salePrice : undefined}
                  render={({ listPrice, salePrice, formatPrice }) => (
                    <StyledPodcastPlanPrice active={isActive}>
                      {salePrice && <span>{formatPrice(salePrice)}</span>}
                      <span>{formatPrice(listPrice)}</span>
                    </StyledPodcastPlanPrice>
                  )}
                />
              </span>
            </StyledPodcastPlanLabel>
          </div>
        )
      })}
    </div>
  )
}

export default PodcastPlanSelector

import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'
import { ProductType } from '../../types/product'

const ProductTypeFormatter: React.VFC<{ value: ProductType }> = ({ value }) => {
  const { formatMessage } = useIntl()

  switch (value) {
    case 'Program':
    case 'ProgramPlan':
    case 'ProgramContent':
      return <>{formatMessage(commonMessages.ui.programs)}</>
    case 'ProgramPackagePlan':
      return <>{formatMessage(commonMessages.ui.packages)}</>
    case 'ProjectPlan':
      return <>{formatMessage(commonMessages.ui.projects)}</>
    case 'Card':
      return <>{formatMessage(commonMessages.ui.memberCards)}</>
    case 'ActivityTicket':
      return <>{formatMessage(commonMessages.ui.activities)}</>
    case 'Merchandise':
      return <>{formatMessage(commonMessages.ui.merchandise)}</>
    case 'PodcastProgram':
      return <>{formatMessage(commonMessages.ui.podcast)}</>
    case 'PodcastPlan':
      return <>{formatMessage(commonMessages.ui.podcastSubscription)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.type)}</>
  }
}

export default ProductTypeFormatter

import React from 'react'
import { useIntl } from 'react-intl'
import { commonMessages } from '../../helpers/translation'

const PeriodTypeLabel: React.VFC<{
  periodType: 'D' | 'W' | 'M' | 'Y'
  periodAmount?: number
}> = ({ periodType, periodAmount }) => {
  const { formatMessage } = useIntl()

  if (periodAmount && periodAmount > 1) {
    switch (periodType) {
      case 'D':
        return (
          <>
            {formatMessage(
              { id: 'common.periodType.per.day', defaultMessage: '每 {periodAmount} 天' },
              { periodAmount },
            )}
          </>
        )
      case 'W':
        return (
          <>
            {formatMessage(
              { id: 'common.periodType.per.week', defaultMessage: '每 {periodAmount} 週' },
              { periodAmount },
            )}
          </>
        )
      case 'M':
        return (
          <>
            {formatMessage(
              { id: 'common.periodType.per.month', defaultMessage: '每 {periodAmount} 月' },
              { periodAmount },
            )}
          </>
        )
      case 'Y':
        return (
          <>
            {formatMessage(
              { id: 'common.periodType.per.year', defaultMessage: '每 {periodAmount} 年' },
              { periodAmount },
            )}
          </>
        )
      default:
        return <>{formatMessage(commonMessages.unknown.period)}</>
    }
  }

  switch (periodType) {
    case 'D':
      return <>{formatMessage(commonMessages.unit.perDay)}</>
    case 'W':
      return <>{formatMessage(commonMessages.unit.perWeek)}</>
    case 'M':
      return <>{formatMessage(commonMessages.unit.perMonth)}</>
    case 'Y':
      return <>{formatMessage(commonMessages.unit.perYear)}</>
    default:
      return <>{formatMessage(commonMessages.unknown.period)}</>
  }
}

export default PeriodTypeLabel

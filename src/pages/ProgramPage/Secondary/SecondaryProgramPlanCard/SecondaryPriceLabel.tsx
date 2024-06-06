import { Flex, Text } from '@chakra-ui/react'
import ShortenPeriodTypeLabel from 'lodestar-app-element/src/components/labels/ShortenPeriodTypeLabel'
import { useCurrency } from 'lodestar-app-element/src/hooks/util'
import styled from 'styled-components'
import { PeriodType } from '../../../../types/program'
import { colors } from '../style'

const DisplayPrice = styled(Text)`
  color: ${colors.orange};
  letter-spacing: 0.23px;
  font-size: 28px;
  font-weight: bold;
`
const DeletePrice = styled(Text)`
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0.18px;
  font-size: 14px;
`

const SecondaryPriceLabel: React.VFC<{
  listPrice: number
  salePrice: number | null | undefined
  currencyId: string
  periodType?: PeriodType
  periodAmount?: number | null
}> = ({ salePrice, listPrice, currencyId, periodAmount, periodType }) => {
  const { formatCurrency } = useCurrency(currencyId)

  const periodElem = !!periodType && (
    <>
      {` / ${periodAmount && periodAmount > 1 ? periodAmount : ''}`}
      <ShortenPeriodTypeLabel periodType={periodType} withQuantifier={!!periodAmount && periodAmount > 1} />
    </>
  )

  return (
    <Flex flexDirection="column" w="100%" align="center">
      {salePrice === null ? (
        <DisplayPrice>
          {formatCurrency(listPrice)}
          {periodElem}
        </DisplayPrice>
      ) : (
        <>
          <DisplayPrice>
            {formatCurrency(Number(salePrice))}
            {periodElem}
          </DisplayPrice>
          <DeletePrice as="del">
            {formatCurrency(listPrice)} {periodElem}
          </DeletePrice>
        </>
      )}
    </Flex>
  )
}

export default SecondaryPriceLabel

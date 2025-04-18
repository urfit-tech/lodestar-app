import { Box, Flex, Text } from '@chakra-ui/react'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import ShortenPeriodTypeLabel from 'lodestar-app-element/src/components/labels/ShortenPeriodTypeLabel'
import { useCurrency } from 'lodestar-app-element/src/hooks/util'
import styled from 'styled-components'
import { PeriodType } from '../../../../types/program'
import { colors } from '../style'

const StyledDisplayPrice = styled(Text)`
  color: ${colors.orange};
  letter-spacing: 0.23px;
  font-size: 28px;
  font-weight: bold;
`

const StyledPriceDescription = styled(Box)`
  letter-spacing: 0.18px;
  font-size: 14px;
`

const SecondaryPriceLabel: React.FC<{
  listPrice: number
  salePrice: number | null | undefined
  currencyId: string
  periodType?: PeriodType
  periodAmount?: number | null
  salePricePrefix?: string
  salePriceSuffix?: string
  listPricePrefix?: string
  listPriceSuffix?: string
  priceDescription?: string
}> = ({
  salePrice,
  listPrice,
  listPriceSuffix,
  listPricePrefix,
  salePricePrefix,
  salePriceSuffix,
  priceDescription,
  currencyId,
  periodAmount,
  periodType,
}) => {
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
        <>
          <StyledDisplayPrice>
            {listPricePrefix}
            {formatCurrency(listPrice)}
            {listPriceSuffix}
            {periodElem}
          </StyledDisplayPrice>
          <StyledPriceDescription>
            <BraftContent>{priceDescription}</BraftContent>
          </StyledPriceDescription>
        </>
      ) : (
        <>
          <StyledDisplayPrice>
            {salePricePrefix}
            {formatCurrency(Number(salePrice))}
            {salePriceSuffix}
            {periodElem}
          </StyledDisplayPrice>
          <StyledPriceDescription
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Text as="del">
              {listPricePrefix}
              {formatCurrency(listPrice)}
              {listPriceSuffix}
              {periodElem}
            </Text>
            <BraftContent>{priceDescription}</BraftContent>
          </StyledPriceDescription>
        </>
      )}
    </Flex>
  )
}

export default SecondaryPriceLabel

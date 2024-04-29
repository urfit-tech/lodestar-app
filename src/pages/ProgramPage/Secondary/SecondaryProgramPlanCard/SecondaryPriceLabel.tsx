import { Flex, Text } from '@chakra-ui/react'
import { useCurrency } from 'lodestar-app-element/src/hooks/util'
import styled from 'styled-components'

const DisplayPrice = styled(Text)`
  color: #ff2f1a;
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
  downPrice: number
  currencyId: string
}> = ({ salePrice, listPrice, downPrice, currencyId }) => {
  const { formatCurrency } = useCurrency(currencyId)
  const displayPrice = downPrice || salePrice || listPrice
  const deletePrice = salePrice || listPrice
  return (
    <Flex flexDirection="column" w="100%" align="center">
      <DisplayPrice>{formatCurrency(displayPrice)}</DisplayPrice>
      {deletePrice !== displayPrice && <DeletePrice as="del">{formatCurrency(deletePrice)}</DeletePrice>}
    </Flex>
  )
}

export default SecondaryPriceLabel

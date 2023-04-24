import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../../components/common/AdminCard'
import { ReactComponent as SortIcon } from '../../images/sort.svg'
import { LearnedStatistic } from '../../pages/member/LearningAchievementPage'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  display: flex;
  height: 225px;
  .ant-card-body {
    width: 100%;
  }
`

const StyledColGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
`
type TableRow = {
  title: string
  progressPercent: number
  purchasedAt: string
}

const Trow: React.FC<{ tableRow: TableRow }> = ({ tableRow }) => {
  const { title, progressPercent, purchasedAt } = tableRow
  return (
    <Tr>
      <Td>{title}</Td>
      <Td isNumeric>{progressPercent}</Td>
      <Td isNumeric>{dayjs(purchasedAt).format('YYYY-MM-DD')}</Td>
    </Tr>
  )
}
type ProgramProgressDetailCardProps = Pick<LearnedStatistic, 'productOptions'>

const ProgramProgressDetailCard: React.FC<ProgramProgressDetailCardProps> = ({ productOptions }) => {
  const { formatMessage } = useIntl()

  const [table, setTable] = useState<TableRow[]>(productOptions) // TODO: input data from graphql
  const [isDsec, setDsec] = useState<boolean>(true)

  const sortByProgress = (): void => {
    const sortedTable = cloneDeep(
      table.sort((a, b) =>
        a.progressPercent < b.progressPercent ? -1 : a.progressPercent > b.progressPercent ? 1 : 0,
      ),
    )
    isDsec ? setTable(sortedTable.reverse()) : setTable(sortedTable)
    setDsec(d => !d)
  }
  const sortByDate = (): void => {
    const sortedTable = cloneDeep(table.sort((a, b) => dayjs(a.purchasedAt).valueOf() - dayjs(b.purchasedAt).valueOf()))
    isDsec ? setTable(sortedTable.reverse()) : setTable(sortedTable)
    setDsec(d => !d)
  }

  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.ProgramProgressDetailCard.progress)}
        </Text>
        <Box overflow="auto" maxHeight="150px">
          <Table size="sm" whiteSpace="nowrap" fontSize="sm">
            <Thead position="sticky" top={0} bgColor="white">
              <Tr>
                <Th w="60%" />
                <Th w="20%" isNumeric onClick={sortByProgress}>
                  <Box display="flex" alignItems="center" justifyContent="end">
                    <Text textAlign="end" fontSize="sm">
                      {formatMessage(learningAchievementMessages.ProgramProgressDetailCard.progressRate)}
                    </Text>
                    <SortIcon />
                  </Box>
                </Th>
                <Th w="20%" isNumeric onClick={sortByDate}>
                  <Box display="flex" alignItems="center" justifyContent="end">
                    <Text textAlign="end" fontSize="sm">
                      {formatMessage(learningAchievementMessages.ProgramProgressDetailCard.purchaseDate)}
                    </Text>
                    <SortIcon />
                  </Box>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {table.map(data => (
                <Trow tableRow={data} />
              ))}
            </Tbody>
          </Table>
        </Box>
      </StyledColGrid>
    </StyledCard>
  )
}

export default ProgramProgressDetailCard

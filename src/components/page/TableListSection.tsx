import { Table } from 'react-bootstrap'
import styled from 'styled-components'
import { BREAK_POINT } from '../common/Responsive'

type TableList = {
  id: string
  padding: string
  titleInfo: {
    title: string
    fontSize: string
    letterSpacing: string
    color: string
    fontWeight: string | number
    mobileMargin: string
    desktopMargin: string
  }
  columnInfo: { columns: { name: string; title: string }[]; display: number[] }
  dataList: { title: string; list: any[] }[]
}
const StyledSection = styled.div<Pick<TableList, 'padding'>>`
  padding: ${props => props?.padding || '100px 0'};
`
const StyledTitle = styled.div<Pick<TableList, 'titleInfo'>>`
  text-align: center;
  font-size: ${props => props?.titleInfo?.fontSize || '1rem'};
  font-weight: ${props =>
    props?.titleInfo?.fontWeight
      ? typeof props.titleInfo?.fontWeight === 'string'
        ? `${props.titleInfo?.fontWeight}`
        : props.titleInfo?.fontWeight
      : 500};
  color: ${props => props?.titleInfo?.color || '#585858'};
  margin: ${props => props?.titleInfo?.mobileMargin};
  @media (min-width: ${BREAK_POINT}px) {
    margin: ${props => props?.titleInfo?.desktopMargin};
  }
`
const StyledTableWrapper = styled.div`
  overflow: auto;
  margin: 0 25px;
  @media (min-width: ${BREAK_POINT}px) {
    margin: 0;
  }
`
const StyledTableTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 0.25px;
  color: #585858;
  width: 930px;
  margin: auto;
`
const StyledTable = styled(Table)`
  margin: 0 auto 80px auto;
  width: 930px;
`

const TableListSection: React.VFC<{ options: TableList }> = ({ options }) => {
  const columns = options?.columnInfo?.columns.map(column => column.name) || []
  return (
    <StyledSection id={options?.id} className="container" padding={options?.padding}>
      <StyledTitle titleInfo={options.titleInfo}>{options.titleInfo.title || ''}</StyledTitle>
      {options.dataList.map(data => (
        <StyledTableWrapper>
          <StyledTableTitle className="mb-3">{data.title}</StyledTableTitle>
          <StyledTable responsive>
            <thead>
              <tr>
                {options.columnInfo.columns.map((column, index) => (
                  <th>{options.columnInfo.display.includes(index) ? column.title : ''}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.list.map(v => (
                <tr>
                  {columns.map(column => (
                    <td>{v[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </StyledTableWrapper>
      ))}
    </StyledSection>
  )
}

export default TableListSection

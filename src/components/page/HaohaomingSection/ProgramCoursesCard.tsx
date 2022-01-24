import { Typography } from 'antd'
import styled from 'styled-components'

const StyledCard = styled.div`
  margin-bottom: 30px;
  width: 300px;
  background-color: #fff;
  text-align: left;
`

const StyledCardImg = styled.div`
  height: 220px;
  overflow: hidden;
  background-size: contain;
`

const StyledCardTitle = styled.div`
  font-size: 19px;
  margin-bottom: 24px;
`

const StyledCardText = styled.div`
  margin-bottom: 40px;
  max-height: 50px;
  overflow: hidden;
  color: #9b9b9b;
  line-height: 24px;
  text-align: justify;
  letter-spacing: 0.4px;
`

const ProgramCoursesCard: React.FC<{
  cover: string
  title: string
  text: string
  salePrice: number
  listPrice: number
}> = ({ cover, title, text, salePrice, listPrice }) => {
  return (
    <StyledCard>
      <StyledCardImg style={{ backgroundImage: `url(${cover})` }} />
      <div style={{ padding: '24px' }}>
        <StyledCardTitle>
          <Typography.Text strong>{title}</Typography.Text>
        </StyledCardTitle>

        <StyledCardText>
          <Typography.Text type="secondary">{text}</Typography.Text>
        </StyledCardText>

        {/* <Typography.Text strong className="pr-1" style={{ color: '#eb527a' }}>
          <NumberFormat value={salePrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </Typography.Text>

        <Typography.Text strong delete>
          <NumberFormat value={listPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </Typography.Text> */}
      </div>
    </StyledCard>
  )
}

export default ProgramCoursesCard

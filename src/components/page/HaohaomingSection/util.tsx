import { Typography } from 'antd'
import { AvatarProps } from 'antd/lib/avatar'
import styled from 'styled-components'

const TitleWrapper = styled.div`
  @media (max-width: 768px) {
    text-align: center;
  }
`

const Title = styled(Typography.Title)`
  font-size: 24px !important;
  margin-bottom: 8px;
`

const SubTitle = styled.div`
  color: ${props => props.theme['@primary-color']};
  font-size: 14px;
  letter-spacing: 0.6px;
`

export const SectionTitle: React.FC<{
  title: string
  subtitle?: string
  margin?: boolean
  className?: string
}> = ({ title, subtitle, margin = true, className }) => (
  <TitleWrapper style={{ marginBottom: margin ? '50px' : '0' }} className={className}>
    <Title level={2}>{title}</Title>
    <SubTitle>{subtitle}</SubTitle>
  </TitleWrapper>
)

export const Content = styled.div`
  p {
    margin-bottom: 1em;
  }
`
export const StyledAvatar = styled.div<AvatarProps>`
  flex: 0 0 ${props => props.size}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
`

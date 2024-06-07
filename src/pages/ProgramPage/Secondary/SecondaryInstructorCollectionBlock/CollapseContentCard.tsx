import { Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ProgramCover } from '../../../../components/common/Image'
import { colors } from '../style'

const StyledCard = styled(Link)`
  width: 98%;
  height: 85px;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
  background-color: #fff;
  display: flex;
  gap: 16px;
  justify-content: start;
  align-items: center;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  color: ${colors.gray1};
`

const ImageWrapper = styled(Box)`
  width: 100px;
  border-radius: 4px;
`

const CollapseContentCard: React.VFC<{ href: string; imgSrc?: string; children: React.ReactNode | string }> = ({
  imgSrc,
  children,
  href,
}) => {
  return (
    <StyledCard to={href}>
      <ImageWrapper>
        <ProgramCover width="100%" height="100%" paddingTop="calc(100% * 9/16)" src={imgSrc} shape="rounded" />
      </ImageWrapper>
      {children}
    </StyledCard>
  )
}

export default CollapseContentCard

import { Icon, IconButton } from '@chakra-ui/react'
import styled, { css } from 'styled-components'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { ReactComponent as HeartFillIcon } from '../../images/icon-heart.svg'

const StyledIconButton = styled(IconButton)<{ isActive?: boolean; defaultColor?: string }>`
  &&& {
    border: 1px solid ${props => (props.isActive ? props.theme['@primary-color'] : 'var(--gray)')};
    color: ${props =>
      props.isActive ? props.theme['@primary-color'] : props.defaultColor ? props.defaultColor : 'var(--gray)'};
    border-radius: 50%;
    background: white;
  }
`
const StyledIcon = styled(Icon)`
  margin-top: 2px;
`
const StyledLikedCount = styled.span<{ isActive?: boolean }>`
  color: var(--gray-dark);
  font-size: 12px;
  font-weight: 500;

  ${props =>
    props.isActive &&
    css`
      color: ${props.theme['@primary-color']};
      text-shadow: 0 0 3px ${props.theme['@primary-color']}33;
    `}
`

const LikedCountButton: React.VFC<{ onClick: () => void; isLiked: boolean; count: number; defaultColor?: string }> = ({
  onClick,
  isLiked,
  count,
  defaultColor,
}) => {
  return (
    <div onClick={onClick}>
      <StyledIconButton
        variant="ghost"
        isActive={isLiked}
        defaultColor={defaultColor}
        icon={<StyledIcon as={isLiked ? HeartFillIcon : HeartIcon} />}
        className="mr-2"
      />
      <StyledLikedCount isActive={isLiked}>{count}</StyledLikedCount>
    </div>
  )
}

export default LikedCountButton

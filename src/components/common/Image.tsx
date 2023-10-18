import styled from 'styled-components'
import DefaultAvatar from '../../images/avatar.svg'

type AvatarImageProps = {
  src?: string | null
  size?: string | number
  shape?: 'circle' | 'square'
  background?: string
}
export const AvatarImage = styled.div<AvatarImageProps>`
  ${props => {
    if (typeof props.size === 'number') {
      return `width: ${props.size}px; height: ${props.size}px;`
    }

    return `width: ${props.size || '2rem'}; height: ${props.size || '2rem'};`
  }}
  background-color: ${props => props.background || '#ccc'};
  background-image: url(${props => props.src || DefaultAvatar});
  background-size: cover;
  background-position: center;
  border-radius: ${props => (props.shape === 'square' ? '4px' : '50%')};
`

type CustomRatioImageProps = {
  margin?: string
  width: string
  height?: string
  ratio: number
  src: string
  shape?: 'rounded' | 'circle'
  disabled?: boolean
}
export const CustomRatioImage = styled.div<CustomRatioImageProps>`
  padding-top: calc(${props => props.width} * ${props => props.ratio});
  margin: ${props => props.margin};
  width: ${props => props.width};
  height: ${props => props.height};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  ${props =>
    props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : ''};
  opacity: ${props => props.disabled && 0.4};
`

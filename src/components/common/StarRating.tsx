import { Icon } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import { ReactComponent as StarGrayIcon } from '../../images/star-gray.svg'
import { ReactComponent as StarHalfIcon } from '../../images/star-half.svg'
import { ReactComponent as StarIcon } from '../../images/star.svg'

const StyledStarRating = styled.div`
  && svg {
    margin-right: 2px;
  }
  svg:last-child {
    margin-right: 4px;
  }
`

const StarRating: React.FC<{ score: number; boxSize?: string }> = ({ score, boxSize }) => {
  let starLists = []
  for (let i = 0; i < Math.floor(score); i++) {
    starLists.push(<Icon key={uuid()} boxSize={boxSize} as={StarIcon} />)
  }
  if (score - Math.floor(score) > 0) starLists.push(<Icon key={uuid()} boxSize={boxSize} as={StarHalfIcon} />)
  if (starLists.length < 5) {
    for (let i = starLists.length; i < 5; i++) {
      starLists.push(<Icon key={uuid()} boxSize={boxSize} as={StarGrayIcon} />)
    }
  }
  return <StyledStarRating className="d-flex">{starLists}</StyledStarRating>
}

export default StarRating

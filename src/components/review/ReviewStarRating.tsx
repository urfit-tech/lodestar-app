import { Icon } from '@chakra-ui/react'
import React from 'react'
import { v4 as uuid } from 'uuid'
import { ReactComponent as StarGrayIcon } from '../../images/star-gray.svg'
import { ReactComponent as StarIcon } from '../../images/star.svg'

const ReviewStarRating: React.FC<{ score: number; boxSize?: string }> = ({ score, boxSize }) => {
  let starLists = []
  for (let i = 0; i < score; i++) {
    starLists.push(<Icon key={uuid()} boxSize={boxSize} style={{ marginRight: '2px' }} as={StarIcon} />)
  }
  if (starLists.length < 5) {
    for (let i = starLists.length; i < 5; i++) {
      starLists.push(<Icon key={uuid()} boxSize={boxSize} style={{ marginRight: '2px' }} as={StarGrayIcon} />)
    }
  }
  return <div className="d-flex">{starLists}</div>
}

export default ReviewStarRating

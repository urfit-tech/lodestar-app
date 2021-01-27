import { Box, Icon, Link } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import EmptyCover from '../../images/empty-cover.png'
import { ReactComponent as CommentIcon } from '../../images/icon-comment.svg'
import { ReactComponent as HeartIcon } from '../../images/icon-heart-o.svg'
import { PracticePreviewProps } from '../../types/practice'
import { CustomRatioImage } from '../common/Image'

const StyledWrapper = styled(Box)`
  box-shadow: 0 2px 10px 0 var(--gray);
  user-select: none;
`
const StyledLink = styled(Link)`
  &&:hover {
    text-decoration: none;
  }
  &&:focus {
    box-shadow: none;
  }
`
const StyledTitle = styled.div`
  line-height: 1.7;
  color: var(--gray-darker);
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s;
`
const StyledName = styled.div`
  font-size: 12px;
  font-weight: 500;
`
const StyledGroup = styled(Box)`
  line-height: 1;
  font-size: 12px;
  color: var(--gray-dark);
`
const PracticeAdminCard: React.FC<PracticePreviewProps> = ({
  id,
  coverUrl,
  title,
  name,
  suggestCount,
  reactedMemberIdsCount,
}) => {
  return (
    <StyledWrapper borderRadius="4px" bg="#ffffff">
      <StyledLink href={`/practices/${id}`} isExternal>
        <CustomRatioImage width="100%" ratio={9 / 16} src={coverUrl || EmptyCover} className="mb-3" />
        <StyledTitle className="mx-3">{title}</StyledTitle>

        <div className="d-flex justify-content-between p-3">
          <StyledName>{name}</StyledName>
          <StyledGroup className="d-flex align-items-end">
            <div className="mr-2">
              <Icon as={CommentIcon} className="mr-1" />
              <span>{suggestCount}</span>
            </div>

            <div>
              <Icon as={HeartIcon} className="mr-1" />
              <span>{reactedMemberIdsCount}</span>
            </div>
          </StyledGroup>
        </div>
      </StyledLink>
    </StyledWrapper>
  )
}

export default PracticeAdminCard

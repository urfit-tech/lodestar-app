import { useQuery } from '@apollo/react-hooks'
import { Icon } from 'antd'
import gql from 'graphql-tag'
import { flatten, uniqBy } from 'ramda'
import React from 'react'
import { useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { AvatarImage } from '../../components/common/Image'
import hasura from '../../hasura'
import { productMessages } from '../../helpers/translation'

const StyledSubTitle = styled.h2`
  color: var(--gray-darker);
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.2px;
`
const StyledCreatorName = styled.div`
  overflow: hidden;
  white-space: nowrap;
  color: var(--gray-darker);
  line-height: 1.5;
  letter-spacing: 0.2px;
  text-overflow: ellipsis;
`
const StyledIcon = styled(Icon)`
  color: ${props => props.theme['@primary-color']};
`

const PopularPodcastCollection: React.FC = () => {
  const { formatMessage } = useIntl()
  const { loading, error, data } = useQuery<hasura.GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION>(
    GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION,
  )

  const creators: {
    id: string
    avatarUrl?: string | null
    name: string
  }[] =
    loading || error || !data
      ? []
      : uniqBy(
          creator => creator.id,
          flatten(
            data.podcast_program.map(podcastProgram =>
              podcastProgram.podcast_program_roles.map(role => ({
                id: role.member?.id || '',
                avatarUrl: role.member?.picture_url,
                name: role.member?.name || '',
              })),
            ),
          ),
        )

  return (
    <div>
      <StyledSubTitle className="mb-4">{formatMessage(productMessages.podcast.title.hottest)}</StyledSubTitle>

      {creators.map(creator => (
        <Link
          key={creator.id}
          to={`/creators/${creator.id}?tabkey=podcasts`}
          className="d-flex align-items-center justify-content-between mb-3"
        >
          <AvatarImage size={64} src={creator.avatarUrl} className="flex-shrink-0 mr-4" />
          <StyledCreatorName className="flex-grow-1 mr-3">{creator.name}</StyledCreatorName>
          <StyledIcon type="right" />
        </Link>
      ))}
    </div>
  )
}

const GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION = gql`
  query GET_PODCAST_PROGRAM_INSTRUCTOR_COLLECTION {
    podcast_program(where: { podcast_program_roles: { name: { _eq: "instructor" } } }) {
      id
      podcast_program_roles {
        member {
          id
          picture_url
          name
          username
        }
      }
    }
  }
`

export default PopularPodcastCollection

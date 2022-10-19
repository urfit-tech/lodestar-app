import { useQuery } from '@apollo/react-hooks'
import { Box, Divider, Flex, Icon, Image, Spacer } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { gql } from 'graphql-tag'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { useAppTheme } from 'lodestar-app-element/src/contexts/AppThemeContext'
import { useState } from 'react'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { DeepPick } from 'ts-deep-pick/lib'
import LikesCountButton from '../../components/common/LikedCountButton'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import DefaultLayout from '../../components/layout/DefaultLayout'
import CreatorCard from '../../containers/common/CreatorCard'
import hasura from '../../hasura'
import { CalendarOIcon, EyeIcon, UserOIcon } from '../../images'
import { Project } from '../../types/project'
import LoadingPage from '../LoadingPage'

// @ts-ignore
type Portfolio = DeepPick<
  Project,
  | 'id'
  | 'title'
  | 'description'
  | 'coverUrl'
  | 'views'
  | 'createdAt'
  | 'creator.id'
  | 'creator.name'
  | 'creator.pictureUrl'
  | 'projectTags.[].id'
  | 'projectTags.[].name'
  | 'projectRoles.[].id'
  | 'projectRoles.[].member.[].id'
  | 'projectRoles.[].member.[].name'
  | 'projectRoles.[].member.[].pictureUrl'
  | 'projectRoles.[].identity.[].id'
  | 'projectRoles.[].identity.[].name'
>

const PortfolioPage: React.VFC<Pick<Project, 'id'>> = ({ id }) => {
  const { loading, portfolio, error } = useProjectPortfolio(id)
  const [isLiked, setIsLiked] = useState(false)
  const theme = useAppTheme()

  const handleLikeStatus = async () => {
    if (isLiked) {
      // await deletePortfolioReaction()
      setIsLiked(false)
    } else {
      // await insertPortfolioReaction()
      setIsLiked(true)
    }
    // await refetchPortfolio()
  }

  if (loading) return <LoadingPage />
  if (error) return <></>

  return (
    <DefaultLayout white>
      <Box bg="#000" p="2.5rem" mb="2.5rem">
        <Box className="container">
          {portfolio.coverUrl && (
            <Box position="relative" pt="56.25%">
              <Box position="absolute" top="0" right="0" bottom="0" left="0" bg="#000">
                <ReactPlayer url={portfolio.coverUrl} width="100%" height="100%" controls />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box className="container">
        <Box className="row justify-content-center">
          <Box className="col-12 col-lg-9">
            <Flex mb="3rem" alignItems="center">
              <Flex>
                <Image
                  src={portfolio.creator?.pictureUrl || ''}
                  alt={portfolio.creator?.name}
                  boxSize="3rem"
                  borderRadius="1.5rem"
                  backgroundPosition="center"
                  backgroundSize="cover"
                  backgroundColor="#ccc"
                />

                <Box ml="0.75rem">
                  <Box>{portfolio.title}</Box>
                  <Flex color="var(--gray-dark)" fontSize="14px" letterSpacing="0.4px">
                    <Flex alignItems="center" mr="0.75rem">
                      <Icon as={UserOIcon} mr="0.25rem" />
                      <Box>{portfolio.creator?.name}</Box>
                    </Flex>
                    <Flex alignItems="center" mr="0.75rem">
                      <Icon as={CalendarOIcon} mr="0.25rem" />
                      <Box>{dayjs(portfolio.createdAt).format('YYYY-MM-DD')}</Box>
                    </Flex>
                    <Flex alignItems="center" mr="0.75rem">
                      <Icon as={EyeIcon} mr="0.25rem" />
                      <Box>{portfolio.views}</Box>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>

              <Spacer />

              <Flex>
                <SocialSharePopover url={window.location.href} color={theme.colors.primary[500]} />
                <LikesCountButton
                  onClick={handleLikeStatus}
                  count={0}
                  isLiked={isLiked}
                  defaultColor={theme.colors.primary[500]}
                />
              </Flex>
            </Flex>

            <Box mb="2.5rem">
              <BraftContent>{portfolio.description}</BraftContent>
            </Box>

            <Flex mb="1.5rem">
              <Flex alignItems="center" color="primary.500">
                {portfolio.projectTags.map(tag => (
                  <Link key={tag.name} to={`/posts/?tags=${tag}`} className="mr-2">
                    <Box as="span" fontSize="14px" lineHeight="22px" letterSpacing="0.4px">
                      #{tag.name}
                    </Box>
                  </Link>
                ))}
              </Flex>
              <Spacer />

              <Flex>
                <SocialSharePopover url={window.location.href} color={theme.colors.primary[500]} />
                <LikesCountButton
                  onClick={handleLikeStatus}
                  count={0}
                  isLiked={isLiked}
                  defaultColor={theme.colors.primary[500]}
                />
              </Flex>
            </Flex>

            <Divider />

            <Box>參與者</Box>

            <Box>
              <CreatorCard id={portfolio.creator?.id || ''} />
            </Box>
          </Box>
        </Box>
      </Box>
      <Box bg="#f7f8f8">相關分類</Box>
    </DefaultLayout>
  )
}

const useProjectPortfolio = (projectId: string) => {
  const { loading, data, error } = useQuery<hasura.GET_PROJECT_PORTFOLIO, hasura.GET_PROJECT_PORTFOLIOVariables>(
    gql`
      query GET_PROJECT_PORTFOLIO($id: uuid!) {
        project_by_pk(id: $id) {
          id
          title
          description
          cover_url
          views
          created_at
          creator {
            id
            name
            picture_url
          }
          project_tags(order_by: { position: asc }) {
            id
            tag_name
            tag {
              name
              project_tags {
                project {
                  id
                  title
                  cover_url
                  creator {
                    id
                    name
                    picture_url
                  }
                }
              }
            }
          }
          project_roles {
            id
            member {
              id
              name
              picture_url
            }
            identity {
              id
              name
            }
          }
        }
      }
    `,
    { variables: { id: projectId } },
  )

  const portfolio: Portfolio = {
    id: data?.project_by_pk?.id,
    title: data?.project_by_pk?.title || '',
    description: data?.project_by_pk?.description || null,
    coverUrl: data?.project_by_pk?.cover_url || null,
    views: data?.project_by_pk?.views,
    createdAt: new Date(data?.project_by_pk?.created_at),
    creator: {
      id: data?.project_by_pk?.creator?.id || '',
      name: data?.project_by_pk?.creator?.name || '',
      pictureUrl: data?.project_by_pk?.creator?.picture_url || null,
    },
    projectTags:
      data?.project_by_pk?.project_tags.map(v => ({
        id: v.id,
        name: v.tag_name,
      })) || [],
    projectRoles:
      data?.project_by_pk?.project_roles.map(v => ({
        id: v.id,
        member: {
          name: v.member?.name || '',
          pictureUrl: v.member?.picture_url || null,
        },
        identity: {
          name: v.identity.name,
        },
      })) || [],
  }
  return {
    loading,
    error,
    portfolio,
  }
}

export default PortfolioPage

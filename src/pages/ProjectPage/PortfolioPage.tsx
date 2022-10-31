import { useQuery } from '@apollo/react-hooks'
import { Box, Divider, Flex, Icon, Image, Spacer } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { gql } from 'graphql-tag'
import { BraftContent } from 'lodestar-app-element/src/components/common/StyledBraftEditor'
import { flatten, groupBy, prop, uniqBy } from 'ramda'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import ReactPlayer from 'react-player'
import { Link } from 'react-router-dom'
import { DeepPick } from 'ts-deep-pick/lib'
import LikesCountButton from '../../components/common/LikedCountButton'
import SocialSharePopover from '../../components/common/SocialSharePopover'
import DefaultLayout from '../../components/layout/DefaultLayout'
import CreatorCard from '../../containers/common/CreatorCard'
import hasura from '../../hasura'
import { handleError } from '../../helpers'
import { useMutateProject } from '../../hooks/project'
import { CalendarOIcon, EyeIcon, UserOIcon } from '../../images'
import EmptyAvatar from '../../images/avatar.svg'
import EmptyCover from '../../images/empty-cover.png'
import { Project } from '../../types/project'
import LoadingPage from '../LoadingPage'
import pageMessages from '../translation'

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
  | 'projectRoles.[].member.id'
  | 'projectRoles.[].member.name'
  | 'projectRoles.[].member.pictureUrl'
  | 'projectRoles.[].identity.id'
  | 'projectRoles.[].identity.name'
  | 'projectReactions.[].id'
  | 'projectReactions.[].member.id'
> & {
  relatedProjects: {
    id: string
    previewUrl: string | null
    title: string
    creator: { id: string; name: string; pictureUrl: string | null }
  }[]
}

const PortfolioPage: React.VFC<Pick<Project, 'id'>> = ({ id }) => {
  const { formatMessage } = useIntl()
  const [isLiked, setIsLiked] = useState(false)
  const { loading, portfolio, error, refetch } = useProjectPortfolio(id)
  const { insertProjectReaction, deleteProjectReaction, addProjectView } = useMutateProject(id)

  const handleLikeStatus = async () => {
    if (isLiked) {
      await deleteProjectReaction()
      setIsLiked(false)
    } else {
      await insertProjectReaction()
      setIsLiked(true)
    }
    await refetch()
  }

  try {
    const visitedProjects = JSON.parse(sessionStorage.getItem('kolable.project.portfolio.visited') || '[]') as string[]
    if (!visitedProjects.includes(id)) {
      visitedProjects.push(id)
      sessionStorage.setItem('kolable.project.portfolio.visited', JSON.stringify(visitedProjects))
      addProjectView()
    }
  } catch (error) {
    handleError(error)
  }

  return (
    <DefaultLayout white>
      {loading ? (
        <LoadingPage />
      ) : error ? (
        <Flex justifyContent="center" alignItems="center" h="100%" w="100%">
          {formatMessage(pageMessages.PortfolioPage.loadingPortfolioPageError)}
        </Flex>
      ) : (
        <>
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
                  <Image
                    src={portfolio.creator?.pictureUrl || EmptyAvatar}
                    alt={portfolio.creator?.name}
                    boxSize="3rem"
                    borderRadius="1.5rem"
                    backgroundColor="#ccc"
                    objectFit="cover"
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

                {portfolio.description ? (
                  <Box mb="2.5rem">
                    <BraftContent>{portfolio.description}</BraftContent>
                  </Box>
                ) : null}

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
                    {/* TODO: apply tag */}
                    {/* <ApplyTagButton /> */}
                    <SocialSharePopover url={window.location.href} />
                    <LikesCountButton
                      onClick={handleLikeStatus}
                      count={portfolio.projectReactions.length}
                      isLiked={isLiked}
                    />
                  </Flex>
                </Flex>
                {portfolio.projectRoles.length === 0 ? null : (
                  <>
                    <Divider />

                    <Box mt="1.5rem">
                      <Flex>
                        <Box
                          fontSize="18px"
                          letterSpacing="0.8px"
                          color="var(--gray-darker)"
                          fontWeight="bold"
                          mb="1.25rem"
                        >
                          {formatMessage(pageMessages.PortfolioPage.participant)}
                        </Box>
                        <Spacer />

                        {/*
                        TODO: apply tag 
                        <Box>
                        <Icon as={TicketOIcon} color="primary.500" mr="0.5rem" />
                        <Box as="span" fontSize="14px" lineHeight="22px" color="primary.500" fontWeight="500">
                          申請標記
                        </Box>
                      </Box> */}
                      </Flex>
                      {Object.entries(groupBy(role => role.identity.id, portfolio.projectRoles)).map((roles, index) => (
                        <Box key={index}>
                          <Box mb="0.75rem" color="var(--gray-darker)" fontWeight="500">
                            {roles?.[1]?.[0].identity.name}
                          </Box>
                          <Box mb="1.25rem">
                            <Flex flexWrap="wrap">
                              {roles?.[1].map((role, index) => (
                                <Box
                                  key={index}
                                  display="inline-flex"
                                  py="0.25rem"
                                  pl="0.25rem"
                                  pr="1rem"
                                  alignItems="center"
                                  border="solid 1px #ececec"
                                  borderRadius="22px"
                                  mr="0.75rem"
                                >
                                  <Image
                                    src={role.member.pictureUrl || EmptyAvatar}
                                    alt={role.member.name}
                                    w="2.25rem"
                                    h="2.25rem"
                                    borderRadius="50%"
                                    mr="0.75rem"
                                    objectFit="cover"
                                  />
                                  <Box color="var(--gray-darker)">{role.member.name}</Box>
                                </Box>
                              ))}
                            </Flex>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}

                <Divider />

                <Box pt="2.5rem" pb="5rem">
                  <CreatorCard id={portfolio.creator?.id || ''} noPadding={true} />
                </Box>
              </Box>
            </Box>
          </Box>

          {portfolio.relatedProjects.length === 0 ? null : (
            <Box bg="#f7f8f8">
              <Box className="container">
                <Box className="row justify-content-center">
                  <Box className="col-12 col-lg-9" my="4rem">
                    <Box mb="1rem" fontSize="18px" color="var(--gray-darker)" letterSpacing="0.8px" fontWeight="bold">
                      {formatMessage(pageMessages.PortfolioPage.relatedPortfolios)}
                    </Box>
                    <Flex>
                      {portfolio.relatedProjects.map((relatedProject, index) => (
                        <Box w="calc( (100% - 3rem) / 3)" mr={index === 2 ? '0' : '1rem'}>
                          <Link to={`/projects/${relatedProject.id}`}>
                            <Image
                              src={relatedProject.previewUrl || EmptyCover}
                              mb="0.75rem"
                              h="calc(100% * 2/3)"
                              objectFit="cover"
                            />
                            <Box key={index} mb="1rem" noOfLines={2}>
                              {relatedProject.title}
                            </Box>
                            <Flex alignItems="center">
                              <Image
                                src={relatedProject.creator.pictureUrl || EmptyAvatar}
                                alt={relatedProject.creator.name}
                                w="1.5rem"
                                h="1.5rem"
                                borderRadius="50%"
                                mr="0.5rem"
                                objectFit="cover"
                              />
                              <Box fontSize="14px" color="var(--gray-dark)" letterSpacing="0.4px">
                                {relatedProject.creator.name}
                              </Box>
                            </Flex>
                          </Link>
                        </Box>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </DefaultLayout>
  )
}

const useProjectPortfolio = (projectId: string) => {
  const { loading, data, error, refetch } = useQuery<
    hasura.GET_PROJECT_PORTFOLIO,
    hasura.GET_PROJECT_PORTFOLIOVariables
  >(
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
          project_tags(
            where: {
              tag: { project_tags: { project: { type: { _eq: "portfolio" }, published_at: { _lt: "now()" } } } }
            }
            order_by: { position: asc }
            limit: 3
          ) {
            id
            tag_name
            tag {
              name
              project_tags {
                project {
                  id
                  type
                  published_at
                  title
                  cover_url
                  preview_url
                  creator {
                    id
                    name
                    picture_url
                  }
                }
              }
            }
          }
          project_roles(where: { identity: { name: { _neq: "author" } } }, order_by: { identity: { position: asc } }) {
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
          project_reactions {
            id
            member_id
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
          id: v.member?.id || '',
          name: v.member?.name || '',
          pictureUrl: v.member?.picture_url || null,
        },
        identity: {
          id: v.identity.id,
          name: v.identity.name,
        },
      })) || [],
    projectReactions:
      data?.project_by_pk?.project_reactions.map(v => ({
        id: v.id,
        member: {
          id: v?.member_id,
        },
      })) || [],
    relatedProjects: uniqBy(
      prop('id'),
      flatten(
        data?.project_by_pk?.project_tags.map(
          v =>
            v.tag?.project_tags
              .filter(
                w =>
                  w.project?.type === 'portfolio' &&
                  w.project.published_at &&
                  new Date(w.project.published_at).getTime() < Date.now() &&
                  w.project.id !== projectId,
              )
              .map(x => ({
                id: x.project?.id || '',
                title: x.project?.title || '',
                previewUrl: x.project?.preview_url || null,
                creator: {
                  id: x.project?.creator?.id || '',
                  name: x.project?.creator?.name || '',
                  pictureUrl: x.project?.creator?.picture_url || null,
                },
              })) || [],
        ) || [],
      ),
    ),
  }

  return {
    loading,
    error,
    portfolio,
    refetch,
  }
}

export default PortfolioPage

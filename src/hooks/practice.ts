import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import hasura from '../hasura'
import { notEmpty } from '../helpers'
import { PracticePreviewProps, PracticeProps } from '../types/practice'
import { ProgramRoleName } from '../types/program'

export const usePracticeExist = (options: {
  practiceId?: string
  memberId?: string | null
  programContentId?: string
}) => {
  const { loading, error, data } = useQuery<hasura.GetPracticeExist, hasura.GetPracticeExistVariables>(
    gql`
      query GetPracticeExist($practiceId: uuid!, $memberId: String!, $programContentId: uuid!) {
        practice(
          where: {
            id: { _eq: $practiceId }
            member_id: { _eq: $memberId }
            program_content_id: { _eq: $programContentId }
          }
        ) {
          id
        }
      }
    `,
    {
      variables: {
        practiceId: options.practiceId,
        memberId: options.memberId || '',
        programContentId: options.programContentId,
      },
    },
  )
  const practiceIds = data?.practice.map(v => v.id)
  return {
    loading,
    error,
    practiceIds,
  }
}

export const usePractice = (options: { practiceId?: string; memberId?: string | null; programContentId?: string }) => {
  const { loading, error, data, refetch } = useQuery<hasura.GET_PRACTICE, hasura.GET_PRACTICEVariables>(GET_PRACTICE, {
    variables: {
      practiceId: options.practiceId,
      memberId: options.memberId,
      programContentId: options.programContentId,
    },
  })

  const practice: PracticeProps | null = data?.practice[0]
    ? {
        id: data.practice[0].id,
        title: data.practice[0].title,
        createdAt: new Date(data.practice[0].created_at),
        coverUrl: data.practice[0].cover_url || null,
        description: data.practice[0].description || '',
        memberId: data.practice[0].member_id,
        programContentId: data.practice[0].program_content.id,
        programContentTitle: data.practice[0].program_content.title,
        programId: data.practice[0].program_content.program_content_section.program.id,
        programRoles: data.practice[0].program_content.program_content_section.program.program_roles.map(
          programRole => ({
            id: programRole.id,
            name: programRole.name as ProgramRoleName,
            memberId: programRole.member_id,
          }),
        ),
        programTitle: data.practice[0].program_content.program_content_section.program.title,
        reactedMemberIds: data.practice[0].practice_reactions.map(w => w.member_id),
        reactedMemberIdsCount: data.practice[0].practice_reactions_aggregate.aggregate?.count || 0,
        attachments: data.practice[0].practice_attachments.map(u => ({
          id: u.attachment_id,
          data: u.data,
          options: u.options,
        })),
        isCoverRequired: !!data.practice[0].program_content.metadata?.isCoverRequired,
        suggestCount: data.practice[0].practice_suggests_aggregate.aggregate?.count || 0,
        suggests: data.practice[0].practice_suggests
          .map(w => w.suggest)
          .filter(notEmpty)
          .map(v => ({
            id: v.id,
            description: v.description || '',
            memberId: v.member_id,
            createdAt: new Date(v.created_at),
            reactedMemberIds: v.suggest_reactions.map(w => w.member_id) || [],
            suggestReplies:
              v.suggest_replies.map(y => ({
                id: y.id,
                memberId: y.member_id,
                content: y.content,
                createdAt: y.created_at,
                reactedMemberIds: y.suggest_reply_reactions.map(w => w.member_id),
              })) || [],
            suggestReplyCount: v.suggest_replies_aggregate.aggregate?.count || 0,
          })),
      }
    : null

  return {
    loadingPractice: loading,
    errorPractice: error,
    practice,
    refetchPractice: refetch,
  }
}

export const usePracticeCollection = (options: {
  programId?: string
  memberId?: string | null
  programContentId?: string
}) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_PRACTICE_COLLECTION,
    hasura.GET_PRACTICE_COLLECTIONVariables
  >(GET_PRACTICE_COLLECTION, {
    variables: {
      programContentId: options.programContentId,
      memberId: options.memberId,
      programId: options.programId,
    },
  })
  const practiceCollection: PracticePreviewProps[] =
    data?.practice.map(v => ({
      id: v.id,
      title: v.title,
      createdAt: new Date(v.created_at),
      coverUrl: v.cover_url || null,
      memberId: v.member_id,
      suggestCount: v.practice_issues_aggregate.aggregate?.count || 0,
      reactedMemberIds: v.practice_reactions.map(w => w.member_id),
      reactedMemberIdsCount: v.practice_reactions_aggregate.aggregate?.count || 0,
      isCoverRequired: !!v.program_content.metadata?.isCoverRequired,
    })) || []

  return {
    loadingPracticeCollection: loading,
    errorPracticeCollection: error,
    practiceCollection,
    refetchPracticeCollection: refetch,
  }
}

export const useMutatePractice = (practiceId: string) => {
  const { currentMemberId } = useAuth()
  const [insertPracticeHandler] = useMutation<hasura.INSERT_PRACTICE, hasura.INSERT_PRACTICEVariables>(INSERT_PRACTICE)
  const [updatePracticeHandler] = useMutation<hasura.UPDATE_PRACTICE, hasura.UPDATE_PRACTICEVariables>(UPDATE_PRACTICE)
  const [deletePracticeHandler] = useMutation<hasura.DELETE_PRACTICE, hasura.DELETE_PRACTICEVariables>(DELETE_PRACTICE)
  const [insertPracticeReactionHandler] = useMutation<
    hasura.INSERT_PRACTICE_REACTION,
    hasura.INSERT_PRACTICE_REACTIONVariables
  >(INSERT_PRACTICE_REACTION)
  const [deletePracticeReactionHandler] = useMutation<
    hasura.DELETE_PRACTICE_REACTION,
    hasura.DELETE_PRACTICE_REACTIONVariables
  >(DELETE_PRACTICE_REACTION)
  const insertPractice = ({
    title,
    memberId,
    description,
    programContentId,
  }: {
    title: string
    memberId: string
    description: string
    programContentId: string
  }) => {
    return insertPracticeHandler({
      variables: {
        memberId,
        title,
        description,
        programContentId,
      },
    })
  }
  const updatePractice = (props: { title: string; description: string; coverUrl: string | null }) => {
    return updatePracticeHandler({
      variables: {
        practiceId,
        coverUrl: props.coverUrl,
        title: props.title,
        description: props.description || '',
      },
    })
  }

  const deletePractice = () => {
    return deletePracticeHandler({
      variables: { practiceId },
    })
  }

  const insertPracticeReaction = () => {
    return insertPracticeReactionHandler({
      variables: { practiceId, memberId: currentMemberId || '' },
    })
  }

  const deletePracticeReaction = () => {
    return deletePracticeReactionHandler({
      variables: { practiceId, memberId: currentMemberId || '' },
    })
  }

  return {
    insertPractice,
    updatePractice,
    deletePractice,
    insertPracticeReaction,
    deletePracticeReaction,
    updatePracticeHandler,
  }
}

const GET_PRACTICE = gql`
  query GET_PRACTICE($practiceId: uuid, $memberId: String, $programContentId: uuid) {
    practice(
      where: {
        id: { _eq: $practiceId }
        member_id: { _eq: $memberId }
        program_content_id: { _eq: $programContentId }
        is_deleted: { _eq: false }
      }
      order_by: { updated_at: desc }
    ) {
      id
      title
      cover_url
      created_at
      updated_at
      member_id
      description
      practice_reactions {
        member_id
      }
      practice_reactions_aggregate {
        aggregate {
          count
        }
      }
      program_content {
        id
        title
        metadata
        program_content_section {
          program {
            id
            title
            program_roles {
              id
              name
              member_id
            }
          }
        }
      }
      practice_attachments(where: { data: { _is_null: false } }) {
        attachment_id
        data
        options
      }
      practice_suggests_aggregate: practice_issues_aggregate {
        aggregate {
          count
        }
      }
      practice_suggests: practice_issues(order_by: { issue: { created_at: desc } }) {
        suggest: issue {
          id
          description
          created_at
          member_id
          suggest_reactions: issue_reactions {
            id
            member_id
          }
          suggest_replies_aggregate: issue_replies_aggregate {
            aggregate {
              count
            }
          }
          suggest_replies: issue_replies(order_by: [{ created_at: asc }]) {
            id
            content
            created_at
            member_id
            suggest_reply_reactions: issue_reply_reactions {
              member_id
            }
          }
        }
      }
    }
  }
`
const GET_PRACTICE_COLLECTION = gql`
  query GET_PRACTICE_COLLECTION($programContentId: uuid, $memberId: String, $programId: uuid) {
    practice(
      where: {
        member_id: { _eq: $memberId }
        program_content: {
          id: { _eq: $programContentId }
          program_content_section: { program: { id: { _eq: $programId } } }
        }
        is_deleted: { _eq: false }
      }
      order_by: { updated_at: desc }
    ) {
      id
      title
      cover_url
      member_id
      created_at
      updated_at
      practice_reactions {
        member_id
      }
      practice_reactions_aggregate {
        aggregate {
          count
        }
      }
      program_content {
        id
        title
        metadata
      }
      practice_issues_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

const INSERT_PRACTICE = gql`
  mutation INSERT_PRACTICE(
    $title: String!
    $memberId: String!
    $description: String
    $coverUrl: String
    $programContentId: uuid!
  ) {
    insert_practice(
      objects: {
        title: $title
        member_id: $memberId
        description: $description
        cover_url: $coverUrl
        program_content_id: $programContentId
      }
    ) {
      returning {
        id
      }
    }
  }
`

const UPDATE_PRACTICE = gql`
  mutation UPDATE_PRACTICE($practiceId: uuid!, $title: String!, $description: String, $coverUrl: String) {
    update_practice(
      where: { id: { _eq: $practiceId } }
      _set: { title: $title, description: $description, cover_url: $coverUrl }
    ) {
      affected_rows
    }
  }
`

const DELETE_PRACTICE = gql`
  mutation DELETE_PRACTICE($practiceId: uuid!) {
    update_practice(where: { id: { _eq: $practiceId } }, _set: { is_deleted: true }) {
      affected_rows
    }
  }
`

const INSERT_PRACTICE_REACTION = gql`
  mutation INSERT_PRACTICE_REACTION($memberId: String!, $practiceId: uuid!) {
    insert_practice_reaction(objects: { member_id: $memberId, practice_id: $practiceId }) {
      affected_rows
    }
  }
`

const DELETE_PRACTICE_REACTION = gql`
  mutation DELETE_PRACTICE_REACTION($memberId: String!, $practiceId: uuid!) {
    delete_practice_reaction(where: { member_id: { _eq: $memberId }, practice_id: { _eq: $practiceId } }) {
      affected_rows
    }
  }
`

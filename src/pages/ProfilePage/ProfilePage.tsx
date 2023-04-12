import { useQuery } from '@apollo/client'
import { Button, Tag } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import moment from 'moment'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { AvatarImage } from '../../components/common/Image'
import DefaultLayout from '../../components/layout/DefaultLayout'
import * as hasura from '../../hasura'
import pageMessages from '../translation'

const StyledAboutSection = styled.section`
  padding: 48px 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const StyledHeading = styled.h1`
  font-size: 24px;
  font-weight: bold;
`
const StyledProductSection = styled.section`
  padding: 32px 8px;
  max-width: 728px;
  margin: auto;
`
const StyledProductItem = styled.div<{ coverUrl: string }>`
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  .cover {
    padding-top: 56.25%;
    background-image: url(${props => props.coverUrl});
    background-position: center;
    background-size: cover;
  }

  .intro {
    padding: 32px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 200px;
    h3 {
      font-size: 18px;
      font-weight: bold;
    }
    p {
      font-size: 14px;
      color: var(--gray-dark);
    }
  }

  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
    .cover {
      padding-top: 202.5px;
      /* padding-top: 20%; */
      width: 360px;
    }
  }
`
const ProfilePage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { username } = useParams<{ username: string }>()
  const { currentMember } = useAuth()
  const { data } = useQuery<hasura.GET_MEMBER_BY_USERNAME, hasura.GET_MEMBER_BY_USERNAMEVariables>(
    gql`
      query GET_MEMBER_BY_USERNAME($username: String!) {
        member_public(where: { username: { _eq: $username } }) {
          id
          name
          title
          abstract
          description
          picture_url
        }
      }
    `,
    { variables: { username } },
  )
  const member = data?.member_public[0]
    ? {
        id: data.member_public[0].id,
        name: data.member_public[0].name,
        title: data.member_public[0].title,
        abstract: data.member_public[0].abstract || '',
        description: data.member_public[0].description || '',
        pictureUrl: data.member_public[0].picture_url || null,
      }
    : null
  const memberProducts = useMemberProducts(member?.id || '')
  return (
    <DefaultLayout>
      <StyledAboutSection>
        <AvatarImage className="mb-3" src={member?.pictureUrl || ''} shape="circle" size={120} />
        <StyledHeading className="mb-2">{member?.name}</StyledHeading>
        {member?.title && <h3 className="mb-2">{member.title}</h3>}
        <p className="container text-center mb-3">{member?.abstract}</p>
        {username === currentMember?.username && (
          <div className="d-flex">
            <Link to="/settings/profile">
              <Button variant="outline" colorScheme="primary" className="mr-3">
                {formatMessage(pageMessages.ProfilePage.editProfile)}
              </Button>
            </Link>
            <a
              target="_blank"
              href={`/admin/craft-page?action=create&pageName=@${username}&path=/@${username}`}
              rel="noreferrer"
            >
              <Button variant="outline" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.customizePage)}
              </Button>
            </a>
          </div>
        )}
      </StyledAboutSection>
      <StyledProductSection>
        {username === currentMember?.username && (
          <div className="d-flex justify-content-center mb-3 flex-wrap">
            <a href="/admin/activities" target="_blank">
              <Button className="mr-2 mb-3" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.addActivity)}
              </Button>
            </a>
            <a href="/admin/programs" target="_blank">
              <Button className="mr-2 mb-3" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.addProgram)}
              </Button>
            </a>
            <a href="/admin/blog" target="_blank">
              <Button className="mr-2 mb-3" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.addPost)}
              </Button>
            </a>
            <a href="/admin/member-shops" target="_blank">
              <Button className="mr-2 mb-3" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.addMerchandise)}
              </Button>
            </a>
            <a href="/admin/appointment-plans" target="_blank">
              <Button className="mr-2 mb-3" colorScheme="primary">
                {formatMessage(pageMessages.ProfilePage.addAppointment)}
              </Button>
            </a>
          </div>
        )}
        {memberProducts.map((memberProduct, idx) => (
          <Link key={idx} to={memberProduct.targetUrl}>
            <StyledProductItem coverUrl={memberProduct.coverUrl}>
              <div className="cover" />
              <div className="intro">
                <div>
                  <h3 className="mb-3">{memberProduct.title}</h3>
                  <Tag colorScheme="primary">{formatMessage(pageMessages.ProfilePage[memberProduct.type])}</Tag>
                </div>
                <p>
                  {`${formatMessage(pageMessages.ProfilePage.updatedAt)}: ${moment(memberProduct.updatedAt).format(
                    'YYYY-MM-DD HH:mm',
                  )}`}
                </p>
              </div>
            </StyledProductItem>
          </Link>
        ))}
      </StyledProductSection>
    </DefaultLayout>
  )
}

const useMemberProducts = (
  memberId: string,
): {
  type: 'activity' | 'merchandise' | 'program' | 'post' | 'appointment'
  title: string
  coverUrl: string
  targetUrl: string
  updatedAt: Date
}[] => {
  const { data } = useQuery<hasura.GET_PROFILE, hasura.GET_PROFILEVariables>(
    gql`
      query GET_PROFILE($memberId: String!) {
        program(where: { program_roles: { member_id: { _eq: $memberId } } }) {
          id
          title
          cover_url
          updated_at
        }
        post(where: { post_roles: { member_id: { _eq: $memberId } } }) {
          id
          title
          cover_url
          updated_at
        }
        activity(where: { organizer_id: { _eq: $memberId } }) {
          id
          title
          cover_url
          updated_at
        }
        merchandise(where: { member_id: { _eq: $memberId } }) {
          id
          title
          updated_at
          merchandise_imgs {
            id
            url
          }
        }
        appointment_plan(where: { creator_id: { _eq: $memberId } }) {
          id
          title
          updated_at
        }
      }
    `,
    { variables: { memberId } },
  )
  return [
    ...(data?.activity.map(v => ({
      type: 'activity' as const,
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Activity',
      targetUrl: `/activities/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.merchandise.map(v => ({
      type: 'merchandise' as const,
      title: v.title,
      coverUrl: v.merchandise_imgs[0]?.url || 'https://via.placeholder.com/600x400?text=Merchandise',
      targetUrl: `/merchandises/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.post.map(v => ({
      type: 'post' as const,
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Post',
      targetUrl: `/posts/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.program.map(v => ({
      type: 'program' as const,
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Program',
      targetUrl: `/programs/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.appointment_plan.map(v => ({
      type: 'appointment' as const,
      title: v.title,
      coverUrl: 'https://via.placeholder.com/600x400?text=Appointment',
      targetUrl: `/appointment_plans/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
  ].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
}

export default ProfilePage

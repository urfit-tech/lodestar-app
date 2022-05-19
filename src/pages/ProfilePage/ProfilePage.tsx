import { useQuery } from '@apollo/react-hooks'
import { Button } from '@chakra-ui/react'
import gql from 'graphql-tag'
import { BREAK_POINT } from 'lodestar-app-element/src/components/common/Responsive'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
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
  max-width: 992px;
  margin: auto;
`
const StyledProductItem = styled.div<{ coverUrl: string }>`
  background: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;

  .cover {
    padding-top: 56.25%;
    background-image: url(${props => props.coverUrl});
    background-position: center;
  }

  .intro {
    padding: 8px;
    display: flex;
    justify-content: space-between;
  }

  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
    .cover {
      padding-top: 22.5%;
      width: 40%;
    }
    .intro {
      padding: 0 16px;
      flex-direction: column;
      justify-content: space-around;
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
        abstract: data.member_public[0].abstract,
        description: data.member_public[0].description,
        pictureUrl: data.member_public[0].picture_url,
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
              <Button className="mr-3">{formatMessage(pageMessages.ProfilePage.editProfile)}</Button>
            </Link>
            <a href={`/admin/craft-page?action=create&pageName=@${username}&path=/@${username}`}>
              <Button>{formatMessage(pageMessages.ProfilePage.customizePage)}</Button>
            </a>
          </div>
        )}
      </StyledAboutSection>
      <StyledProductSection>
        {username === currentMember?.username && (
          <div className="d-flex justify-content-center mb-3">
            <a href="/admin/activities" target="_blank">
              <Button className="mr-3">{formatMessage(pageMessages.ProfilePage.addActivity)}</Button>
            </a>
            <a href="/admin/programs" target="_blank">
              <Button className="mr-3">{formatMessage(pageMessages.ProfilePage.addProgram)}</Button>
            </a>
            <a href="/admin/blog" target="_blank">
              <Button className="mr-3">{formatMessage(pageMessages.ProfilePage.addPost)}</Button>
            </a>
            <a href="/admin/member-shops" target="_blank">
              <Button className="mr-3">{formatMessage(pageMessages.ProfilePage.addMerchandise)}</Button>
            </a>
          </div>
        )}
        {memberProducts.map((memberProduct, idx) => (
          <Link key={idx} to={memberProduct.targetUrl}>
            <StyledProductItem coverUrl={memberProduct.coverUrl}>
              <div className="cover" />
              <div className="intro">
                <h3>{memberProduct.title}</h3>
                <p>{memberProduct.updatedAt}</p>
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
): { title: string; coverUrl: string; targetUrl: string; updatedAt: Date }[] => {
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
      }
    `,
    { variables: { memberId } },
  )
  return [
    ...(data?.activity.map(v => ({
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Activity',
      targetUrl: `/activities/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.merchandise.map(v => ({
      title: v.title,
      coverUrl: v.merchandise_imgs[0]?.url || 'https://via.placeholder.com/600x400?text=Merchandise',
      targetUrl: `/merchandises/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.post.map(v => ({
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Post',
      targetUrl: `/posts/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
    ...(data?.program.map(v => ({
      title: v.title,
      coverUrl: v.cover_url || 'https://via.placeholder.com/600x400?text=Program',
      targetUrl: `/programs/${v.id}`,
      updatedAt: v.updated_at,
    })) || []),
  ].sort((a, b) => (a.updatedAt > b.updatedAt ? -1 : 1))
}

export default ProfilePage

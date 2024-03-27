import { useQuery } from '@apollo/client'
import { Badge, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import axios from 'axios'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { BooleanParam } from 'serialize-query-params'
import styled from 'styled-components'
import { useQueryParams } from 'use-query-params'
import { v4 } from 'uuid'
import DefaultLayout from '../../components/layout/DefaultLayout'
import hasura from '../../hasura'
import { filterRepeatValues } from '../../helpers'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'

type CategoryCheckboxes = {
  title: string
  description: string
  value: string
}[]

const StyledForm = styled.form`
  padding: 48px 24px;
`

const GetMemberByUsername = gql`
  query GetMemberByUsername($appId: String!, $username: String!) {
    member_public(where: { app_id: { _eq: $appId }, username: { _eq: $username } }) {
      id
    }
  }
`

const MeetingPage = () => {
  const { id: appId, settings, loading: loadingAppData } = useApp()
  const history = useHistory()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [{ noHeader, noFooter }] = useQueryParams({
    noHeader: BooleanParam,
    noFooter: BooleanParam,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoryCheckboxes = JSON.parse(settings['custom.meeting_page']).categoryCheckboxes as CategoryCheckboxes // array of checkboxes
  // custom property default values
  const propertyDefaultValue = JSON.parse(settings['custom.meeting_page']).propertyDefaultValue as {
    [key: string]: string
  }

  const { data: memberData, loading } = useQuery<hasura.GetMemberByUsername, hasura.GetMemberByUsernameVariables>(
    GetMemberByUsername,
    {
      variables: { appId, username: managerUsername },
    },
  )

  const managerId = managerUsername ? memberData?.member_public[0]?.id || undefined : undefined

  if (loading && loadingAppData) {
    return <LoadingPage />
  }

  if (settings['custom.permission_group.salesLead'] !== '1' || (managerUsername && !managerId && !loading)) {
    return <NotFoundPage />
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    setIsSubmitting(true)
    e.preventDefault()
    const formEntries = Array.from(new FormData(e.currentTarget).entries())
    const name = formEntries.find(entry => entry[0] === 'name')?.[1]
    const email = formEntries.find(entry => entry[0] === 'email')?.[1]
    const phone = formEntries.find(entry => entry[0] === 'phone')?.[1]
    const referal = formEntries.find(entry => entry[0] === 'referal')?.[1]
    const fields = filterRepeatValues(
      formEntries.filter(entry => entry[0] === 'field').flatMap(entry => entry[1].toString().split('/')),
    )
    const timeslots = formEntries.filter(entry => entry[0] === 'timeslot').map(entry => entry[1])
    const adPropertyValues = propertyDefaultValue['廣告素材'].replace(/{領域}/g, fields.join('+'))
    const landingPage = Cookies.get('landing') // setting from backend

    let utm
    try {
      utm = JSON.parse(Cookies.get('utm') || '{}')
    } catch (error) {
      utm = {}
    }
    // This API includes an update event
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_ROOT}/sys/create-lead`,
        {
          phone,
          email,
          name,
          managerUsername,
          taskTitle: `專屬預約諮詢:${timeslots.join('/')}`,
          categoryNames: fields,
          properties: [
            { name: '介紹人', value: referal },
            { name: '聯盟來源', value: utm.utm_source || '' },
            { name: '聯盟會員編號', value: utm.utm_id || '' },
            { name: '聯盟成交編號', value: utm.utm_term || '' },
            { name: '行銷內容', value: utm.utm_content || '' },
            { name: '來源網址', value: landingPage || '' },
            { name: '廣告素材', value: adPropertyValues || '' },
            { name: '行銷活動', value: propertyDefaultValue['行銷活動'] || '' },
            { name: '名單分級', value: propertyDefaultValue['名單分級'] || '' },
          ],
        },
        {
          withCredentials: true, // To include credentials in the request
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      const { code, message } = res.data

      if (code === 'SUCCESS') {
        Cookies.remove('utm')
        history.push('/meets/us/completed')
      } else {
        alert(`發生錯誤，請聯繫網站管理員。錯誤訊息：${message}`)
      }
    } catch (error) {
      alert(`發生錯誤，請聯繫網站管理員。錯誤訊息：${error}`)
    } finally {
      setIsSubmitting(false)
      window.location.reload()
    }
  }

  return (
    <DefaultLayout centeredBox noFooter={noFooter} noHeader={noHeader}>
      <StyledForm onSubmit={handleSubmit}>
        <Heading as="h3" size="lg" className="mb-4 text-center">
          {managerUsername} 預約連結
        </Heading>
        <FormControl className="mb-3" isRequired>
          <FormLabel>姓名</FormLabel>
          <Input required name="name" placeholder="姓名" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>電話</FormLabel>
          <Input required name="phone" placeholder="電話" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>Email</FormLabel>
          <Input required name="email" type="email" placeholder="Email" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>有興趣了解領域</FormLabel>
          <CheckboxGroup colorScheme="primary">
            <Stack>
              {categoryCheckboxes.map(checkbox => (
                <Checkbox name="field" value={checkbox.value} key={v4()}>
                  <Badge className="mr-1" variant="outline" colorScheme="primary">
                    {checkbox.title}
                  </Badge>
                  {checkbox.description}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>方便聯繫時段</FormLabel>
          <CheckboxGroup colorScheme="primary">
            <Stack>
              <Checkbox name="timeslot" value="平日下午">
                平日下午
              </Checkbox>
              <Checkbox name="timeslot" value="平日晚上">
                平日晚上
              </Checkbox>
              <Checkbox name="timeslot" value="假日下午">
                假日下午
              </Checkbox>
              <Checkbox name="timeslot" value="假日晚上">
                假日晚上
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>介紹人</FormLabel>
          <Input name="referal" placeholder="介紹人姓名" />
        </FormControl>
        <Button width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
          送出
        </Button>
      </StyledForm>
    </DefaultLayout>
  )
}

export default MeetingPage

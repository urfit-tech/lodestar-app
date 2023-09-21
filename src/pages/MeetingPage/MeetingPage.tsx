import { useQuery } from '@apollo/client'
import { Badge, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import axios from 'axios'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import queryString from 'query-string'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../../components/layout/DefaultLayout'
import hasura from '../../hasura'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'

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
  const { id: appId, settings } = useApp()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryUrl = window.location.search
  const { query } = queryString.parseUrl(queryUrl)

  const meetsQueryArray = JSON.parse(settings['custom'])?.['meets'] || {}
  const meetQueryObject = meetsQueryArray.map((meet: { key: string; name: string }) => ({
    name: meet.name,
    value: query[meet.key] || '',
  }))

  const customAdProperty = (propertyName: string) => {
    return JSON.parse(settings['custom.ad_property.list'] || '{}')?.['meeting']?.[propertyName] || ''
  }

  const customMeetingAdProperty = customAdProperty('adProperty')
  const customMeetingMarketingActivitiesProperty = customAdProperty('marketingActivitiesProperty')

  const { data: memberData, loading } = useQuery<hasura.GetMemberByUsername, hasura.GetMemberByUsernameVariables>(
    GetMemberByUsername,
    {
      variables: { appId, username: managerUsername },
    },
  )

  const managerId = managerUsername ? memberData?.member_public[0]?.id || undefined : undefined

  if (loading) {
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
    const fields = formEntries.filter(entry => entry[0] === 'field').flatMap(entry => entry[1].toString().split('/'))
    const timeslots = formEntries.filter(entry => entry[0] === 'timeslot').map(entry => entry[1])

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
            { name: '名單分級', value: 'SSR' },
            { name: '聯盟來源', value: utm.utm_source || '' },
            { name: '聯盟會員編號', value: utm.utm_id || '' },
            { name: '聯盟成交編號', value: utm.utm_term || '' },
            { name: '廣告素材', value: customMeetingAdProperty },
            {
              name: '行銷活動',
              value: customMeetingMarketingActivitiesProperty,
            },
            ...meetQueryObject,
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
        alert('已成功預約專屬諮詢！')
      } else {
        alert(`發生錯誤，請聯繫網站管理員。錯誤訊息：${message}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      window.location.reload()
    }
  }

  return (
    <DefaultLayout centeredBox>
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
              <Checkbox name="field" value="插畫">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  插畫
                </Badge>
                廣告海報、貼圖等
              </Checkbox>
              <Checkbox name="field" value="平面設計">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  平面設計
                </Badge>
                CIS、排版、色彩等
              </Checkbox>
              <Checkbox name="field" value="UIUX">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  UI/UX
                </Badge>
                使用者流程、介面設計與體驗
              </Checkbox>
              <Checkbox name="field" value="前後端工程/前端工程/前端設計">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  網站前端
                </Badge>
                切版、前端框架等
              </Checkbox>
              <Checkbox name="field" value="前後端工程/網頁前後端工程/全端">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  網站後端
                </Badge>
                API、資安、後端框架等
              </Checkbox>
              <Checkbox name="field" value="Python">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  資料分析
                </Badge>
                視覺化圖表、機器學習、人工智慧等
              </Checkbox>
              <Checkbox name="field" value="自動化交易/Python">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  自動化交易
                </Badge>
                量化分析、金融投資、理財機器人等
              </Checkbox>
              <Checkbox name="field" value="前端工程/Python">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  程式語言應用
                </Badge>
                Python、JavaScript
              </Checkbox>
              <Checkbox name="field" value="C4D/動畫">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  動畫製作
                </Badge>
                2D 設計、3D 設計、腳本製作等
              </Checkbox>
              <Checkbox name="field" value="影音自媒體/行銷">
                <Badge className="mr-1" variant="outline" colorScheme="primary">
                  影音自媒體
                </Badge>
                行銷、數據追蹤、影音剪輯等
              </Checkbox>
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

import { useMutation, useQuery } from '@apollo/client'
import { Badge, Button, Checkbox, CheckboxGroup, FormControl, FormLabel, Heading, Input, Stack } from '@chakra-ui/react'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import DefaultLayout from '../../components/layout/DefaultLayout'
import { useMemberPropertyCollection } from '../../components/profile/ProfileOtherAdminCard'
import hasura from '../../hasura'
import NotFoundPage from '../NotFoundPage'

const StyledForm = styled.form`
  padding: 48px 24px;
`
const MeetingPage = () => {
  const { settings } = useApp()
  const { currentMemberId } = useAuth()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: categoryData } = useQuery<hasura.GET_PROPERTIES_AND_CATEGORIES>(GET_PROPERTIES_AND_CATEGORIES)
  const { memberProperties } = useMemberPropertyCollection(currentMemberId!)

  // 取得目前登入使用者的廣告素材
  const adProperty = memberProperties.find(({ name }) => name === '廣告素材')?.value
    ? memberProperties
        .find(({ name }) => name === '廣告素材')
        ?.value.split(',')
        .map(value => value.trim())
    : null
  // 取得目前登入使用者的行銷活動
  const marketingActivitiesProperty = memberProperties.find(({ name }) => name === '行銷活動')?.value
    ? memberProperties
        .find(({ name }) => name === '行銷活動')
        ?.value.split(',')
        .map(value => value.trim())
    : null

  const customMeetingAdProperty =
    JSON.parse(settings['custom.ad_property.list'] || '{}')?.['meeting']?.['adProperty'] || ''
  const customMeetingMarketingActivitiesProperty =
    JSON.parse(settings['custom.ad_property.list'] || '{}')?.['meeting']?.['marketingActivitiesProperty'] || ''

  const adPropertyValue = `${
    !adProperty
      ? customMeetingAdProperty
      : adProperty && adProperty.includes(customMeetingAdProperty)
      ? [...adProperty.filter(property => property !== customMeetingAdProperty), customMeetingAdProperty].join(',')
      : `${adProperty.join(',')},${customMeetingAdProperty}`
  }`

  const marketingActivitiesPropertyValue = `${
    !marketingActivitiesProperty
      ? customMeetingMarketingActivitiesProperty
      : marketingActivitiesProperty && marketingActivitiesProperty.includes(customMeetingMarketingActivitiesProperty)
      ? [
          ...marketingActivitiesProperty.filter(property => property !== customMeetingMarketingActivitiesProperty),
          customMeetingMarketingActivitiesProperty,
        ].join(',')
      : `${marketingActivitiesProperty.join(',')},${customMeetingAdProperty}`
  }`

  const [updateMemberCreated] = useMutation<hasura.UPDATE_MEMBER_CREATED, hasura.UPDATE_MEMBER_CREATEDVariables>(
    UPDATE_MEMBER_CREATED,
    { variables: { memberId: currentMemberId! } },
  )
  const [updateMemberProperties] = useMutation<
    hasura.UPDATE_MEMBER_PROPERTIES,
    hasura.UPDATE_MEMBER_PROPERTIESVariables
  >(UPDATE_MEMBER_PROPERTIES, {
    variables: {
      memberPropertiesInput: [
        {
          member_id: currentMemberId,
          property_id: categoryData?.property.find(({ name }) => name === '廣告素材')?.id,
          value: adPropertyValue,
        },
        {
          member_id: currentMemberId,
          property_id: categoryData?.property.find(({ name }) => name === '行銷活動')?.id,
          value: marketingActivitiesPropertyValue,
        },
      ],
    },
  })

  if (settings['custom.permission_group.salesLead'] !== '1') {
    return <NotFoundPage />
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = e => {
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

    if (currentMemberId !== null) {
      updateMemberCreated()
        .then(() => updateMemberProperties())
        .catch(error => {
          console.error('Error during submitting:', error)
        })
        .finally(() => {
          Cookies.remove('utm')
          alert('已成功預約專屬諮詢！')
          setIsSubmitting(false)
          window.location.reload()
        })
    } else {
      fetch(process.env.REACT_APP_API_BASE_ROOT + '/sys/create-lead', {
        method: 'post',
        body: JSON.stringify({
          phone,
          email,
          name,
          managerUsername,
          taskTitle: `專屬預約諮詢:${timeslots.join('/')}`,
          categoryNames: fields,
          properties: [
            { name: '介紹人', value: referal },
            { name: '名單分級', value: 'SSR' },
            { name: '來源網址', value: window.location.href },
            { name: '聯盟來源', value: utm.utm_source || '' },
            { name: '聯盟會員編號', value: utm.utm_id || '' },
            { name: '聯盟成交編號', value: utm.utm_term || '' },
            { name: '廣告素材', value: adPropertyValue },
            {
              name: '行銷活動',
              value: marketingActivitiesPropertyValue,
            },
          ],
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(({ code, message }: { code: string; message: string }) => {
          if (code === 'SUCCESS') {
            Cookies.remove('utm')
            alert('已成功預約專屬諮詢！')
          } else {
            alert(`發生錯誤，請聯繫網站管理員。錯誤訊息：${message}`)
          }
        })
        .finally(() => {
          setIsSubmitting(false)
          window.location.reload()
        })
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

const GET_PROPERTIES_AND_CATEGORIES = gql`
  query GET_PROPERTIES_AND_CATEGORIES {
    property(where: { type: { _eq: "member" } }) {
      id
      name
    }
    category(where: { class: { _eq: "member" } }) {
      id
      name
    }
  }
`

const UPDATE_MEMBER_CREATED = gql`
  mutation UPDATE_MEMBER_CREATED($memberId: String!) {
    update_member_by_pk(pk_columns: { id: $memberId }, _set: { created_at: "NOW()" }) {
      id
      username
    }
  }
`

const UPDATE_MEMBER_PROPERTIES = gql`
  mutation UPDATE_MEMBER_PROPERTIES($memberPropertiesInput: [member_property_insert_input!]!) {
    insert_member_property(
      objects: $memberPropertiesInput
      on_conflict: { constraint: member_property_member_id_property_id_key, update_columns: [value] }
    ) {
      affected_rows
    }
  }
`

export default MeetingPage

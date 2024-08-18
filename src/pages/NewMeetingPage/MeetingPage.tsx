import { Button, FormControl, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { BooleanParam } from 'serialize-query-params'
import styled from 'styled-components'
import { useQueryParams } from 'use-query-params'
import DefaultLayout from '../../components/layout/DefaultLayout'
import LoadingPage from '../LoadingPage'

const StyledForm = styled.form`
  padding: 48px 24px;
`

const MeetingPage = () => {
  const { loading: loadingAppData } = useApp()
  const history = useHistory()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [{ noHeader, noFooter }] = useQueryParams({
    noHeader: BooleanParam,
    noFooter: BooleanParam,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loadingAppData) {
    return <LoadingPage />
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    setIsSubmitting(true)
    e.preventDefault()
    const formEntries = Array.from(new FormData(e.currentTarget).entries())

    const lastName = formEntries.find(entry => entry[0] === 'lastName')?.[1]
    const middleName = formEntries.find(entry => entry[0] === 'middleName')?.[1]
    const name = formEntries.find(entry => entry[0] === 'name')?.[1]
    const email = formEntries.find(entry => entry[0] === 'email')?.[1]
    const phone = formEntries.find(entry => entry[0] === 'phone')?.[1]
    const country = formEntries.find(entry => entry[0] === 'country')?.[1]
    const language = formEntries.find(entry => entry[0] === 'language')?.[1]
    const gender = formEntries.find(entry => entry[0] === 'gender')?.[1]
    const source = formEntries.find(entry => entry[0] === 'source')?.[1]
    const friend = formEntries.find(entry => entry[0] === 'friend')?.[1]
    const referalName = formEntries.find(entry => entry[0] === 'referalName')?.[1]
    const referalEmail = formEntries.find(entry => entry[0] === 'referalEmail')?.[1]

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
          taskTitle: `專屬預約諮詢`,
          categoryNames: [],
          properties: [
            { name: '姓氏', value: lastName },
            { name: '中間名', value: middleName },
            { name: '名字', value: name },
            { name: '國籍', value: country },
            { name: '母語', value: language },
            { name: '性別', value: gender },
            { name: '得知TLI管道', value: source },
            { name: '就讀過TLI的親友姓名', value: friend },
            { name: '代理人姓名', value: referalName },
            { name: '代理人Email', value: referalEmail },
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
        Cookies.remove('landing')
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
          <FormLabel>姓氏</FormLabel>
          <Input required name="lastName" placeholder="您的姓氏是？" />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>中間名</FormLabel>
          <Input name="middleName" placeholder="您有中間名嗎？如果有，請填寫。" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>名字</FormLabel>
          <Input required name="name" placeholder="您的名字是？" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>Email</FormLabel>
          <Input required name="email" placeholder="您的Email是？" />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>電話</FormLabel>
          <Input name="phone" placeholder="電話" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>國籍</FormLabel>
          <Input required name="country" placeholder="您的國籍是？" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>母語</FormLabel>
          <Input required name="language" placeholder="您的母語是什麼呢？" />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>性別</FormLabel>
          <Select name="gender" placeholder="您的性別是？">
            <option>男性</option>
            <option>女性</option>
            <option>不願透露</option>
          </Select>
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>得知TLI管道</FormLabel>
          <Select name="source" placeholder="請問您是透過什麼管道得知TLI的呢？">
            {[
              '分校招牌',
              '分校DM',
              '親友',
              '公司/同事',
              '仲介/通路',
              '官網',
              'Facebook',
              'Instagram',
              'Google商家 ',
              'Youtube',
              '抖音',
              'LinkedIn',
              '活動',
              'Google廣告',
              '報章雜誌',
              '其他>>選擇其他則出現文本輸入',
            ].map(v => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl className="mb-3">
          <FormLabel>就讀過TLI的親友姓名</FormLabel>
          <Input name="friend" placeholder="如果有親友就讀TLI，請填寫他/她的姓名" />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>代理人姓名</FormLabel>
          <Input name="referalName" placeholder="如果您有代理人，請填寫代理人的姓名。" />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>代理人Email</FormLabel>
          <Input name="referalEmail" placeholder="代理人的Email是？" />
        </FormControl>
        <Button width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
          送出
        </Button>
      </StyledForm>
    </DefaultLayout>
  )
}

export default MeetingPage

import { useQuery } from '@apollo/client'
import {
  Badge,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react'
import axios from 'axios'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { BooleanParam } from 'serialize-query-params'
import styled from 'styled-components'
import { useQueryParams } from 'use-query-params'
import DefaultLayout from '../../components/layout/DefaultLayout'
import hasura from '../../hasura'
import LoadingPage from '../LoadingPage'
import NotFoundPage from '../NotFoundPage'
import MeetingPageMessages from './translation'

type CategoryCheckboxes = {
  id: number
  title: string
  description: string
  value: string
}[]

type IdentityField = {
  label: string
  required: boolean
  type: string
  propertyName: string
  options: {
    id: number
    title: string
    value: string
  }[]
}

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
  const { formatMessage } = useIntl()
  const { id: appId, settings, loading: loadingAppData } = useApp()
  const history = useHistory()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [{ noHeader, noFooter }] = useQueryParams({
    noHeader: BooleanParam,
    noFooter: BooleanParam,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  let categoryCheckboxes: CategoryCheckboxes = []
  try {
    categoryCheckboxes = JSON.parse(settings['custom.meeting_page']).categoryCheckboxes as CategoryCheckboxes // array of checkboxes
  } catch (error) {
    categoryCheckboxes = []
  }

  let identityField: IdentityField | null = null
  try {
    identityField = JSON.parse(settings['custom.meeting_page']).identity as IdentityField
  } catch (error) {
    identityField = null
  }

  const [identity, setIdentity] = useState('')

  useEffect(() => {
    console.log(
      Array.from(document.querySelectorAll<HTMLInputElement>('input[type=radio]')).map(
        el => `${el.name}:${el.checked}`,
      ),
    )
  })

  // custom property default values
  let propertyDefaultValue: { [key: string]: string } = {}
  try {
    propertyDefaultValue = JSON.parse(settings['custom.meeting_page']).propertyDefaultValue as {
      [key: string]: string
    }
  } catch (error) {
    propertyDefaultValue = {}
  }

  const { data: memberData, loading } = useQuery<hasura.GetMemberByUsername, hasura.GetMemberByUsernameVariables>(
    GetMemberByUsername,
    {
      skip: !managerUsername,
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
    const identity = formEntries.find(entry => entry[0] === 'identity')?.[1]
    const uniqueFields = Array.from(
      new Set(formEntries.filter(entry => entry[0] === 'field').flatMap(entry => entry[1].toString().split('/'))),
    )
    const timeslots = formEntries.filter(entry => entry[0] === 'timeslot').map(entry => entry[1])
    const adPropertyValues = (
      propertyDefaultValue[formatMessage(MeetingPageMessages.MeetingPage.adMaterial)] || ''
    ).replace(new RegExp(`{${formatMessage(MeetingPageMessages.MeetingPage.field)}}`, 'g'), uniqueFields.join('+'))
    const landingPage = Cookies.get('landing') // setting from backend

    if (categoryCheckboxes.length !== 0 && uniqueFields.length === 0) {
      alert(formatMessage(MeetingPageMessages.MeetingPage.interestField))
      setIsSubmitting(false)
      return
    }

    if (timeslots.length === 0) {
      alert(formatMessage(MeetingPageMessages.MeetingPage.contactTimes))
      setIsSubmitting(false)
      return
    }

    if (identityField?.required && !identity) {
      alert('請選擇您的身份')
      setIsSubmitting(false)
      return
    }

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
          taskTitle: formatMessage(MeetingPageMessages.MeetingPage.reserve, { timeslots: timeslots.join('/') }),
          categoryNames: uniqueFields,
          properties: [
            { name: formatMessage(MeetingPageMessages.MeetingPage.introducer), value: referal },
            { name: formatMessage(MeetingPageMessages.MeetingPage.allianceSource), value: utm.utm_source || '' },
            { name: formatMessage(MeetingPageMessages.MeetingPage.allianceMemberId), value: utm.utm_id || '' },
            { name: formatMessage(MeetingPageMessages.MeetingPage.allianceTransactionId), value: utm.utm_term || '' },
            { name: formatMessage(MeetingPageMessages.MeetingPage.marketingContent), value: utm.utm_content || '' },
            { name: identityField?.propertyName || '身份', value: identity || '' },
            { name: formatMessage(MeetingPageMessages.MeetingPage.sourceUrl), value: landingPage || '' },
            { name: formatMessage(MeetingPageMessages.MeetingPage.adMaterial), value: adPropertyValues || '' },
            {
              name: formatMessage(MeetingPageMessages.MeetingPage.marketingCampaign),
              value: propertyDefaultValue[formatMessage(MeetingPageMessages.MeetingPage.marketingCampaign)] || '',
            },
            {
              name: formatMessage(MeetingPageMessages.MeetingPage.leadRating),
              value: propertyDefaultValue[formatMessage(MeetingPageMessages.MeetingPage.leadRating)] || '',
            },
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
        alert(formatMessage(MeetingPageMessages.MeetingPage.errorMessage, { message: message }))
      }
    } catch (error) {
      alert(formatMessage(MeetingPageMessages.MeetingPage.errorMessage, { message: error as string }))
    } finally {
      setIsSubmitting(false)
      window.location.reload()
    }
  }

  return (
    <DefaultLayout centeredBox noFooter={noFooter} noHeader={noHeader}>
      <StyledForm onSubmit={handleSubmit}>
        <Heading as="h3" size="lg" className="mb-4 text-center">
          {formatMessage(MeetingPageMessages.MeetingPage.bookingLink, { managerUsername: managerUsername })}
        </Heading>
        {categoryCheckboxes.length !== 0 ? (
          <FormControl className="mb-3" isRequired>
            <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.interest)}</FormLabel>
            <CheckboxGroup colorScheme="primary">
              <Stack>
                {categoryCheckboxes.map(checkbox => (
                  <Checkbox name="field" value={checkbox.value} key={checkbox.id}>
                    <Badge className="mr-1" variant="outline" colorScheme="primary">
                      {checkbox.title}
                    </Badge>
                    {checkbox.description}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </FormControl>
        ) : null}
        {identityField ? (
          <FormControl className="mb-3" isRequired={identityField.required}>
            <FormLabel>{identityField.label}</FormLabel>
            <RadioGroup colorScheme="primary" value={identity} onChange={next => setIdentity(String(next))}>
              <Stack>
                {identityField.options.map(option => (
                  <Radio key={option.id} value={option.value} name="identity" isChecked={identity === option.value}>
                    {option.title}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <input type="hidden" name="identity" value={identity} />
          </FormControl>
        ) : null}
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.contactTime)}</FormLabel>
          <CheckboxGroup colorScheme="primary">
            <Stack>
              <Checkbox name="timeslot" value={formatMessage(MeetingPageMessages.MeetingPage.weekdayAfternoon)}>
                {formatMessage(MeetingPageMessages.MeetingPage.weekdayAfternoon)}
              </Checkbox>
              <Checkbox name="timeslot" value={formatMessage(MeetingPageMessages.MeetingPage.weekdayEvening)}>
                {formatMessage(MeetingPageMessages.MeetingPage.weekdayEvening)}
              </Checkbox>
              <Checkbox name="timeslot" value={formatMessage(MeetingPageMessages.MeetingPage.weekendAfternoon)}>
                {formatMessage(MeetingPageMessages.MeetingPage.weekendAfternoon)}
              </Checkbox>
              <Checkbox name="timeslot" value={formatMessage(MeetingPageMessages.MeetingPage.weekendEvening)}>
                {formatMessage(MeetingPageMessages.MeetingPage.weekendEvening)}
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.name)}</FormLabel>
          <Input required name="name" placeholder={formatMessage(MeetingPageMessages.MeetingPage.name)} />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.phone)}</FormLabel>
          <Input required name="phone" placeholder={formatMessage(MeetingPageMessages.MeetingPage.phone)} />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.email)}</FormLabel>
          <Input
            required
            name="email"
            type="email"
            placeholder={formatMessage(MeetingPageMessages.MeetingPage.email)}
          />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>{formatMessage(MeetingPageMessages.MeetingPage.introducer)}</FormLabel>
          <Input name="referal" placeholder={formatMessage(MeetingPageMessages.MeetingPage.referralName)} />
        </FormControl>
        <Button width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
          {formatMessage(MeetingPageMessages.MeetingPage.submit)}
        </Button>
      </StyledForm>
    </DefaultLayout>
  )
}

export default MeetingPage

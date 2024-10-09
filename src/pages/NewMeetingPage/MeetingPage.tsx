import { Button, FormControl, FormLabel, Heading, Input, Select } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { BooleanParam } from 'serialize-query-params'
import styled from 'styled-components'
import { useQueryParams } from 'use-query-params'
import DefaultLayout from '../../components/layout/DefaultLayout'
import LoadingPage from '../LoadingPage'
import NewMeetingPageMessages from './translation'

const StyledForm = styled.form`
  padding: 48px 24px;
`

const MeetingPage = () => {
  const { formatMessage } = useIntl()
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
    const referralName = formEntries.find(entry => entry[0] === 'referralName')?.[1]
    const referralEmail = formEntries.find(entry => entry[0] === 'referralEmail')?.[1]

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
          taskTitle: formatMessage(NewMeetingPageMessages.MeetingPage.exclusiveConsultation),
          categoryNames: [],
          properties: [
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.lastName), value: lastName },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.middleName), value: middleName },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.firstName), value: name },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.country), value: country },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.language), value: language },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.gender), value: gender },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.source), value: source },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.friend), value: friend },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.referralName), value: referralName },
            { name: formatMessage(NewMeetingPageMessages.MeetingPage.referralEmail), value: referralEmail },
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
        alert(
          formatMessage(NewMeetingPageMessages.MeetingPage.errorMessage, {
            message: message,
          }),
        )
      }
    } catch (error) {
      alert(formatMessage(NewMeetingPageMessages.MeetingPage.errorMessageWithError, { message: error as string }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DefaultLayout centeredBox noFooter={noFooter} noHeader={noHeader}>
      <StyledForm onSubmit={handleSubmit}>
        <Heading as="h3" size="lg" className="mb-4 text-center">
          {formatMessage(NewMeetingPageMessages.MeetingPage.bookingLink, {
            managerUsername: managerUsername,
          })}
        </Heading>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.lastName)}</FormLabel>
          <Input
            required
            name="lastName"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.lastNamePlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.middleName)}</FormLabel>
          <Input
            name="middleName"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.middleNamePlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.firstName)}</FormLabel>
          <Input
            required
            name="name"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.firstNamePlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.email)}</FormLabel>
          <Input
            required
            name="email"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.emailPlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.phone)}</FormLabel>
          <Input name="phone" placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.phone)} />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.country)}</FormLabel>
          <Input
            required
            name="country"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.countryPlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.language)}</FormLabel>
          <Input
            required
            name="language"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.languagePlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.gender)}</FormLabel>
          <Select name="gender" placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.genderPlaceholder)}>
            <option>{formatMessage(NewMeetingPageMessages.MeetingPage.male)}</option>
            <option>{formatMessage(NewMeetingPageMessages.MeetingPage.female)}</option>
            <option>{formatMessage(NewMeetingPageMessages.MeetingPage.preferNotToSay)}</option>
          </Select>
        </FormControl>
        <FormControl className="mb-3" isRequired>
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.source)}</FormLabel>
          <Select name="source" placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.sourcePlaceholder)}>
            {[
              formatMessage(NewMeetingPageMessages.MeetingPage.branchSign),
              formatMessage(NewMeetingPageMessages.MeetingPage.branchDM),
              formatMessage(NewMeetingPageMessages.MeetingPage.friends),
              formatMessage(NewMeetingPageMessages.MeetingPage.companyColleagues),
              formatMessage(NewMeetingPageMessages.MeetingPage.intermediaryChannel),
              formatMessage(NewMeetingPageMessages.MeetingPage.officialWebsite),
              formatMessage(NewMeetingPageMessages.MeetingPage.facebook),
              formatMessage(NewMeetingPageMessages.MeetingPage.instagram),
              formatMessage(NewMeetingPageMessages.MeetingPage.googleBusiness),
              formatMessage(NewMeetingPageMessages.MeetingPage.youtube),
              formatMessage(NewMeetingPageMessages.MeetingPage.tiktok),
              formatMessage(NewMeetingPageMessages.MeetingPage.linkedin),
              formatMessage(NewMeetingPageMessages.MeetingPage.events),
              formatMessage(NewMeetingPageMessages.MeetingPage.googleAds),
              formatMessage(NewMeetingPageMessages.MeetingPage.newspapersMagazines),
              formatMessage(NewMeetingPageMessages.MeetingPage.others),
            ].map(v => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl className="mb-3">
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.friend)}</FormLabel>
          <Input name="friend" placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.friendPlaceholder)} />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.referralName)}</FormLabel>
          <Input
            name="referralName"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.referralNamePlaceholder)}
          />
        </FormControl>
        <FormControl className="mb-3">
          <FormLabel>{formatMessage(NewMeetingPageMessages.MeetingPage.referralEmail)}</FormLabel>
          <Input
            name="referralEmail"
            placeholder={formatMessage(NewMeetingPageMessages.MeetingPage.referralEmailPlaceholder)}
          />
        </FormControl>
        <Button width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
          {formatMessage(NewMeetingPageMessages.MeetingPage.send)}
        </Button>
      </StyledForm>
    </DefaultLayout>
  )
}

export default MeetingPage

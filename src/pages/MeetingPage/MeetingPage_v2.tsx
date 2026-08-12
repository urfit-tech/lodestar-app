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
  Stack,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import gql from 'graphql-tag'
import Cookies from 'js-cookie'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { identity, ifElse, map, pipe, reduce } from 'ramda'
import React, { useMemo, useState } from 'react'
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

// --- Types ---
type FieldType = 'text' | 'email' | 'tel' | 'single' | 'multiple' | 'hidden' | string

interface FieldConfig {
  id: string
  type: FieldType
  path?: string[]
  title?: string
  placeholder?: string
  required?: boolean
  options?: { id: number; label: string; description?: string; value: string }[]
  generateValue?: string
  payloadValue?: string
  validate?: string
  pattern?: string
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

// --- Helpers ---

// 遞歸路徑定位引擎
const setDeep = (obj: any, path: string[], value: any) => {
  let current = obj
  path.forEach((key, idx) => {
    const isLast = idx === path.length - 1
    if (isLast) {
      current[key] = value
    } else {
      if (!current[key]) {
        current[key] = /^\d+$/.test(path[idx + 1]) ? [] : {}
      }
      current = current[key]
    }
  })
  return obj
}

const calculateFinalValue = (field: FieldConfig, context: any) => {
  if (field.generateValue) {
    try {
      const generator = new Function('context', `return (${field.generateValue})(context)`)
      return generator(context)
    } catch (err) {
      return undefined
    }
  }
  return context.form[field.id]
}

const validateRequired = (field: FieldConfig, value: any, isPhoneRequired: boolean) => {
  const isRequired = field.type === 'tel' ? isPhoneRequired : field.required
  if (isRequired && (!value || (Array.isArray(value) && value.length === 0))) {
    return `請填寫 ${field.title || field.id}`
  }
  return null
}

const validateFieldCustom = (field: FieldConfig, context: any) => {
  if (field.validate) {
    try {
      const validator = new Function('context', `return (${field.validate})(context)`)
      return validator(context)
    } catch (e) {
      console.error(`Validation error in field ${field.id}:`, e)
    }
  }
  return null
}

const processPayload = (payload: any) => {
  if (Array.isArray(payload.properties)) {
    payload.properties = payload.properties.filter((p: any) => p !== null && p !== undefined)
  }
  return payload
}

const generatePayloadValue = (field: FieldConfig, value: any, context: any) => {
  if (!field.payloadValue) return value
  try {
    const generator = new Function('context', `return (${field.payloadValue})(context)`)
    return generator({ ...context, value })
  } catch (error) {
    console.error(`Payload generation error in field ${field.id}:`, error)
    return undefined
  }
}

// --- Components ---

const FieldRenderer: React.FC<{ field: FieldConfig; isPhoneRequired: boolean }> = ({ field, isPhoneRequired }) => {
  const isRequired = field.type === 'tel' ? isPhoneRequired : field.required
  if (field.type === 'hidden') return null

  return (
    <FormControl mb={6} isRequired={isRequired}>
      <FormLabel fontWeight="bold">{field.title || field.id}</FormLabel>
      {(() => {
        switch (field.type) {
          case 'multiple':
            return (
              <CheckboxGroup colorScheme="primary">
                <Stack spacing={2}>
                  {field.options?.map(opt => (
                    <Checkbox key={opt.id} name={field.id} value={opt.value}>
                      <Badge me={1} variant="outline" colorScheme="primary">
                        {opt.label}
                      </Badge>
                      {opt.description && <span>{opt.description}</span>}
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )
          case 'single':
            return (
              <Stack spacing={2}>
                {field.options?.map(opt => {
                  const uniqueId = `radio-${field.id}-${opt.id}`
                  return (
                    <label
                      key={opt.id}
                      htmlFor={uniqueId}
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <input
                        type="radio"
                        id={uniqueId}
                        className="chakra-radio__input"
                        name={field.id}
                        value={opt.value}
                        required={isRequired}
                      />
                      <div className="chakra-radio__label" style={{ marginLeft: '0.5rem' }}>
                        <Badge me={1} variant="outline" colorScheme="primary">
                          {opt.label}
                        </Badge>
                        <span style={{ fontWeight: 'normal' }}>{opt.description}</span>
                      </div>
                    </label>
                  )
                })}
              </Stack>
            )
          default:
            return (
              <Input
                name={field.id}
                type={field.type}
                placeholder={field.placeholder || field.title}
                pattern={field.pattern}
              />
            )
        }
      })()}
    </FormControl>
  )
}

const MeetingPage = () => {
  const { formatMessage } = useIntl()
  const { id: appId, settings, loading: loadingAppData } = useApp()
  const history = useHistory()
  const toast = useToast()
  const { username: managerUsername } = useParams<{ username: string }>()
  const [{ noHeader, noFooter }] = useQueryParams({ noHeader: BooleanParam, noFooter: BooleanParam })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isPhoneRequired = settings['member_profile_phone.check.ignore.enable'] !== '1'

  const config = useMemo(() => {
    try {
      const raw = JSON.parse(settings['custom.meeting_page'] || '{}')
      return { fields: (raw.fields || []) as FieldConfig[] }
    } catch (e) {
      return { fields: [] }
    }
  }, [settings])

  const { data: memberData, loading: loadingMember } = useQuery<
    hasura.GetMemberByUsername,
    hasura.GetMemberByUsernameVariables
  >(GetMemberByUsername, { skip: !managerUsername, variables: { appId, username: managerUsername } })

  if (loadingAppData || loadingMember) return <LoadingPage />
  if (settings['custom.permission_group.salesLead'] !== '1' || (managerUsername && !memberData?.member_public?.[0]))
    return <NotFoundPage />

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)

    const resolveContext: any = {
      utm: JSON.parse(Cookies.get('utm') || '{}'),
      cookie: { landing: Cookies.get('landing') || '' },
      form: {},
      formatMessage,
      MeetingPageMessages,
    }

    const populateForm = (field: FieldConfig) => {
      if (field.type !== 'hidden') {
        const val = field.type === 'multiple' ? formData.getAll(field.id) : formData.get(field.id)
        resolveContext.form[field.id] = val || (field.type === 'multiple' ? [] : '')
      }
      return field
    }

    try {
      const processFields = pipe(
        // A. 預掃描資料
        map(populateForm),
        // B. 計算與驗證
        map((field: FieldConfig) => {
          const value = calculateFinalValue(field, resolveContext)
          const error = validateRequired(field, value, isPhoneRequired) || validateFieldCustom(field, resolveContext)
          if (error) throw new Error(error)
          return { field, value }
        }),
        // C. 建立 Payload
        reduce(
          ifElse(
            (_: any, { field }: { field: FieldConfig; value: any }) => !field.path,
            identity,
            (acc, { field, value }) => setDeep(acc, field.path!, generatePayloadValue(field, value, resolveContext)),
          ),
          { managerUsername },
        ),
        // D. 處理 Payload (Cleanup)
        processPayload,
      )

      const payload = processFields(config.fields)

      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_ROOT}/sys/create-lead`, payload, {
        withCredentials: true,
      })
      if (data.code === 'SUCCESS') {
        Cookies.remove('utm')
        Cookies.remove('landing')
        history.push('/meets/us/completed')
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      if (error instanceof Error) {
        toast({ title: error.message, status: 'warning', position: 'top' })
      } else {
        console.error(error)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <DefaultLayout centeredBox noFooter={noFooter} noHeader={noHeader}>
      <StyledForm onSubmit={handleSubmit}>
        <Heading as="h3" size="lg" mb={8} textAlign="center">
          {formatMessage(MeetingPageMessages.MeetingPage.bookingLink, { managerUsername })}
        </Heading>
        {config.fields.map(field => (
          <FieldRenderer key={field.id} field={field} isPhoneRequired={isPhoneRequired} />
        ))}
        <Button width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting} mt={6} size="lg">
          {formatMessage(MeetingPageMessages.MeetingPage.submit)}
        </Button>
      </StyledForm>
    </DefaultLayout>
  )
}

export default MeetingPage

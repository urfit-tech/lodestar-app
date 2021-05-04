import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Icon } from '@chakra-ui/icons'
import { Input, Select, Typography } from 'antd'
import gql from 'graphql-tag'
import { debounce } from 'lodash'
import React, { useState } from 'react'
import { defineMessages, useIntl } from 'react-intl'
import styled from 'styled-components'
import hasura from '../../hasura'
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { PeriodType } from '../../types/program'
import { useAuth } from '../auth/AuthContext'
import AppointmentCoinModal from '../coin/AppointmentCoinModal'
import ProgramCoinModal from '../coin/ProgramCoinModal'
import ProgramPackageCoinModal from '../coin/ProgramPackageCoinModal'

const messages = defineMessages({
  searchProgramId: { id: 'project.ui.searchProgramId', defaultMessage: '搜尋課程編號' },
})

const StyledCoverBackground = styled.div<{ src: string }>`
  width: 100%;
  height: 234px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center center;
`
const StyledWrapper = styled.div`
  margin: 0 24px;
  max-width: 660px;
  width: 100%;
  padding: 0;
`
const StyledTitle = styled(Typography.Title)`
  && {
    color: white;
  }
`
const StyledPlaceHolder = styled.div`
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-44%);
`

const ProjectProgramSearchSection: React.FC<{
  projectId: string
  coverUrl: string
  category: string
}> = ({ projectId, coverUrl, category }) => {
  const { formatMessage } = useIntl()
  const apolloClient = useApolloClient()
  const { currentMemberId } = useAuth()
  const { projectPlan } = useEnrolledCoinProjectPlans(currentMemberId || '', projectId)

  const [searchText, setSearchText] = useState('')
  const [selectedType, setSelectedType] = useState('program_package')
  const [options, setOptions] = useState<
    {
      value: string
      label: string
    }[]
  >([])
  const [selectedId, setSelectedId] = useState('')
  const [visible, setVisible] = useState(false)

  const searchProduct = async (searchText: string) => {
    if (searchText.length < 2) {
      setOptions([])
      return
    }

    if (selectedType === 'program') {
      apolloClient
        .query<hasura.GET_PROGRAM_ID_BY_TITLE, hasura.GET_PROGRAM_ID_BY_TITLEVariables>({
          query: GET_PROGRAM_ID_BY_TITLE,
          variables: { programCategory: category, searchText: `%${searchText}%` },
        })
        .then(({ data }) => {
          setOptions(
            data.program.map(program => ({
              value: program.id,
              label: program.title,
            })),
          )
        })
    } else if (selectedType === 'program_package') {
      apolloClient
        .query<hasura.GET_PROGRAM_PACKAGE_ID_BY_TITLE, hasura.GET_PROGRAM_PACKAGE_ID_BY_TITLEVariables>({
          query: GET_PROGRAM_PACKAGE_ID_BY_TITLE,
          variables: {
            programPackageCategory: category,
            searchText: `%${searchText}%`,
          },
        })
        .then(({ data }) => {
          setOptions(
            data.program_package.map(programPackage => ({
              value: programPackage.id,
              label: programPackage.title,
            })),
          )
        })
    } else if (selectedType === 'appointment') {
      apolloClient
        .query<hasura.GET_APPOINTMENT_PLANS_ID, hasura.GET_APPOINTMENT_PLANS_IDVariables>({
          query: GET_APPOINTMENT_PLANS_ID,
          variables: { searchText: `%${searchText}%` },
        })
        .then(({ data }) => {
          setOptions(
            data.appointment_plan.map(appointmentPlan => ({
              value: appointmentPlan.id,
              label: `${appointmentPlan.creator?.name} | ${appointmentPlan.title}`,
            })),
          )
        })
    }
  }

  const searchProductDebounce = debounce(searchProduct, 500)

  return (
    <StyledCoverBackground src={coverUrl} className="d-flex align-items-center justify-content-center">
      <StyledWrapper>
        <StyledTitle className="label-center">{category}</StyledTitle>
        <Input.Group compact>
          <Select<string>
            value={selectedType}
            onChange={value => {
              setSelectedType(value)
              setSearchText('')
              setOptions([])
            }}
            style={{ width: '20%' }}
          >
            <Select.Option value="program">課程</Select.Option>
            <Select.Option value="program_package">組合</Select.Option>
            <Select.Option value="appointment">諮詢</Select.Option>
          </Select>
          <Select
            showSearch
            filterOption={false}
            value={searchText}
            style={{ width: '80%' }}
            suffixIcon={<Icon as={SearchIcon} />}
            onSearch={value => {
              setSearchText(value)
              searchProductDebounce(value)
            }}
            onSelect={(value: string) => {
              setSelectedId(value)
              setVisible(true)
            }}
            placeholder={<StyledPlaceHolder>{formatMessage(messages.searchProgramId)}</StyledPlaceHolder>}
          >
            {options.map(option => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Input.Group>
      </StyledWrapper>

      {!!projectPlan && selectedType === 'program' ? (
        <ProgramCoinModal
          programId={selectedId}
          periodAmount={projectPlan.periodAmount}
          periodType={projectPlan.periodType}
          projectPlanId={projectPlan.id}
          visible={visible}
          onCancel={() => setVisible(false)}
        />
      ) : !!projectPlan && selectedType === 'program_package' ? (
        <ProgramPackageCoinModal
          programPackageId={selectedId}
          periodAmount={projectPlan.periodAmount}
          periodType={projectPlan.periodType}
          projectPlanId={projectPlan.id}
          visible={visible}
          onCancel={() => setVisible(false)}
        />
      ) : selectedType === 'appointment' ? (
        <AppointmentCoinModal appointmentPlanId={selectedId} visible={visible} onCancel={() => setVisible(false)} />
      ) : null}
    </StyledCoverBackground>
  )
}

const GET_PROGRAM_ID_BY_TITLE = gql`
  query GET_PROGRAM_ID_BY_TITLE($programCategory: String!, $searchText: String!) {
    program(
      where: {
        title: { _ilike: $searchText }
        program_categories: { category: { name: { _eq: $programCategory } } }
        published_at: { _is_null: false }
        is_deleted: { _eq: false }
      }
    ) {
      id
      title
    }
  }
`
const GET_PROGRAM_PACKAGE_ID_BY_TITLE = gql`
  query GET_PROGRAM_PACKAGE_ID_BY_TITLE($programPackageCategory: String!, $searchText: String!) {
    program_package(
      where: {
        title: { _ilike: $searchText }
        program_package_categories: { category: { name: { _eq: $programPackageCategory } } }
        published_at: { _is_null: false }
      }
    ) {
      id
      title
    }
  }
`
const GET_APPOINTMENT_PLANS_ID = gql`
  query GET_APPOINTMENT_PLANS_ID($searchText: String!) {
    appointment_plan(where: { creator_id: { _like: $searchText }, title: { _like: "%私塾諮詢%" } }) {
      id
      title
      creator {
        id
        name
      }
    }
  }
`

const useEnrolledCoinProjectPlans = (memberId: string, projectId: string) => {
  const { loading, error, data, refetch } = useQuery<
    hasura.GET_ENROLLED_COIN_PROJECT_PLANS,
    hasura.GET_ENROLLED_COIN_PROJECT_PLANSVariables
  >(
    gql`
      query GET_ENROLLED_COIN_PROJECT_PLANS($memberId: String!, $projectId: uuid!) {
        project_plan_enrollment(
          where: {
            member_id: { _eq: $memberId }
            project_plan: { project_id: { _eq: $projectId }, title: { _like: "%私塾方案%" } }
          }
          limit: 1
        ) {
          project_plan {
            id
            title
            period_amount
            period_type
          }
        }
      }
    `,
    { variables: { memberId, projectId } },
  )

  const projectPlan: {
    id: string
    periodAmount: number
    periodType: PeriodType
  } | null =
    loading || error || !data || !data.project_plan_enrollment[0] || !data.project_plan_enrollment[0].project_plan
      ? null
      : {
          id: data.project_plan_enrollment[0].project_plan.id,
          periodAmount: data.project_plan_enrollment[0].project_plan.period_amount,
          periodType: data.project_plan_enrollment[0].project_plan.period_type as PeriodType,
        }

  return {
    loadingProjectPlan: loading,
    errorProjectPlan: error,
    projectPlan,
    refetchProjectPlan: refetch,
  }
}

export default ProjectProgramSearchSection

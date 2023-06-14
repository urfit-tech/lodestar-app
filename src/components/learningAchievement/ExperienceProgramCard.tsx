import { gql, useQuery } from '@apollo/client'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import hasura from '../../hasura'
import { checkLearningSystem } from '../../helpers/learning'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'
import ExperienceProgram from './ExperienceProgram'
import learningAchievementMessages from './translation'

const StyledCard = styled(AdminCard)`
  .ant-card-body {
    align-items: center;
    gap: 30px;
    padding: 20px;
    @media (min-width: ${BREAK_POINT}px) {
      flex-direction: row;
    }
  }
`
const StyledColGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`

const StyledRowGrid = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: auto;
  max-height: 500px;
  overflow-y: auto;
  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
  }
`

type ExperienceProduct = {
  __typename?: 'order_product' | undefined
  product: { __typename?: 'product' | undefined; type: string; target: string }
}

export const uniqueObjectArray = (array: any[]) => {
  return array.filter((value, index) => {
    const _value = JSON.stringify(value)
    return (
      index ===
      array.findIndex(obj => {
        return JSON.stringify(obj) === _value
      })
    )
  })
}

const ExperienceProgramCard: React.FC<{ currentMemberId: string | null }> = ({ currentMemberId }) => {
  const { formatMessage } = useIntl()
  const { memberId } = useParams<{ memberId: string }>()
  const { settings } = useApp()
  const {
    experienceProgramPlan,
    experienceProgramPackagePlan,
    loading: targetsLoading,
  } = useExperienceTargets(
    memberId || currentMemberId || '',
    checkLearningSystem(settings['custom']).experienceProgramLevel,
  )
  const { experienceProgramByPlan, loading: planLoading } = useExperienceProgramByPlan(experienceProgramPlan)
  const { experienceProgramByPackage, loading: packageLoading } =
    useExperienceProgramByPackage(experienceProgramPackagePlan)
  const isCardLoading = packageLoading && planLoading && targetsLoading
  const experiencePrograms = uniqueObjectArray([...experienceProgramByPlan, ...experienceProgramByPackage])
  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.ExperienceProgramCard.myProgram)}
        </Text>
        <StyledRowGrid>
          {isCardLoading && <Spinner />}
          {!isCardLoading && isEmpty(experienceProgramPlan) && isEmpty(experienceProgramPackagePlan) && (
            <div>{formatMessage(learningAchievementMessages.ExperienceProgramCard.noProgram)}</div>
          )}
          {!isCardLoading &&
            experiencePrograms.map((experienceProgram, i) => (
              <div key={i}>
                <ExperienceProgram
                  programTitle={experienceProgram.title}
                  programAbstract={experienceProgram.abstract}
                  programInstructors={experienceProgram.instructors}
                  programId={experienceProgram.id}
                />
              </div>
            ))}
        </StyledRowGrid>
      </StyledColGrid>
    </StyledCard>
  )
}

export const useExperienceTargets = (memberId: string, level: number) => {
  const { data, loading, error } = useQuery<hasura.GET_EXPERIENCE_PRODUCT, hasura.GET_EXPERIENCE_PRODUCTVariables>(
    gql`
      query GET_EXPERIENCE_PRODUCT($memberId: String!, $level: numeric) {
        order_log(
          where: {
            _and: [
              { member_id: { _eq: $memberId } }
              { order_products: { delivered_at: { _is_null: false } } }
              {
                _or: [
                  { order_products: { ended_at: { _gte: "now()" } } }
                  { order_products: { ended_at: { _is_null: true } } }
                ]
              }
              {
                _or: [
                  { order_products: { started_at: { _lte: "now()" } } }
                  { order_products: { started_at: { _is_null: true } } }
                ]
              }
            ]
          }
        ) {
          order_products(
            where: {
              product: { _and: [{ level: { _eq: $level } }, { type: { _in: ["ProgramPlan", "ProgramPackagePlan"] } }] }
            }
          ) {
            product {
              type
              target
            }
          }
        }
      }
    `,
    { variables: { memberId, level } },
  )
  const experienceProducts: ExperienceProduct[] = data ? data.order_log.map(o => o.order_products).flat() : []
  const experienceProgramPlan: string[] = experienceProducts
    ?.filter(ep => ep.product.type === 'ProgramPlan')
    .map(ep => ep.product.target)
  const experienceProgramPackagePlan: string[] = experienceProducts
    ?.filter(ep => ep.product.type === 'ProgramPackagePlan')
    .map(ep => ep.product.target)

  return {
    experienceProgramPlan,
    experienceProgramPackagePlan,
    loading,
    error,
  }
}

export const useExperienceProgramByPlan = (targets: string[]) => {
  const { data, loading, error } = useQuery<
    hasura.GET_EXPERIENCE_PROGRAM_BY_PLAN,
    hasura.GET_EXPERIENCE_PROGRAM_BY_PLANVariables
  >(
    gql`
      query GET_EXPERIENCE_PROGRAM_BY_PLAN($targets: [uuid!]) {
        program_plan(where: { id: { _in: $targets } }) {
          program {
            id
            title
            abstract
            instructors: program_roles(where: { name: { _eq: "instructor" } }) {
              member {
                name
              }
            }
          }
        }
      }
    `,
    { variables: { targets } },
  )

  const experienceProgramByPlan =
    data?.program_plan.map(pp => ({
      id: pp.program.id,
      title: pp.program.title,
      abstract: pp.program.abstract,
      instructors: pp.program.instructors.map(i => i.member?.name),
    })) || []
  return { experienceProgramByPlan, loading, error }
}

export const useExperienceProgramByPackage = (targets: string[]) => {
  const { data, loading, error } = useQuery<
    hasura.GET_EXPERIENCE_PROGRAM_BY_PACKAGE,
    hasura.GET_EXPERIENCE_PROGRAM_BY_PACKAGEVariables
  >(
    gql`
      query GET_EXPERIENCE_PROGRAM_BY_PACKAGE($targets: [uuid!]) {
        program_package_plan(where: { id: { _in: $targets } }) {
          program_package {
            program_package_programs {
              program {
                id
                title
                abstract
                instructors: program_roles(where: { name: { _eq: "instructor" } }) {
                  member {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
    { variables: { targets } },
  )
  const experienceProgramByPackage =
    data?.program_package_plan
      .map(pp => {
        return pp.program_package.program_package_programs.map(p => {
          return {
            id: p.program.id,
            title: p.program.title,
            abstract: p.program.abstract,
            instructors: p.program.instructors.map(i => i.member?.name),
          }
        })
      })
      .flat() || []

  return { experienceProgramByPackage, loading, error }
}
export default ExperienceProgramCard

import { gql, useQuery } from '@apollo/client'
import { Box, Spinner, Text } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import { useIntl } from 'react-intl'
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
    max-height: 600px;
    @media (min-width: ${BREAK_POINT}px) {
      height: 250px;
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
  height: 500px;
  overflow-y: scroll;
  @media (min-width: ${BREAK_POINT}px) {
    flex-direction: row;
    height: 250px;
  }
`

type VoucherProduct = {
  __typename?: 'order_product' | undefined
  product: { __typename?: 'product' | undefined; type: string; target: string }
}

const ExperienceProgramCard: React.FC<{ currentMemberId: string | null }> = ({ currentMemberId }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const {
    experienceProgramPlan,
    experienceProgramPackagePlan,
    loading: targetsLoading,
  } = useVoucherTargets(currentMemberId || '', checkLearningSystem(settings['custom']).experienceProgramLevel)
  const { experienceProgramByPlan, loading: planLoading } = useExperienceProgramByPlan(experienceProgramPlan)
  const { experienceProgramByPackage, loading: packageLoading } =
    useExperienceProgramByPackage(experienceProgramPackagePlan)
  const experiencePrograms = [...experienceProgramByPlan, ...experienceProgramByPackage]
  const isCardLoading = packageLoading && planLoading && targetsLoading

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

export const useVoucherTargets = (memberId: string, level: number) => {
  const { data, loading, error } = useQuery<hasura.GET_VOUCHER_PRODUCT, hasura.GET_VOUCHER_PRODUCTVariables>(
    gql`
      query GET_VOUCHER_PRODUCT($memberId: String!, $level: numeric) {
        order_log(where: { member_id: { _eq: $memberId } }) {
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
  const voucherProducts: VoucherProduct[] = data ? data.order_log.map(o => o.order_products).flat() : []
  const experienceProgramPlan: string[] = voucherProducts
    ?.filter(vp => vp.product.type === 'ProgramPlan')
    .map(vp => vp.product.target)
  const experienceProgramPackagePlan: string[] = voucherProducts
    ?.filter(vp => vp.product.type === 'ProgramPackagePlan')
    .map(vp => vp.product.target)

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

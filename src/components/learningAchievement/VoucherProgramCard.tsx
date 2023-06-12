import { Box, Spinner, Text } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import styled from 'styled-components'
import AdminCard from '../common/AdminCard'
import { BREAK_POINT } from '../common/Responsive'
import learningAchievementMessages from './translation'
import hasura from '../../hasura'
import VoucherProgram from './VoucherProgram'
import { gql, useQuery } from '@apollo/client'
import { isEmpty } from 'lodash'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'

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

const VoucherProgramCard: React.FC<{ currentMemberId: string | null }> = ({ currentMemberId }) => {
  const { formatMessage } = useIntl()
  const { settings } = useApp()
  const voucherProgramLevel = JSON.parse(settings['custom']).voucherProgramLevel // this setting is for cw！ if need to change, modify in db
  const {
    voucherProgramPlan,
    voucherProgramPackagePlan,
    loading: targetsLoading,
  } = useVoucherTargets(currentMemberId || '', voucherProgramLevel)
  const { voucherProgramByPlan, loading: planLoading } = useVoucherProgramByPlan(voucherProgramPlan)
  const { voucherProgramByPackage, loading: packageLoading } = useVoucherProgramByPackage(voucherProgramPackagePlan)
  const voucherPrograms = [...voucherProgramByPlan, ...voucherProgramByPackage]
  const isCardLoading = packageLoading && planLoading && targetsLoading

  return (
    <StyledCard>
      <StyledColGrid>
        <Text as="b" fontSize="lg">
          {formatMessage(learningAchievementMessages.VoucherProgramCard.myProgram)}
        </Text>
        <StyledRowGrid>
          {isCardLoading && <Spinner />}
          {!isCardLoading && isEmpty(voucherProgramPlan) && isEmpty(voucherProgramPackagePlan) && (
            <div>{formatMessage(learningAchievementMessages.VoucherProgramCard.noProgram)}</div>
          )}
          {!isCardLoading &&
            voucherPrograms.map((voucherProgram, i) => (
              <div key={i}>
                <VoucherProgram
                  programTitle={voucherProgram.title}
                  programAbstract={voucherProgram.abstract}
                  programInstructors={voucherProgram.instructors}
                  programId={voucherProgram.id}
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
  const voucherProgramPlan: string[] = voucherProducts
    ?.filter(vp => vp.product.type === 'ProgramPlan')
    .map(vp => vp.product.target)
  const voucherProgramPackagePlan: string[] = voucherProducts
    ?.filter(vp => vp.product.type === 'ProgramPackagePlan')
    .map(vp => vp.product.target)

  return {
    voucherProgramPlan,
    voucherProgramPackagePlan,
    loading,
    error,
  }
}

export const useVoucherProgramByPlan = (targets: string[]) => {
  const { data, loading, error } = useQuery<
    hasura.GET_VOUCHER_PROGRAM_BY_PLAN,
    hasura.GET_VOUCHER_PROGRAM_BY_PLANVariables
  >(
    gql`
      query GET_VOUCHER_PROGRAM_BY_PLAN($targets: [uuid!]) {
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

  const voucherProgramByPlan =
    data?.program_plan.map(pp => ({
      id: pp.program.id,
      title: pp.program.title,
      abstract: pp.program.abstract,
      instructors: pp.program.instructors.map(i => i.member?.name),
    })) || []
  return { voucherProgramByPlan, loading, error }
}

export const useVoucherProgramByPackage = (targets: string[]) => {
  const { data, loading, error } = useQuery<
    hasura.GET_VOUCHER_PROGRAM_BY_PACKAGE,
    hasura.GET_VOUCHER_PROGRAM_BY_PACKAGEVariables
  >(
    gql`
      query GET_VOUCHER_PROGRAM_BY_PACKAGE($targets: [uuid!]) {
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
  const voucherProgramByPackage =
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

  return { voucherProgramByPackage, loading, error }
}
export default VoucherProgramCard

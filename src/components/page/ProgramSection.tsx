import { Skeleton } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import React from 'react'
import styled from 'styled-components'
import { usePublishedProgramCollection } from '../../hooks/program'
import { ReactComponent as AngleRightIcon } from '../../images/angle-right.svg'
import { SectionTitle, StyledLink, StyledSection } from '../../pages/AppPage'
import ProgramCard from '../program/ProgramCard'

const StyledAngleRightIcon = styled(AngleRightIcon)`
  display: inline-block;
`

const ProgramSection: React.VFC<{ options: { title?: string; colAmount?: number; categoryId?: string } }> = ({
  options,
}) => {
  const { settings, currencyId: appCurrencyId, id: appId } = useApp()
  const { loadingPrograms, errorPrograms, programs } = usePublishedProgramCollection({
    isPrivate: false,
    categoryId: options?.categoryId,
  })

  if (loadingPrograms)
    return (
      <div className="container mb-5">
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </div>
    )

  if (programs.length === 0 || errorPrograms) return null

  if (settings['tracking.gtm_id'] && programs) {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer.push({ ecommerce: null })
    ;(window as any).dataLayer.push({
      ecommerce: {
        currencyCode: appCurrencyId || 'TWD',
        impressions: programs.slice(0, options?.colAmount || 3).map((program, index) => {
          const listPrice =
            program.isSubscription && program.plans.length > 0 ? program.plans[0].listPrice : program.listPrice || 0
          const salePrice =
            program.isSubscription && program.plans.length > 0 && (program.plans[0].soldAt?.getTime() || 0) > Date.now()
              ? program.plans[0].salePrice
              : (program.soldAt?.getTime() || 0) > Date.now()
              ? program.salePrice
              : undefined

          return {
            id: program.id,
            name: program.title,
            price: salePrice || listPrice,
            brand: settings['title'] || appId,
            category: program.categories.map(category => category.name).join('|'),
            variant: program.roles.map(role => role.memberName).join('|'),
            list: 'Program',
            position: index + 1,
          }
        }),
      },
    })
  }

  return (
    <StyledSection className="page-section">
      <SectionTitle>{options?.title || '線上課程'}</SectionTitle>

      <div className="container mb-5">
        <div className="row">
          {programs.slice(0, options?.colAmount || 3).map(program => (
            <div
              key={program.id}
              className={`col-12 col-lg-${(options?.colAmount && 12 / options?.colAmount) || 4} mb-5`}
            >
              <ProgramCard program={program} withMeta noInstructor />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <StyledLink to={`/programs${options?.categoryId ? '?active=' + options?.categoryId : ''}`}>
          查看更多 <StyledAngleRightIcon />
        </StyledLink>
      </div>
    </StyledSection>
  )
}

export default ProgramSection

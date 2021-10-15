import React from 'react'
import { Program, ProgramPlan } from '../../types/program'
import ProgramSubscriptionPlanCard from './ProgramSubscriptionPlanCard'

const ProgramSubscriptionPlanSection: React.VFC<{
  program: Program & {
    plans: (ProgramPlan & {
      isSubscription: boolean
    })[]
  }
  renderOneTimeSubscription?: (programPlan: ProgramPlan) => React.ReactElement
}> = ({ program, renderOneTimeSubscription }) => {
  return (
    <div id="subscription">
      {program.plans
        .filter(programPlan => programPlan.publishedAt)
        .map(programPlan => (
          <div key={programPlan.id} className="mb-3">
            {programPlan.isSubscription ? (
              <ProgramSubscriptionPlanCard programId={program.id} programPlan={programPlan} />
            ) : (
              renderOneTimeSubscription?.(programPlan)
            )}
          </div>
        ))}
    </div>
  )
}

export default ProgramSubscriptionPlanSection

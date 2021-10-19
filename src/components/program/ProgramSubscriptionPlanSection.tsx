import React from 'react'
import { Program, ProgramPlan } from '../../types/program'
import ProgramSubscriptionPlanCard from './ProgramSubscriptionPlanCard'

const ProgramSubscriptionPlanSection: React.VFC<{
  program: Program & {
    plans: (ProgramPlan & {
      isSubscription: boolean
    })[]
  }
}> = ({ program }) => {
  return (
    <div id="subscription">
      {program.plans
        .filter(programPlan => programPlan.publishedAt)
        .map(programPlan => (
          <div key={programPlan.id} className="mb-3">
            <ProgramSubscriptionPlanCard programId={program.id} programPlan={programPlan} />
          </div>
        ))}
    </div>
  )
}

export default ProgramSubscriptionPlanSection

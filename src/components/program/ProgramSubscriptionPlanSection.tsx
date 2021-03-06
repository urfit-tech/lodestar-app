import React from 'react'
import { useAuth } from '../../components/auth/AuthContext'
import { ProgramPlanProps, ProgramProps } from '../../types/program'
import ProgramSubscriptionPlanCard from './ProgramSubscriptionPlanCard'

const ProgramSubscriptionPlanSection: React.VFC<{
  program: ProgramProps & {
    plans: ProgramPlanProps[]
  }
}> = ({ program }) => {
  const { currentMemberId } = useAuth()
  return (
    <div id="subscription">
      {program.plans
        ?.filter(programPlan => programPlan.publishedAt)
        .map(programPlan => (
          <div key={programPlan.id} className="mb-3">
            <ProgramSubscriptionPlanCard
              memberId={currentMemberId || ''}
              programId={program.id}
              programPlan={programPlan}
            />
          </div>
        ))}
    </div>
  )
}

export default ProgramSubscriptionPlanSection

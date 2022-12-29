import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import { BooleanParam, StringParam, useQueryParam } from 'use-query-params'
import ProgramCard from '../../components/program/ProgramCard'
import { Category } from '../../types/general'
import { ProgramBriefProps, ProgramPlan, ProgramRole } from '../../types/program'

const ProgramCollection: React.FC<{
  programs: (ProgramBriefProps & {
    supportLocales: string[] | null
    categories: Category[]
    roles: ProgramRole[]
    plans: ProgramPlan[]
  })[]
}> = ({ programs }) => {
  const { id: appId } = useApp()
  const { isAuthenticating, authToken } = useAuth()
  const tracking = useTracking()
  const [type] = useQueryParam('type', StringParam)
  const [noPrice] = useQueryParam('noPrice', BooleanParam)
  const [noMeta] = useQueryParam('noMeta', BooleanParam)

  const { resourceCollection } = useResourceCollection(
    appId ? programs.map(program => `${appId}:program:${program.id}`) : [],
    true,
  )

  return (
    <div className="row">
      <Tracking.Impression resources={resourceCollection} />
      {programs.map((program, idx) => (
        <div key={program.id} className="col-12 col-md-6 col-lg-4 mb-4">
          <ProgramCard
            program={program}
            programType={type}
            noPrice={!!noPrice}
            withMeta={!noMeta}
            onClick={() => {
              const resource = resourceCollection[idx]
              resource && tracking.click(resource, { position: idx + 1 })
            }}
            previousPage={isAuthenticating && !authToken ? `programs` : undefined}
          />
        </div>
      ))}
    </div>
  )
}

export default ProgramCollection

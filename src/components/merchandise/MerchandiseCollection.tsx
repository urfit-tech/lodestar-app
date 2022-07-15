import Tracking from 'lodestar-app-element/src/components/common/Tracking'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useResourceCollection } from 'lodestar-app-element/src/hooks/resource'
import { useTracking } from 'lodestar-app-element/src/hooks/tracking'
import MerchandiseCard from './MerchandiseCard'
import { MerchandiseBriefProps } from '../../types/merchandise'

const MerchandiseCollection: React.FC<{ merchandises: MerchandiseBriefProps[] }> = ({ merchandises }) => {
  const { id: appId } = useApp()
  const tracking = useTracking()
  const { resourceCollection } = useResourceCollection(
    appId ? merchandises.map(merchandise => `${appId}:merchandise:${merchandise.id}`) : [],
    true,
  )

  return (
    <>
      <Tracking.Impression resources={resourceCollection} />
      {merchandises.map((merchandise, idx) => (
        <div key={merchandise.id} className="col-lg-4 col-12 mb-5">
          <MerchandiseCard
            id={merchandise.id}
            title={merchandise.title}
            soldAt={merchandise.soldAt}
            minPrice={merchandise.minPrice}
            maxPrice={merchandise.maxPrice}
            currencyId={merchandise.currencyId}
            specs={merchandise.specs}
            images={merchandise.images}
            onClick={() => {
              const resource = resourceCollection[idx]
              resource && tracking.click(resource, { position: idx + 1 })
            }}
          />
        </div>
      ))}
    </>
  )
}

export default MerchandiseCollection

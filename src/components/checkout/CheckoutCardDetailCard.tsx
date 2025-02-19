import PriceLabel from 'lodestar-app-element/src/components/labels/PriceLabel'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'

const CheckoutCardDetailCard: React.VFC<{
  key?: React.Key
  name: string
  price: number
  currencyId: string
  quantity?: number
}> = ({ key, name, price, currencyId, quantity }) => {
  const { currencyId: appCurrencyId } = useApp()
  console.log(13, name)
  return (
    <div key={key} className="row mb-2">
      <div className="col-6 offset-md-4 col-md-4">
        {name} x{quantity ?? 1}
      </div>
      <div className="col-6 col-md-4 text-right">
        <PriceLabel listPrice={price ?? 0} currencyId={currencyId || appCurrencyId} />
      </div>
    </div>
  )
}

export default CheckoutCardDetailCard

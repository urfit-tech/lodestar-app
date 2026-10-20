import { greedyOptimizer, DiscountForOptimizer } from './discountOptimization'

const cash = (identifier: string, amount: number, quantity = 1): DiscountForOptimizer => ({
  identifier,
  amount,
  quantity,
  unit: 'cash',
})

it('handles empty products and discounts without assigning a coupon', () => {
  expect(greedyOptimizer([])([cash('coupon', 100)])).toEqual([])
  expect(greedyOptimizer([{ identifier: 'product', price: 100 }])([])).toEqual([
    { identifier: 'product', price: 100, discount: undefined },
  ])
})

it('reserves remaining coupons for lower-priced products at the split boundary', () => {
  const result = greedyOptimizer([
    { identifier: 'small', price: 50 },
    { identifier: 'large', price: 100 },
  ])([cash('full', 100), cash('partial', 40)])
  expect(result.map(item => [item.identifier, item.discount?.identifier])).toEqual([
    ['large', 'full'],
    ['small', 'partial'],
  ])
})

it('honors coupon quantity without reusing exhausted coupons', () => {
  const result = greedyOptimizer([
    { identifier: 'a', price: 300 },
    { identifier: 'b', price: 200 },
    { identifier: 'c', price: 100 },
  ])([cash('coupon', 50, 2)])
  expect(result.filter(item => item.discount)).toHaveLength(2)
})

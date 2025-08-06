import { CouponProps } from 'lodestar-app-element/src/types/checkout'
import {
  allPass,
  always,
  assoc,
  complement,
  concat,
  converge,
  defaultTo,
  equals,
  filter,
  forEach,
  gte,
  head,
  identity,
  ifElse,
  lte,
  map,
  modify,
  path,
  pickAll,
  pipe,
  prop,
  propEq,
  props,
} from 'ramda'
import { MembershipCardProps } from '../../types/checkout'
import { DiscountForOptimizer, OptimizedResult, ProductForOptimizer } from './discountOptimization'
import { MultiPeriodProductDetail } from './MultiPeriod.type'

export const getAvailableCoupons = filter(
  allPass([
    pipe(complement(path(['status', 'used']) as (coupon: CouponProps) => boolean)),
    pipe(complement(path(['status', 'outdated']) as (coupon: CouponProps) => boolean)),
  ]),
)

export const getAvailableMembershipCards: (membershipCards: MembershipCardProps[]) => MembershipCardProps[] = filter(
  allPass([
    pipe(
      pipe(prop('startedAt') as (membershipCard: MembershipCardProps) => number, defaultTo(-Infinity)),
      gte(Number(new Date())),
    ),
    pipe(
      pipe(prop('endedAt') as (membershipCard: MembershipCardProps) => number, defaultTo(Infinity)),
      lte(Number(new Date())),
    ),
  ]),
)

export const availableDiscountGetterMap = { coupon: getAvailableCoupons, membershipCard: getAvailableMembershipCards }

const generateIdentifierOfProduct: (productDetail: MultiPeriodProductDetail) => Array<number> = pipe(
  props(['startedAt', 'endedAt']),
  map(Number),
)

export const productAdaptorForMultiPeriod: (
  productDetail: MultiPeriodProductDetail & { price: number },
) => ProductForOptimizer = pipe(
  converge(assoc, [always('identifier'), generateIdentifierOfProduct, identity]),
  pickAll(['identifier', 'price']),
) as any

export const couponAdaptorForMultiPeriod: (coupon: CouponProps) => DiscountForOptimizer = (pipe as any)(
  converge(assoc, [
    always('identifier'),
    pipe(prop('id') as (coupon: CouponProps) => string, concat('Coupon_')),
    identity,
  ]),
  converge(assoc, [always('unit'), path(['couponCode', 'couponPlan', 'type']), identity]),
  converge(assoc, [always('amount'), path(['couponCode', 'couponPlan', 'amount']), identity]),
  converge(assoc, [always('quantity'), pipe(path(['couponCode', 'couponPlan', 'quantity']), defaultTo(1)), identity]),
  pickAll(['identifier', 'unit', 'amount', 'quantity']),
)

export const membershipCardAdaptorForMultiPeriod: (membershipCard: MembershipCardProps) => DiscountForOptimizer = (
  pipe as any
)(
  converge(assoc, [
    always('identifier'),
    pipe(path(['card', 'id']) as (membershipCard: MembershipCardProps) => string, concat('Card_')),
    identity,
  ]),
  converge(assoc, [always('unit'), path(['card', 'card_discounts', 0, 'type']), identity]),
  converge(assoc, [always('amount'), path(['card', 'card_discounts', 0, 'amount']), identity]),
  converge(assoc, [
    always('quantity'),
    pipe(path(['card', 'card_discounts', 0, 'quantity']), defaultTo(Infinity)),
    identity,
  ]),
  pickAll(['identifier', 'unit', 'amount', 'quantity']),
  (ifElse as any)(propEq('percentage', 'unit'), modify('unit', always('percent')), identity),
)

export const discountAdaptorMapForMultiPeriod = {
  coupon: couponAdaptorForMultiPeriod,
  membershipCard: membershipCardAdaptorForMultiPeriod,
}

export const optimizedResultToProductDetail: (
  optimizedResults: Array<OptimizedResult>,
) => (productDetails: Array<MultiPeriodProductDetail>) => Array<MultiPeriodProductDetail> = optimizedResults =>
  forEach((productDetail: MultiPeriodProductDetail) =>
    (pipe as any)(
      () =>
        (filter as any)(pipe((prop as any)('identifier'), equals(generateIdentifierOfProduct(productDetail))))(
          optimizedResults,
        ),
      head,
      path(['discount', 'identifier']),
      (_: string) => (productDetail.discountId = _),
    )(productDetail),
  )

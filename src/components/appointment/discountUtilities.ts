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
  tail,
} from 'ramda'
import { MembershipCardProps } from '../../types/checkout'
import { DiscountForOptimizer, OptimizedResult, ProductForOptimizer } from './discountOptimization'
import { functionSelector } from './functionSelector'
import { MultiPeriodProductDetail } from './MultiPeriod.type'

export const getAvailableCoupons = (coupon: CouponProps[]) =>
  filter(
    allPass([
      pipe(complement(path(['status', 'used']) as (coupon: CouponProps) => boolean)),
      pipe(complement(path(['status', 'outdated']) as (coupon: CouponProps) => boolean)),
    ]),
  )(coupon)

export const getAvailableMembershipCards: (membershipCards: MembershipCardProps[]) => MembershipCardProps[] = (
  membershipCards: MembershipCardProps[],
) =>
  (filter as any)(
    allPass([
      (pipe as any)(prop('startedAt'), gte(Number(new Date()))),
      pipe(prop('endedAt'), lte(Number(new Date()))),
    ]),
  )(membershipCards)

const availableDiscountGetters = [getAvailableCoupons, getAvailableMembershipCards]
const availableDiscountGettersNamePattern = (type: string) =>
  `getAvailable${(head as any)(type).toUpperCase()}${tail(type)}s`
export const availableDiscountGetterSelector = functionSelector(availableDiscountGettersNamePattern)(
  availableDiscountGetters,
)

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

export const couponAdaptorForMultiPeriod: (coupon: CouponProps) => DiscountForOptimizer = (coupon: CouponProps) =>
  (pipe as any)(
    converge(assoc, [
      always('identifier'),
      pipe(prop('id') as (coupon: CouponProps) => string, concat('Coupon_')),
      identity,
    ]),
    converge(assoc, [always('unit'), path(['couponCode', 'couponPlan', 'type']), identity]),
    converge(assoc, [always('amount'), path(['couponCode', 'couponPlan', 'amount']), identity]),
    converge(assoc, [always('quantity'), pipe(path(['couponCode', 'couponPlan', 'quantity']), defaultTo(1)), identity]),
    pickAll(['identifier', 'unit', 'amount', 'quantity']),
  )(coupon)

export const membershipCardAdaptorForMultiPeriod: (membershipCard: MembershipCardProps) => DiscountForOptimizer = (
  membershipCard: MembershipCardProps,
) =>
  (pipe as any)(
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
  )(membershipCard)

const discountAdaptorsForMultiPeriod = [couponAdaptorForMultiPeriod, membershipCardAdaptorForMultiPeriod]
const discountAdaptorForMultiPeriodNamePattern = (type: string) => `${type}AdaptorForMultiPeriod`
export const discountAdaptorSelectorForMultiPeriod = functionSelector(discountAdaptorForMultiPeriodNamePattern)(
  discountAdaptorsForMultiPeriod,
)

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

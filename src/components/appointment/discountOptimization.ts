import {
  addIndex,
  always,
  chain,
  converge,
  descend,
  identity,
  ifElse,
  last,
  map,
  max,
  mergeLeft,
  min,
  modify,
  objOf,
  omit,
  pathEq,
  pipe,
  prop,
  reduce,
  repeat,
  sort,
  splitWhen,
} from 'ramda'

export type ProductForOptimizer = { identifier: any; price: number }
export type DiscountForOptimizer = { identifier: any; unit: 'percent' | 'cash'; amount: number; quantity: number }
export type OptimizedResult = ProductForOptimizer & { discount: DiscountForOptimizer | undefined }

type WithIndex = { index: number; length: number }

export type DiscountUsageOptimizer = (
  products: Array<ProductForOptimizer>,
) => (discounts: Array<DiscountForOptimizer>) => Array<OptimizedResult>

const percentangeToPrice = (productPrice: number) => (discount: DiscountForOptimizer) =>
  (discount.amount * productPrice) / 100

const standardize: (product: ProductForOptimizer) => (discount: DiscountForOptimizer | undefined) => number = product =>
  (ifElse as any)((pathEq as any)(['unit'], 'percent'), percentangeToPrice(product.price), prop('amount'))

const sortStandardized: (
  product: ProductForOptimizer,
) => (discounts: Array<DiscountForOptimizer>) => Array<DiscountForOptimizer> = product =>
  sort((a: DiscountForOptimizer, b: DiscountForOptimizer) =>
    standardize(product)(b) === standardize(product)(a)
      ? prop('quantity')(b) - prop('quantity')(a)
      : standardize(product)(b) - standardize(product)(a),
  ) as any

const findJustFullDiscountIndexInSortedDiscounts: (
  product: ProductForOptimizer,
) => (discounts: Array<DiscountForOptimizer>) => number = product =>
  pipe(
    map(pipe(standardize(product), objOf('value'))),
    appendArrayInfo,
    (reduce as any)(
      (
        res: { last: undefined | ({ value: number } & WithIndex); index: undefined | number },
        curr: { value: number } & WithIndex,
      ) => ({
        last: curr,
        index:
          res.last?.value &&
          ((res.last.value > product.price && curr.value < product.price) ||
            (res.last.value === product.price && res.last.value >= curr.value)) &&
          res.index === undefined
            ? res.last.index
            : res.index,
      }),
      { last: undefined, index: undefined },
    ),
    (prop as any)('index'),
  )

const appendArrayInfo: <O extends object>(arr: Array<O>) => Array<O & WithIndex> = arr =>
  addIndex(map)((item: any, index) => mergeLeft({ index, length: arr.length })(item), arr)

const unpackDiscounts: (
  leftProductAmount: number,
) => (discounts: Array<DiscountForOptimizer>) => Array<DiscountForOptimizer> = leftProductAmount =>
  pipe(
    (chain as any)(converge(repeat, [identity, pipe(prop('quantity'), min(leftProductAmount + 1))])),
    map((modify as any)('quantity', always(1))),
  )

export const greedyOptimizer: DiscountUsageOptimizer = products => discounts => {
  const sortedProducts = sort<ProductForOptimizer>(descend(prop('price')))(products)
  const sortedProductsWithIndex = appendArrayInfo(sortedProducts)

  type reducedResult = {
    dealtProducts: Array<ProductForOptimizer & WithIndex & { discount: DiscountForOptimizer | undefined }>
    leftDiscounts: Array<DiscountForOptimizer>
  }

  const reduceFn = (result: reducedResult, targetProduct: ProductForOptimizer & WithIndex): reducedResult => {
    const leftProductAmount = targetProduct.length - targetProduct.index - 1
    const sortedDiscounts = pipe(
      sortStandardized(targetProduct),
      unpackDiscounts(leftProductAmount),
    )(result.leftDiscounts)

    const discountsExtraAmount = max(0, result.leftDiscounts.length - leftProductAmount - 1)
    const justFullDiscountIndex = findJustFullDiscountIndexInSortedDiscounts(targetProduct)(sortedDiscounts) ?? 0

    const [discountsExtra, discountsReservedForLeftProducts]: Array<Array<DiscountForOptimizer>> = addIndex(
      splitWhen as any,
    )((_, index) => index > discountsExtraAmount)(sortedDiscounts)

    const [discountsWithFullDiscount, discountsWithPartialDiscount] = addIndex(splitWhen as any)(
      (_, index) => index > justFullDiscountIndex,
    )(sortedDiscounts)

    const targetDiscount = (last as any)(
      discountsWithPartialDiscount.length >= leftProductAmount ? discountsWithFullDiscount : discountsExtra,
    )

    const leftDiscounts: DiscountForOptimizer[] =
      discountsWithPartialDiscount.length >= leftProductAmount
        ? discountsWithPartialDiscount
        : discountsReservedForLeftProducts

    return {
      dealtProducts: result.dealtProducts.concat({
        ...targetProduct,
        discount: targetDiscount,
      }),
      leftDiscounts,
    }
  }

  return (pipe as any)(
    reduce(reduceFn, { dealtProducts: [], leftDiscounts: discounts }),
    prop('dealtProducts'),
    (map as any)(omit(['index', 'length'])),
  )(sortedProductsWithIndex)
}

export const optimizerMap = { greedy: greedyOptimizer }

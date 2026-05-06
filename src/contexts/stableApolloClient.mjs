const getClientKey = options => `${options.appId}\u0000${options.authToken || ''}`

export const createStableApolloClientFactory = createApolloClient => {
  let previousKey = null
  let previousClient = null

  return (options, errorCallbacks) => {
    const nextKey = getClientKey(options)

    if (!previousClient || previousKey !== nextKey) {
      previousClient = createApolloClient(options, errorCallbacks)
      previousKey = nextKey
    }

    return previousClient
  }
}

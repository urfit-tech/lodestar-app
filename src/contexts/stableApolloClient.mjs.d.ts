export function createStableApolloClientFactory<
  TOptions extends { appId: string; authToken?: string | null },
  TClient,
  TErrorCallbacks = unknown,
>(
  createApolloClient: (options: TOptions, errorCallbacks?: TErrorCallbacks) => TClient,
): (options: TOptions, errorCallbacks?: TErrorCallbacks) => TClient

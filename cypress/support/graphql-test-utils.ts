export const hasOperationName = (req: { body: { operationName?: string } }, operationName: string): boolean => {
  const { body } = req;
  return (
    Object.prototype.hasOwnProperty.call(body, 'operationName') &&
    body.operationName === operationName
  );
};

export const aliasQuery = (req: { body: { operationName?: string }; alias?: string }, operationName: string): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Query`;
  }
};

export const aliasMutation = (req: { body: { operationName?: string }; alias?: string }, operationName: string): void => {
  if (hasOperationName(req, operationName)) {
    req.alias = `gql${operationName}Mutation`;
  }
};

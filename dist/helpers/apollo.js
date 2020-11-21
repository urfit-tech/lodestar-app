import { notification } from 'antd';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { createHttpLink } from 'apollo-link-http';
import { v4 as uuidv4 } from 'uuid';
// create onError link
var onErrorLink = onError(function (_a) {
    var graphQLErrors = _a.graphQLErrors, networkError = _a.networkError;
    graphQLErrors &&
        graphQLErrors.forEach(function (_a) {
            var message = _a.message, locations = _a.locations, path = _a.path, extensions = _a.extensions;
            console.error("[GraphQL error]: Message: " + message + ", Location: " + locations + ", Path: " + path, extensions);
            if (extensions && extensions.code === 'invalid-jwt') {
                notification.info({ message: '連線已過期，將重新整理此畫面' });
                setTimeout(function () { return window.location.assign('/'); }, 3000);
            }
        });
    networkError && console.log("[Network error]: " + JSON.stringify(networkError));
});
// create auth context link
var withAuthTokenLink = function (_a) {
    var appId = _a.appId, authToken = _a.authToken;
    return setContext(function () {
        return authToken
            ? {
                headers: { authorization: "Bearer " + authToken },
            }
            : {
                headers: {
                    'x-hasura-app-id': appId,
                    'x-hasura-user-id': uuidv4(),
                    'x-hasura-role': 'anonymous',
                },
            };
    });
};
// create http link:
var httpLink = createHttpLink({ uri: "https://" + process.env.REACT_APP_GRAPHQL_HOST + "/v1/graphql" });
// create ws link
// const wsLink = new WebSocketLink({
//   uri: `wss://${process.env.REACT_APP_GRAPHQL_HOST}/v1/graphql`,
//   options: {
//     reconnect: true,
//   },
// })
// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query)
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
//   },
//   wsLink,
//   httpLink,
// )
export var createApolloClient = function (options) {
    var apolloClient = new ApolloClient({
        link: ApolloLink.from([onErrorLink, withAuthTokenLink(options), httpLink]),
        cache: new InMemoryCache(),
    });
    return apolloClient;
};
//# sourceMappingURL=apollo.js.map
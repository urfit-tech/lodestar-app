import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import { createApolloClient } from '../../helpers/apollo';
import { useAuth } from '../auth/AuthContext';
export var ApiProvider = function (_a) {
    var appId = _a.appId, children = _a.children;
    var authToken = useAuth().authToken;
    var apolloClient = createApolloClient({ appId: appId, authToken: authToken });
    return React.createElement(ApolloProvider, { client: apolloClient }, children);
};
//# sourceMappingURL=ApiContext.js.map
import React from 'react';
import { hydrate, render } from 'react-dom';
import { hot } from 'react-hot-loader/root';
import App from './Application';
import { unregister } from './serviceWorker';
var appId = process.env.REACT_APP_ID || '';
var Application = process.env.NODE_ENV === 'development' ? hot(App) : App;
var rootElement = document.getElementById('root');
if (rootElement && rootElement.hasChildNodes()) {
    hydrate(React.createElement(Application, { appId: appId }), rootElement);
}
else {
    render(React.createElement(Application, { appId: appId }), rootElement);
}
unregister();
//# sourceMappingURL=index.js.map
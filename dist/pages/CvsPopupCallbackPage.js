import queryString from 'query-string';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
var CvsPopupCallbackPage = function () {
    var location = useLocation();
    useEffect(function () {
        var params = queryString.parse(location.search);
        if (window.opener) {
            ;
            window.opener.callCvsPopupCallback(params);
            window.close();
        }
    }, [location.search]);
    return React.createElement("div", null);
};
export default CvsPopupCallbackPage;
//# sourceMappingURL=CvsPopupCallbackPage.js.map
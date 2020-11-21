import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
var SpGatewayForm = function (_a) {
    var formHtml = _a.formHtml, clientBackUrl = _a.clientBackUrl;
    var history = useHistory();
    useEffect(function () {
        formHtml ? document.write(formHtml) : history.push(clientBackUrl);
    }, [history, clientBackUrl, formHtml]);
    return React.createElement("div", null, "\u5C0E\u5411\u85CD\u65B0...");
};
export default SpGatewayForm;
//# sourceMappingURL=SpGatewayForm.js.map
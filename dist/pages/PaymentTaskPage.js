import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import { StyledContainer } from '../components/layout/DefaultLayout.styled';
import { useTask } from '../hooks/task';
var PaymentTaskPage = function () {
    var authToken = useAuth().authToken;
    var history = useHistory();
    var taskId = useParams().taskId;
    var _a = useTask('payment', taskId), task = _a.task, retry = _a.retry;
    useEffect(function () {
        if (authToken && (task === null || task === void 0 ? void 0 : task.finishedOn)) {
            history.push("/payments/" + task.returnvalue.paymentNo);
        }
    }, [history, authToken, task]);
    return (React.createElement(DefaultLayout, { noFooter: true, noHeader: true, centeredBox: true },
        React.createElement(StyledContainer, null,
            "\u7522\u751F\u4ED8\u6B3E\u8CC7\u8A0A\u4E2D...",
            (Math.exp(-1 / retry) * 100).toFixed(0),
            "%")));
};
export default PaymentTaskPage;
//# sourceMappingURL=PaymentTaskPage.js.map
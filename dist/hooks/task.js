import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
export var useTask = function (queue, taskId) {
    var _a = useAuth(), authToken = _a.authToken, backendEndpoint = _a.backendEndpoint;
    var _b = useState(0), retry = _b[0], setRetry = _b[1];
    var _c = useState(null), task = _c[0], setTask = _c[1];
    useEffect(function () {
        authToken &&
            backendEndpoint &&
            axios
                .get(backendEndpoint + "/tasks/" + queue + "/" + taskId, {
                headers: { authorization: "Bearer " + authToken },
            })
                .then(function (_a) {
                var _b = _a.data, code = _b.code, result = _b.result;
                if (code === 'SUCCESS') {
                    setTask(result);
                }
                if (!result || !result.finishedOn) {
                    setTimeout(function () { return setRetry(function (v) { return v + 1; }); }, 1000);
                }
            });
    }, [authToken, backendEndpoint, queue, taskId, retry]);
    return { task: task, retry: retry };
};
//# sourceMappingURL=task.js.map
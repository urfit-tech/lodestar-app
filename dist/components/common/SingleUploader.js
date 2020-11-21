var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Button, message, Spin, Upload } from 'antd';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { uploadFile } from '../../helpers';
import { commonMessages } from '../../helpers/translation';
import { useAuth } from '../auth/AuthContext';
var SingleUploader = function (_a) {
    var path = _a.path, value = _a.value, onChange = _a.onChange, trigger = _a.trigger, uploadText = _a.uploadText, reUploadText = _a.reUploadText, onUploading = _a.onUploading, onSuccess = _a.onSuccess, onError = _a.onError, onCancel = _a.onCancel, isPublic = _a.isPublic, uploadProps = __rest(_a, ["path", "value", "onChange", "trigger", "uploadText", "reUploadText", "onUploading", "onSuccess", "onError", "onCancel", "isPublic"]);
    var formatMessage = useIntl().formatMessage;
    var _b = useAuth(), authToken = _b.authToken, backendEndpoint = _b.backendEndpoint;
    var uploadCanceler = useRef();
    var _c = useState(false), loading = _c[0], setLoading = _c[1];
    var props = __assign(__assign({}, uploadProps), { fileList: value ? [value] : [], onChange: function (info) {
            onChange && onChange(info.file);
            if (info.file.status === 'uploading') {
                onUploading && onUploading(info);
            }
            else {
                setLoading(false);
                if (info.file.status === 'done') {
                    onSuccess ? onSuccess(info) : message.success(info.file.name + " \u4E0A\u50B3\u6210\u529F");
                }
                else if (info.file.status === 'error') {
                    onError ? onError(info) : message.error(info.file.name + " \u4E0A\u50B3\u5931\u6557");
                }
            }
        }, onRemove: function () {
            setLoading(false);
            onCancel && onCancel();
            onChange && onChange(undefined);
            uploadCanceler.current && uploadCanceler.current();
        }, customRequest: function (option) {
            var file = option.file, onProgress = option.onProgress, onError = option.onError, onSuccess = option.onSuccess;
            setLoading(true);
            onChange && onChange(file);
            uploadFile(path, file, authToken, backendEndpoint, {
                onUploadProgress: function (progressEvent) {
                    onProgress({
                        percent: (progressEvent.loaded / progressEvent.total) * 100,
                    });
                },
                cancelToken: new axios.CancelToken(function (canceler) {
                    uploadCanceler.current = canceler;
                }),
            })
                .then(onSuccess)
                .catch(onError);
        } });
    return (React.createElement(Upload, __assign({}, props), trigger ? (trigger({ loading: loading, value: value })) : loading ? (React.createElement("div", null,
        React.createElement(Spin, null),
        React.createElement("div", { style: { color: '#585858' } }, formatMessage(commonMessages.status.uploading)))) : (React.createElement(Button, { icon: "upload", loading: loading, disabled: loading }, value
        ? reUploadText || formatMessage(commonMessages.button.reupload)
        : uploadText || formatMessage(commonMessages.button.upload)))));
};
export default SingleUploader;
//# sourceMappingURL=SingleUploader.js.map
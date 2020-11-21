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
import { Select } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import { productMessages } from '../../helpers/translation';
import { useEnrolledProgramIds, useProgram } from '../../hooks/program';
export var EnrolledProgramSelector = function (_a) {
    var memberId = _a.memberId, selectProps = __rest(_a, ["memberId"]);
    var formatMessage = useIntl().formatMessage;
    var _b = useEnrolledProgramIds(memberId), enrolledProgramIds = _b.enrolledProgramIds, loadingProgramIds = _b.loadingProgramIds;
    return (React.createElement(Select, __assign({ loading: loadingProgramIds, style: { width: '100%' }, defaultValue: "all" }, selectProps),
        React.createElement(Select.Option, { key: "all" }, formatMessage(productMessages.program.select.option.allPrograms)),
        enrolledProgramIds
            .filter(function (enrolledProgramId) { return !!enrolledProgramId; })
            .map(function (programId) { return (React.createElement(Select.Option, { key: programId },
            React.createElement(ProgramSelectOptionValue, { programId: programId }))); })));
};
var ProgramSelectOptionValue = function (_a) {
    var programId = _a.programId;
    var program = useProgram(programId).program;
    return React.createElement(React.Fragment, null, program && program.title);
};
//# sourceMappingURL=ProgramSelector.js.map
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
import React from 'react';
import ProjectPlanCard from './ProjectPlanCard';
var ProjectPlanCollection = function (_a) {
    var projectPlans = _a.projectPlans;
    return (React.createElement(React.Fragment, null, projectPlans.map(function (projectPlan) { return (React.createElement("div", { key: projectPlan.id, className: "mb-4" },
        React.createElement(ProjectPlanCard, __assign({}, projectPlan)))); })));
};
export default ProjectPlanCollection;
//# sourceMappingURL=ProjectPlanCollection.js.map
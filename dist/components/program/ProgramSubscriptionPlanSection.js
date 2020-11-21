import React from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import ProgramSubscriptionPlanCard from './ProgramSubscriptionPlanCard';
var ProgramSubscriptionPlanSection = function (_a) {
    var _b;
    var program = _a.program;
    var currentMemberId = useAuth().currentMemberId;
    return (React.createElement("div", { id: "subscription" }, (_b = program.plans) === null || _b === void 0 ? void 0 : _b.filter(function (programPlan) { return programPlan.publishedAt; }).map(function (programPlan) { return (React.createElement("div", { key: programPlan.id, className: "mb-3" },
        React.createElement(ProgramSubscriptionPlanCard, { memberId: currentMemberId || '', programId: program.id, programPlan: programPlan }))); })));
};
export default ProgramSubscriptionPlanSection;
//# sourceMappingURL=ProgramSubscriptionPlanSection.js.map
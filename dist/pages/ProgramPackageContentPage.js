import { Skeleton } from 'antd';
import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { StringParam, useQueryParam } from 'use-query-params';
import { useAuth } from '../components/auth/AuthContext';
import DefaultLayout from '../components/layout/DefaultLayout';
import ProgramCollection from '../components/package/ProgramCollection';
import ProgramPackageBanner from '../components/package/ProgramPackageBanner';
import { ProgramDisplayedCard } from '../components/program/ProgramDisplayedCard';
import { ProgramDisplayedListItem } from '../components/program/ProgramDisplayedListItem';
import { useProgramPackage } from '../hooks/programPackage';
var ProgramPackageContentPage = function () {
    var programPackageId = useParams().programPackageId;
    var specificMemberId = useQueryParam('memberId', StringParam)[0];
    var _a = useAuth(), currentMemberId = _a.currentMemberId, currentUserRole = _a.currentUserRole;
    var memberId = specificMemberId || currentMemberId;
    var _b = useProgramPackage(programPackageId, memberId), loading = _b.loading, error = _b.error, programPackage = _b.programPackage, programs = _b.programs;
    if (loading || error || !currentUserRole || !programPackage) {
        return React.createElement(Skeleton, { active: true });
    }
    if (currentUserRole === 'general-member' && !programPackage.isEnrolled) {
        return React.createElement(Redirect, { to: "/program-packages/" + programPackageId });
    }
    return (React.createElement(DefaultLayout, null,
        React.createElement("div", null,
            React.createElement(ProgramPackageBanner, { programPackageId: programPackageId, title: programPackage.title, coverUrl: programPackage.coverUrl, isEnrolled: true }),
            React.createElement("div", { className: "py-5" },
                React.createElement(ProgramCollection, { programs: programs, renderItem: function (_a) {
                        var program = _a.program, displayType = _a.displayType;
                        return displayType === 'grid' ? (React.createElement(Link, { className: "col-12 col-md-6 col-lg-4", to: "/programs/" + program.id + "/contents?back=program-package_" + programPackageId },
                            React.createElement(ProgramDisplayedCard, { key: program.id, program: program, memberId: memberId }))) : displayType === 'list' ? (React.createElement(Link, { className: "col-12", to: "/programs/" + program.id + "/contents?back=program-package_" + programPackageId },
                            React.createElement(ProgramDisplayedListItem, { key: program.id, program: program, memberId: memberId }))) : null;
                    } })))));
};
export default ProgramPackageContentPage;
//# sourceMappingURL=ProgramPackageContentPage.js.map
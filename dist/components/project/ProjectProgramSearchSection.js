var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useApolloClient, useQuery } from '@apollo/react-hooks';
import { Input, Select, Typography } from 'antd';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import Icon from 'react-inlinesvg';
import { defineMessages, useIntl } from 'react-intl';
import styled from 'styled-components';
import SearchIcon from '../../images/search.svg';
import { useAuth } from '../auth/AuthContext';
import AppointmentCoinModal from '../coin/AppointmentCoinModal';
import ProgramCoinModal from '../coin/ProgramCoinModal';
import ProgramPackageCoinModal from '../coin/ProgramPackageCoinModal';
var messages = defineMessages({
    searchProgramId: { id: 'project.ui.searchProgramId', defaultMessage: '搜尋課程編號' },
});
var StyledCoverBackground = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  width: 100%;\n  height: 234px;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center center;\n"], ["\n  width: 100%;\n  height: 234px;\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center center;\n"])), function (props) { return props.src; });
var StyledWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0 24px;\n  max-width: 660px;\n  width: 100%;\n  padding: 0;\n"], ["\n  margin: 0 24px;\n  max-width: 660px;\n  width: 100%;\n  padding: 0;\n"])));
var StyledTitle = styled(Typography.Title)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  && {\n    color: white;\n  }\n"], ["\n  && {\n    color: white;\n  }\n"])));
var StyledPlaceHolder = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  top: 50%;\n  left: 2px;\n  transform: translateY(-44%);\n"], ["\n  position: absolute;\n  top: 50%;\n  left: 2px;\n  transform: translateY(-44%);\n"])));
var ProjectProgramSearchSection = function (_a) {
    var projectId = _a.projectId, coverUrl = _a.coverUrl, category = _a.category;
    var formatMessage = useIntl().formatMessage;
    var apolloClient = useApolloClient();
    var currentMemberId = useAuth().currentMemberId;
    var projectPlan = useEnrolledCoinProjectPlans(currentMemberId || '', projectId).projectPlan;
    var _b = useState(''), searchText = _b[0], setSearchText = _b[1];
    var _c = useState('program_package'), selectedType = _c[0], setSelectedType = _c[1];
    var _d = useState([]), options = _d[0], setOptions = _d[1];
    var _e = useState(''), selectedId = _e[0], setSelectedId = _e[1];
    var _f = useState(false), visible = _f[0], setVisible = _f[1];
    var searchProduct = function (searchText) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (searchText.length < 2) {
                setOptions([]);
                return [2 /*return*/];
            }
            if (selectedType === 'program') {
                apolloClient
                    .query({
                    query: GET_PROGRAM_ID_BY_TITLE,
                    variables: { programCategory: category, searchText: "%" + searchText + "%" },
                })
                    .then(function (_a) {
                    var data = _a.data;
                    setOptions(data.program.map(function (program) { return ({
                        value: program.id,
                        label: program.title,
                    }); }));
                });
            }
            else if (selectedType === 'program_package') {
                apolloClient
                    .query({
                    query: GET_PROGRAM_PACKAGE_ID_BY_TITLE,
                    variables: {
                        programPackageCategory: category,
                        searchText: "%" + searchText + "%",
                    },
                })
                    .then(function (_a) {
                    var data = _a.data;
                    setOptions(data.program_package.map(function (programPackage) { return ({
                        value: programPackage.id,
                        label: programPackage.title,
                    }); }));
                });
            }
            else if (selectedType === 'appointment') {
                apolloClient
                    .query({
                    query: GET_APPOINTMENT_PLANS_ID,
                    variables: { searchText: "%" + searchText + "%" },
                })
                    .then(function (_a) {
                    var data = _a.data;
                    setOptions(data.appointment_plan.map(function (appointmentPlan) {
                        var _a;
                        return ({
                            value: appointmentPlan.id,
                            label: ((_a = appointmentPlan.creator) === null || _a === void 0 ? void 0 : _a.name) + " | " + appointmentPlan.title,
                        });
                    }));
                });
            }
            return [2 /*return*/];
        });
    }); };
    var searchProductDebounce = debounce(searchProduct, 500);
    return (React.createElement(StyledCoverBackground, { src: coverUrl, className: "d-flex align-items-center justify-content-center" },
        React.createElement(StyledWrapper, null,
            React.createElement(StyledTitle, { className: "label-center" }, category),
            React.createElement(Input.Group, { compact: true },
                React.createElement(Select, { value: selectedType, onChange: function (value) {
                        setSelectedType(value);
                        setSearchText('');
                        setOptions([]);
                    }, style: { width: '20%' } },
                    React.createElement(Select.Option, { value: "program" }, "\u8AB2\u7A0B"),
                    React.createElement(Select.Option, { value: "program_package" }, "\u7D44\u5408"),
                    React.createElement(Select.Option, { value: "appointment" }, "\u8AEE\u8A62")),
                React.createElement(Select, { showSearch: true, filterOption: false, value: searchText, style: { width: '80%' }, suffixIcon: React.createElement(Icon, { src: SearchIcon }), onSearch: function (value) {
                        setSearchText(value);
                        searchProductDebounce(value);
                    }, onSelect: function (value) {
                        setSelectedId(value);
                        setVisible(true);
                    }, placeholder: React.createElement(StyledPlaceHolder, null, formatMessage(messages.searchProgramId)) }, options.map(function (option) { return (React.createElement(Select.Option, { key: option.value, value: option.value }, option.label)); })))),
        !!projectPlan && selectedType === 'program' ? (React.createElement(ProgramCoinModal, { programId: selectedId, periodAmount: projectPlan.periodAmount, periodType: projectPlan.periodType, visible: visible, onCancel: function () { return setVisible(false); } })) : !!projectPlan && selectedType === 'program_package' ? (React.createElement(ProgramPackageCoinModal, { programPackageId: selectedId, periodAmount: projectPlan.periodAmount, periodType: projectPlan.periodType, visible: visible, onCancel: function () { return setVisible(false); } })) : selectedType === 'appointment' ? (React.createElement(AppointmentCoinModal, { appointmentPlanId: selectedId, visible: visible, onCancel: function () { return setVisible(false); } })) : null));
};
var GET_PROGRAM_ID_BY_TITLE = gql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  query GET_PROGRAM_ID_BY_TITLE($programCategory: String!, $searchText: String!) {\n    program(\n      where: {\n        title: { _ilike: $searchText }\n        program_categories: { category: { name: { _eq: $programCategory } } }\n        published_at: { _is_null: false }\n        is_deleted: { _eq: false }\n      }\n    ) {\n      id\n      title\n    }\n  }\n"], ["\n  query GET_PROGRAM_ID_BY_TITLE($programCategory: String!, $searchText: String!) {\n    program(\n      where: {\n        title: { _ilike: $searchText }\n        program_categories: { category: { name: { _eq: $programCategory } } }\n        published_at: { _is_null: false }\n        is_deleted: { _eq: false }\n      }\n    ) {\n      id\n      title\n    }\n  }\n"])));
var GET_PROGRAM_PACKAGE_ID_BY_TITLE = gql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  query GET_PROGRAM_PACKAGE_ID_BY_TITLE($programPackageCategory: String!, $searchText: String!) {\n    program_package(\n      where: {\n        title: { _ilike: $searchText }\n        program_package_categories: { category: { name: { _eq: $programPackageCategory } } }\n        published_at: { _is_null: false }\n      }\n    ) {\n      id\n      title\n    }\n  }\n"], ["\n  query GET_PROGRAM_PACKAGE_ID_BY_TITLE($programPackageCategory: String!, $searchText: String!) {\n    program_package(\n      where: {\n        title: { _ilike: $searchText }\n        program_package_categories: { category: { name: { _eq: $programPackageCategory } } }\n        published_at: { _is_null: false }\n      }\n    ) {\n      id\n      title\n    }\n  }\n"])));
var GET_APPOINTMENT_PLANS_ID = gql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  query GET_APPOINTMENT_PLANS_ID($searchText: String!) {\n    appointment_plan(where: { creator_id: { _like: $searchText }, title: { _like: \"%\u79C1\u587E\u8AEE\u8A62%\" } }) {\n      id\n      title\n      creator {\n        id\n        name\n      }\n    }\n  }\n"], ["\n  query GET_APPOINTMENT_PLANS_ID($searchText: String!) {\n    appointment_plan(where: { creator_id: { _like: $searchText }, title: { _like: \"%\u79C1\u587E\u8AEE\u8A62%\" } }) {\n      id\n      title\n      creator {\n        id\n        name\n      }\n    }\n  }\n"])));
var useEnrolledCoinProjectPlans = function (memberId, projectId) {
    var _a = useQuery(gql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n      query GET_ENROLLED_COIN_PROJECT_PLANS($memberId: String!, $projectId: uuid!) {\n        project_plan_enrollment(\n          where: { member_id: { _eq: $memberId }, project_plan: { project_id: { _eq: $projectId } } }\n          limit: 1\n        ) {\n          project_plan {\n            id\n            title\n            period_amount\n            period_type\n          }\n        }\n      }\n    "], ["\n      query GET_ENROLLED_COIN_PROJECT_PLANS($memberId: String!, $projectId: uuid!) {\n        project_plan_enrollment(\n          where: { member_id: { _eq: $memberId }, project_plan: { project_id: { _eq: $projectId } } }\n          limit: 1\n        ) {\n          project_plan {\n            id\n            title\n            period_amount\n            period_type\n          }\n        }\n      }\n    "]))), { variables: { memberId: memberId, projectId: projectId } }), loading = _a.loading, error = _a.error, data = _a.data, refetch = _a.refetch;
    var projectPlan = loading || error || !data || !data.project_plan_enrollment[0] || !data.project_plan_enrollment[0].project_plan
        ? null
        : {
            id: data.project_plan_enrollment[0].project_plan.id,
            periodAmount: data.project_plan_enrollment[0].project_plan.period_amount,
            periodType: data.project_plan_enrollment[0].project_plan.period_type,
        };
    return {
        loadingProjectPlan: loading,
        errorProjectPlan: error,
        projectPlan: projectPlan,
        refetchProjectPlan: refetch,
    };
};
export default ProjectProgramSearchSection;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=ProjectProgramSearchSection.js.map
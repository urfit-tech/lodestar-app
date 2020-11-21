var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { commonMessages } from '../../helpers/translation';
var StyledInput = styled(Input)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  padding-right: 2rem;\n  color: var(--gray-darker);\n  border-radius: 1.5rem;\n  border-color: #e8e8e8;\n  ::placeholder {\n    color: var(--gray);\n  }\n  &:focus {\n    border-color: var(--gray-dark);\n    box-shadow: none;\n  }\n"], ["\n  padding-right: 2rem;\n  color: var(--gray-darker);\n  border-radius: 1.5rem;\n  border-color: #e8e8e8;\n  ::placeholder {\n    color: var(--gray);\n  }\n  &:focus {\n    border-color: var(--gray-dark);\n    box-shadow: none;\n  }\n"])));
var GlobalSearchInput = function () {
    var formatMessage = useIntl().formatMessage;
    var history = useHistory();
    var searchInputRef = useRef(null);
    var handleSearch = function () {
        var _a;
        ((_a = searchInputRef.current) === null || _a === void 0 ? void 0 : _a.value) && history.push("/search?q=" + searchInputRef.current.value);
    };
    return (React.createElement("form", { onSubmit: function (e) {
            e.preventDefault();
            handleSearch();
        } },
        React.createElement(InputGroup, null,
            React.createElement(StyledInput, { ref: searchInputRef, size: "sm", placeholder: formatMessage(commonMessages.ui.search) }),
            React.createElement(InputRightElement, { children: React.createElement(Icon, { as: AiOutlineSearch, className: "cursor-pointer", onClick: function () { return handleSearch(); } }) }))));
};
export default GlobalSearchInput;
var templateObject_1;
//# sourceMappingURL=GlobalSearchInput.js.map
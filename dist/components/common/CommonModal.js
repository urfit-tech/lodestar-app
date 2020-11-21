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
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, } from '@chakra-ui/react';
import React from 'react';
var CommonModal = function (_a) {
    var title = _a.title, renderTrigger = _a.renderTrigger, renderFooter = _a.renderFooter, children = _a.children, ModalProps = __rest(_a, ["title", "renderTrigger", "renderFooter", "children"]);
    return (React.createElement(React.Fragment, null,
        renderTrigger(),
        React.createElement(Modal, __assign({}, ModalProps),
            React.createElement(ModalOverlay, null),
            React.createElement(ModalContent, null,
                React.createElement(ModalHeader, null, title),
                React.createElement(ModalCloseButton, null),
                React.createElement(ModalBody, null, children),
                renderFooter && React.createElement(ModalFooter, null, renderFooter())))));
};
export default CommonModal;
//# sourceMappingURL=CommonModal.js.map
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
import { Modal } from 'antd';
import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { desktopViewMixin } from '../../helpers';
import AngleThinLeft from '../../images/angle-thin-left.svg';
import AngleThinRight from '../../images/angle-thin-right.svg';
import MerchandiseBlock from '../merchandise/MerchandiseBlock';
var StyledModal = styled(Modal)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  z-index: 1004;\n  margin: 0;\n  padding: 0;\n  max-width: 100%;\n  width: 100%;\n\n  .ant-modal-body {\n    padding: 2rem;\n  }\n\n  ", "\n"], ["\n  z-index: 1004;\n  margin: 0;\n  padding: 0;\n  max-width: 100%;\n  width: 100%;\n\n  .ant-modal-body {\n    padding: 2rem;\n  }\n\n  ",
    "\n"])), desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    width: 60rem;\n  "], ["\n    width: 60rem;\n  "])))));
var StyledSwitchBlock = styled.div(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  display: block;\n  position: fixed;\n  top: 50%;\n  width: 2rem;\n  height: 2rem;\n  background-size: cover;\n  background-position: center;\n  transform: translateY(-50%);\n  cursor: pointer;\n\n  ", "\n\n  ", "\n"], ["\n  display: block;\n  position: fixed;\n  top: 50%;\n  width: 2rem;\n  height: 2rem;\n  background-size: cover;\n  background-position: center;\n  transform: translateY(-50%);\n  cursor: pointer;\n\n  ",
    "\n\n  ",
    "\n"])), function (props) {
    return props.variant === 'left'
        ? css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n          left: 0.25rem;\n          background-image: url(", ");\n        "], ["\n          left: 0.25rem;\n          background-image: url(", ");\n        "])), AngleThinLeft) : css(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n          right: 0.25rem;\n          background-image: url(", ");\n        "], ["\n          right: 0.25rem;\n          background-image: url(", ");\n        "])), AngleThinRight);
}, function (props) {
    return desktopViewMixin(css(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n      position: absolute;\n      width: 4rem;\n      height: 4rem;\n\n      ", "\n    "], ["\n      position: absolute;\n      width: 4rem;\n      height: 4rem;\n\n      ",
        "\n    "])), props.variant === 'left'
        ? css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n            left: -4rem;\n          "], ["\n            left: -4rem;\n          "]))) : css(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n            right: -4rem;\n          "], ["\n            right: -4rem;\n          "])))));
});
var MerchandiseModal = function (_a) {
    var renderTrigger = _a.renderTrigger, merchandises = _a.merchandises, modalProps = __rest(_a, ["renderTrigger", "merchandises"]);
    var _b = useState(false), visible = _b[0], setVisible = _b[1];
    var _c = useState(0), merchandiseIndex = _c[0], setMerchandiseIndex = _c[1];
    var targetMerchandise = merchandises[merchandiseIndex];
    return (React.createElement(React.Fragment, null,
        renderTrigger({ setVisible: function () { return setVisible(true); } }),
        visible && (React.createElement(StyledModal, __assign({ title: null, footer: null, width: "", centered: true, destroyOnClose: true, visible: visible, onCancel: function () { return setVisible(false); } }, modalProps, { maskStyle: { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }),
            merchandises.length > 1 && (React.createElement(React.Fragment, null,
                React.createElement(StyledSwitchBlock, { variant: "left", onClick: function () {
                        return merchandiseIndex === 0
                            ? setMerchandiseIndex(merchandises.length - 1)
                            : setMerchandiseIndex(merchandiseIndex - 1);
                    } }),
                React.createElement(StyledSwitchBlock, { variant: "right", onClick: function () {
                        return merchandiseIndex === merchandises.length - 1
                            ? setMerchandiseIndex(0)
                            : setMerchandiseIndex(merchandiseIndex + 1);
                    } }))),
            React.createElement("div", { className: "container" },
                React.createElement(MerchandiseBlock, { merchandise: targetMerchandise }))))));
};
export default MerchandiseModal;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8;
//# sourceMappingURL=MerchandiseModal.js.map
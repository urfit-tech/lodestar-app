var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Input } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
var StyledInputGroup = styled(Input.Group)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  && {\n    width: auto;\n    input {\n      width: 5rem;\n      text-align: center;\n    }\n  }\n"], ["\n  && {\n    width: auto;\n    input {\n      width: 5rem;\n      text-align: center;\n    }\n  }\n"])));
var QuantityInput = function (_a) {
    var _b = _a.value, value = _b === void 0 ? 0 : _b, _c = _a.min, min = _c === void 0 ? -Infinity : _c, _d = _a.max, max = _d === void 0 ? Infinity : _d, onChange = _a.onChange;
    var _e = useState("" + value), inputValue = _e[0], setInputValue = _e[1];
    return (React.createElement(StyledInputGroup, { compact: true },
        React.createElement(Button, { icon: "minus", onClick: function () {
                var result = value - 1 <= min ? min : value - 1;
                onChange && onChange(result);
                setInputValue("" + result);
            }, disabled: min === value }),
        React.createElement(Input, { value: inputValue, onChange: function (e) { return setInputValue(e.target.value); }, onBlur: function (e) {
                var newValue = Number.isSafeInteger(parseInt(e.target.value)) ? parseInt(e.target.value) : value;
                var result = newValue <= min ? min : newValue >= max ? max : newValue;
                onChange && onChange(result);
                setInputValue("" + result);
            } }),
        React.createElement(Button, { icon: "plus", onClick: function () {
                var result = value + 1 >= max ? max : value + 1;
                onChange && onChange(result);
                setInputValue("" + result);
            }, disabled: max === value })));
};
export default QuantityInput;
var templateObject_1;
//# sourceMappingURL=QuantityInput.js.map
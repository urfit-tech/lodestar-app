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
import MediaQuery from 'react-responsive';
var Responsive = {
    Default: function (props) { return React.createElement(MediaQuery, __assign({}, props, { maxWidth: BREAK_POINT - 1 })); },
    Desktop: function (props) { return React.createElement(MediaQuery, __assign({}, props, { minWidth: BREAK_POINT })); },
};
export var BREAK_POINT = 992;
export default Responsive;
//# sourceMappingURL=Responsive.js.map
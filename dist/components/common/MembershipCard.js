var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { render } from 'mustache';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import DefaultAvatar from '../../images/avatar.svg';
var StyledContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: relative;\n  padding-top: 62.5%;\n"], ["\n  position: relative;\n  padding-top: 62.5%;\n"])));
var StyledMembershipCard = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 400px;\n  overflow: hidden;\n  white-space: nowrap;\n  transform: scale(", ");\n  transform-origin: top left;\n"], ["\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 400px;\n  overflow: hidden;\n  white-space: nowrap;\n  transform: scale(", ");\n  transform-origin: top left;\n"])), function (props) { return props.scale; });
var MembershipCard = function (_a) {
    var template = _a.template, templateVars = _a.templateVars;
    var _b = useState(0), scale = _b[0], setScale = _b[1];
    var containerRef = useRef(null);
    var cardRef = useRef(null);
    if (templateVars && !templateVars.avatar) {
        templateVars.avatar = DefaultAvatar;
    }
    var handleResize = useCallback(function () {
        if (containerRef.current && cardRef.current) {
            setScale(containerRef.current.offsetWidth / cardRef.current.offsetWidth);
        }
    }, [containerRef, cardRef]);
    useEffect(function () {
        handleResize();
        window.addEventListener('resize', handleResize);
        return function () { return window.removeEventListener('resize', handleResize); };
    }, [handleResize]);
    return (React.createElement(StyledContainer, { ref: containerRef },
        React.createElement(StyledMembershipCard, { ref: cardRef, scale: scale, dangerouslySetInnerHTML: { __html: render(template, templateVars) } })));
};
export default MembershipCard;
var templateObject_1, templateObject_2;
//# sourceMappingURL=MembershipCard.js.map
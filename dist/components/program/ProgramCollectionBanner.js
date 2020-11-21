var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
var StyledWrapper = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1.5rem;\n"], ["\n  margin-bottom: 1.5rem;\n"])));
var StyledImage = styled.img(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: 100%;\n"], ["\n  width: 100%;\n"])));
var LinkWrapper = function (_a) {
    var link = _a.link, children = _a.children;
    if (!link) {
        return React.createElement(React.Fragment, null, children);
    }
    if (link.startsWith('http')) {
        return (React.createElement("a", { href: link, rel: "noopener noreferrer" }, children));
    }
    return React.createElement(Link, { to: link }, children);
};
var ProgramCollectionBanner = function (_a) {
    var link = _a.link, imgUrls = _a.imgUrls;
    var _b = useState(null), imgUrl = _b[0], setImgUrl = _b[1];
    var handleResize = useCallback(function () {
        var targetWidth = Object.keys(imgUrls)
            .map(function (v) { return parseInt(v); })
            .sort(function (a, b) { return b - a; })
            .find(function (minWidth) { return window.innerWidth > minWidth; });
        if (!targetWidth || !imgUrls[targetWidth]) {
            setImgUrl(imgUrls[0]);
        }
        else {
            setImgUrl(imgUrls[targetWidth]);
        }
    }, [imgUrls]);
    useEffect(function () {
        handleResize();
        window.addEventListener('resize', handleResize);
        return function () { return window.removeEventListener('resize', handleResize); };
    }, [handleResize]);
    if (!imgUrl) {
        return null;
    }
    return (React.createElement(StyledWrapper, null,
        React.createElement(LinkWrapper, { link: link },
            React.createElement(StyledImage, { src: imgUrl, alt: "program-collection-banner" }))));
};
export default ProgramCollectionBanner;
var templateObject_1, templateObject_2;
//# sourceMappingURL=ProgramCollectionBanner.js.map
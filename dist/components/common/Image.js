var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import styled from 'styled-components';
import DefaultAvatar from '../../images/avatar.svg';
export var AvatarImage = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  ", "\n  background-color: ", ";\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  border-radius: ", ";\n"], ["\n  ",
    "\n  background-color: ", ";\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  border-radius: ", ";\n"])), function (props) {
    if (typeof props.size === 'number') {
        return "width: " + props.size + "px; height: " + props.size + "px;";
    }
    return "width: " + (props.size || '2rem') + "; height: " + (props.size || '2rem') + ";";
}, function (props) { return props.background || '#ccc'; }, function (props) { return props.src || DefaultAvatar; }, function (props) { return (props.shape === 'square' ? '4px' : '50%'); });
export var CustomRatioImage = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  padding-top: calc(", " * ", ");\n  width: ", ";\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  ", ";\n  opacity: ", ";\n"], ["\n  padding-top: calc(", " * ", ");\n  width: ", ";\n  background-image: url(", ");\n  background-size: cover;\n  background-position: center;\n  ",
    ";\n  opacity: ", ";\n"])), function (props) { return props.width; }, function (props) { return props.ratio; }, function (props) { return props.width; }, function (props) { return props.src; }, function (props) {
    return props.shape === 'rounded' ? 'border-radius: 4px;' : props.shape === 'circle' ? 'border-radius: 50%;' : '';
}, function (props) { return props.disabled && 0.4; });
var templateObject_1, templateObject_2;
//# sourceMappingURL=Image.js.map
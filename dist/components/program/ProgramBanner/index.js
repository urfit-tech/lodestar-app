var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import { BREAK_POINT } from '../../common/Responsive';
export var StyledTags = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: 1rem;\n  color: white;\n  font-size: 14px;\n"], ["\n  margin-bottom: 1rem;\n  color: white;\n  font-size: 14px;\n"])));
export var StyledTitle = styled.h1(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  margin: 0;\n  color: white;\n  font-size: 28px;\n  line-height: 1.23;\n  letter-spacing: 0.23px;\n\n  @media (min-width: ", "px) {\n    font-size: 40px;\n  }\n"], ["\n  margin: 0;\n  color: white;\n  font-size: 28px;\n  line-height: 1.23;\n  letter-spacing: 0.23px;\n\n  @media (min-width: ", "px) {\n    font-size: 40px;\n  }\n"])), BREAK_POINT);
export var StyledVideoWrapper = styled.div(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  position: relative;\n  padding-top: 56.25%;\n  ", "\n  background-size: cover;\n  background-position: center;\n"], ["\n  position: relative;\n  padding-top: 56.25%;\n  ", "\n  background-size: cover;\n  background-position: center;\n"])), function (props) { return props.backgroundImage && "background-image: url(" + props.backgroundImage + ");"; });
export var StyledReactPlayer = styled(ReactPlayer)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: black;\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: black;\n"])));
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=index.js.map
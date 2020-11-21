var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { Button, Skeleton } from 'antd';
import { render } from 'mustache';
import React, { useContext, useEffect, useRef } from 'react';
import ReactGA from 'react-ga';
import { Helmet } from 'react-helmet';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useAuth } from '../components/auth/AuthContext';
import Responsive, { BREAK_POINT } from '../components/common/Responsive';
import { BraftContent } from '../components/common/StyledBraftEditor';
import DefaultLayout from '../components/layout/DefaultLayout';
import PerpetualProgramBanner from '../components/program/ProgramBanner/PerpetualProgramBanner';
import SubscriptionProgramBanner from '../components/program/ProgramBanner/SubscriptionProgramBanner';
import ProgramContentListSection from '../components/program/ProgramContentListSection';
import ProgramInfoBlock from '../components/program/ProgramInfoBlock';
import ProgramInstructorCollectionBlock from '../components/program/ProgramInstructorCollectionBlock';
import ProgramPerpetualPlanCard from '../components/program/ProgramPerpetualPlanCard';
import ProgramSubscriptionPlanSection from '../components/program/ProgramSubscriptionPlanSection';
import { useApp } from '../containers/common/AppContext';
import PodcastPlayerContext from '../contexts/PodcastPlayerContext';
import { desktopViewMixin, rgba } from '../helpers';
import { commonMessages } from '../helpers/translation';
import { useProgram } from '../hooks/program';
import ForbiddenPage from './ForbiddenPage';
var StyledIntroWrapper = styled.div(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), desktopViewMixin(css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    order: 1;\n    padding-left: 35px;\n  "], ["\n    order: 1;\n    padding-left: 35px;\n  "])))));
var ProgramAbstract = styled.span(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding-right: 2px;\n  padding-bottom: 2px;\n  background-image: linear-gradient(\n    to bottom,\n    transparent 40%,\n    ", " 40%\n  );\n  background-repeat: no-repeat;\n  font-size: 20px;\n  font-weight: bold;\n  white-space: pre-line;\n"], ["\n  padding-right: 2px;\n  padding-bottom: 2px;\n  background-image: linear-gradient(\n    to bottom,\n    transparent 40%,\n    ", " 40%\n  );\n  background-repeat: no-repeat;\n  font-size: 20px;\n  font-weight: bold;\n  white-space: pre-line;\n"])), function (props) { return rgba(props.theme['@primary-color'], 0.1); });
var ProgramIntroBlock = styled.div(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  position: relative;\n  padding-top: 2.5rem;\n  padding-bottom: 6rem;\n  background: white;\n\n  @media (min-width: ", "px) {\n    padding-top: 3.5rem;\n    padding-bottom: 1rem;\n  }\n"], ["\n  position: relative;\n  padding-top: 2.5rem;\n  padding-bottom: 6rem;\n  background: white;\n\n  @media (min-width: ", "px) {\n    padding-top: 3.5rem;\n    padding-bottom: 1rem;\n  }\n"])), BREAK_POINT);
var FixedBottomBlock = styled.div(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  margin: auto;\n  position: fixed;\n  width: 100%;\n  bottom: ", ";\n  left: 0;\n  right: 0;\n  z-index: 999;\n"], ["\n  margin: auto;\n  position: fixed;\n  width: 100%;\n  bottom: ", ";\n  left: 0;\n  right: 0;\n  z-index: 999;\n"])), function (props) { return props.bottomSpace || 0; });
var StyledButtonWrapper = styled.div(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  padding: 0.5rem 0.75rem;\n  background: white;\n"], ["\n  padding: 0.5rem 0.75rem;\n  background: white;\n"])));
var ProgramPage = function () {
    var _a;
    var formatMessage = useIntl().formatMessage;
    var programId = useParams().programId;
    var currentMemberId = useAuth().currentMemberId;
    var _b = useApp(), appId = _b.id, settings = _b.settings;
    var visible = useContext(PodcastPlayerContext).visible;
    var _c = useProgram(programId), loadingProgram = _c.loadingProgram, program = _c.program;
    var containerRef = useRef(null);
    var planBlockRef = useRef(null);
    var seoMeta;
    try {
        seoMeta = (_a = JSON.parse(settings['seo.meta'])) === null || _a === void 0 ? void 0 : _a.ProgramPage;
    }
    catch (error) { }
    var siteTitle = (program === null || program === void 0 ? void 0 : program.title) ? (seoMeta === null || seoMeta === void 0 ? void 0 : seoMeta.title) ? "" + render(seoMeta.title, { programTitle: program.title })
        : program.title
        : appId;
    var siteDescription = (program === null || program === void 0 ? void 0 : program.abstract) || settings['open_graph.description'];
    var siteImage = (program === null || program === void 0 ? void 0 : program.coverUrl) || settings['open_graph.image'];
    useEffect(function () {
        if (program) {
            ReactGA.plugin.execute('ec', 'addProduct', {
                id: program.id,
                name: program.title,
                category: 'Program',
                price: "" + program.listPrice,
                quantity: '1',
                currency: 'TWD',
            });
            ReactGA.plugin.execute('ec', 'setAction', 'detail');
            ReactGA.ga('send', 'pageview');
        }
    }, [program]);
    if (loadingProgram) {
        return (React.createElement(DefaultLayout, null,
            React.createElement(Skeleton, { active: true })));
    }
    if (!program) {
        return React.createElement(ForbiddenPage, null);
    }
    var ldData = JSON.stringify({
        '@context': 'http://schema.org',
        '@type': 'Product',
        name: program.title,
        image: siteImage,
        description: siteDescription,
        url: window.location.href,
        brand: {
            '@type': 'Brand',
            name: settings['seo.name'],
            description: settings['open_graph.description'],
        },
    });
    return (React.createElement(DefaultLayout, { white: true, footerBottomSpace: program.isSubscription ? '60px' : '132px' },
        React.createElement(Helmet, null,
            React.createElement("title", null, siteTitle),
            React.createElement("meta", { name: "description", content: siteDescription }),
            React.createElement("meta", { property: "og:type", content: "website" }),
            React.createElement("meta", { property: "og:title", content: siteTitle }),
            React.createElement("meta", { property: "og:url", content: window.location.href }),
            React.createElement("meta", { property: "og:image", content: siteImage }),
            React.createElement("meta", { property: "og:description", content: siteDescription }),
            React.createElement("script", { type: "application/ld+json" }, ldData)),
        React.createElement("div", { ref: containerRef },
            program.isSubscription ? (React.createElement(SubscriptionProgramBanner, { program: program })) : (React.createElement(PerpetualProgramBanner, { program: program })),
            React.createElement(ProgramIntroBlock, null,
                React.createElement("div", { className: "container" },
                    React.createElement("div", { className: "row" },
                        !program.isSubscription && (React.createElement(StyledIntroWrapper, { className: "col-12 col-lg-4" },
                            React.createElement(ProgramInfoBlock, { program: program }))),
                        React.createElement("div", { className: "col-12 col-lg-8" },
                            React.createElement("div", { className: "mb-5" },
                                React.createElement(ProgramAbstract, null, program.abstract)),
                            React.createElement("div", { className: "mb-5" },
                                React.createElement(BraftContent, null, program.description)),
                            React.createElement("div", { className: "mb-5" },
                                React.createElement(ProgramContentListSection, { memberId: currentMemberId || '', program: program, trialOnly: program.isSubscription || false }))),
                        program.isSubscription && (React.createElement(StyledIntroWrapper, { ref: planBlockRef, className: "col-12 col-lg-4" },
                            React.createElement("div", { className: "mb-5" },
                                React.createElement(ProgramSubscriptionPlanSection, { program: program }))))),
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-12 col-lg-8" },
                            React.createElement("div", { className: "mb-5" },
                                React.createElement(ProgramInstructorCollectionBlock, { program: program }))))))),
        React.createElement(Responsive.Default, null,
            React.createElement(FixedBottomBlock, { bottomSpace: visible ? '92px' : '' }, program.isSubscription ? (React.createElement(StyledButtonWrapper, null,
                React.createElement(Button, { type: "primary", block: true, onClick: function () { var _a; return (_a = planBlockRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); } }, formatMessage(commonMessages.button.viewSubscription)))) : (React.createElement(ProgramPerpetualPlanCard, { memberId: currentMemberId || '', program: program }))))));
};
export default ProgramPage;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=ProgramPage.js.map
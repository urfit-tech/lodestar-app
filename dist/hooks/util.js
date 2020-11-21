import { filter } from 'ramda';
import { useEffect, useRef } from 'react';
import ReactPixel from 'react-facebook-pixel';
import ReactGA from 'react-ga';
import TagManager from 'react-gtm-module';
import { hotjar } from 'react-hotjar';
import { useLocation } from 'react-router-dom';
import { useApp } from '../containers/common/AppContext';
import { routesProps } from '../Routes';
export var useRouteKeys = function () {
    var location = useLocation();
    return Object.keys(filter(function (routeProps) { return routeProps.path === location.pathname; }, routesProps));
};
export var useInterval = function (callback, delay, immediately) {
    var savedCallback = useRef();
    // 保存新回调
    useEffect(function () {
        savedCallback.current = callback;
    });
    // 建立 interval
    useEffect(function () {
        var tick = function () {
            savedCallback.current && savedCallback.current();
        };
        if (delay !== null) {
            immediately && tick();
            var id_1 = setInterval(tick, delay);
            return function () { return clearInterval(id_1); };
        }
    }, [delay, immediately]);
};
// TODO: should be context
export var useTappay = function () {
    var TPDirect = window['TPDirect'];
    var settings = useApp().settings;
    settings['tappay.app_id'] &&
        settings['tappay.app_key'] &&
        TPDirect &&
        TPDirect.setupSDK(settings['tappay.app_id'], settings['tappay.app_key'], settings['tappay.dry_run'] === 'true' ? 'sandbox' : 'production');
    return { TPDirect: TPDirect };
};
export var useGA = function () {
    var settings = useApp().settings;
    if (settings['tracking.ga_id']) {
        ReactGA.initialize(settings['tracking.ga_id'], { debug: process.env.NODE_ENV === 'development' });
        ReactGA.plugin.require('ecommerce', { debug: process.env.NODE_ENV === 'development' });
        ReactGA.plugin.require('ec', { debug: process.env.NODE_ENV === 'development' });
    }
};
export var useGAPageView = function () {
    useEffect(function () {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);
};
export var usePixel = function () {
    var settings = useApp().settings;
    settings['tracking.fb_pixel_id'] && ReactPixel.init(settings['tracking.fb_pixel_id']);
};
export var useHotjar = function () {
    var settings = useApp().settings;
    try {
        settings['tracking.hotjar_id'] &&
            settings['tracking.hotjar_sv'] &&
            hotjar.initialize(parseInt(settings['tracking.hotjar_id']), parseInt(settings['tracking.hotjar_sv']));
    }
    catch (error) {
        process.env.NODE_ENV === 'development' && console.error(error);
    }
};
export var useGTM = function () {
    var settings = useApp().settings;
    try {
        if (settings['tracking.gtm_id']) {
            TagManager.initialize({
                gtmId: settings['tracking.gtm_id'],
            });
        }
    }
    catch (error) {
        process.env.NODE_ENV === 'development' && console.error(error);
    }
};
//# sourceMappingURL=util.js.map
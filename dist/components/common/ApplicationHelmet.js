import React from 'react';
import { Helmet } from 'react-helmet';
import { useApp } from '../../containers/common/AppContext';
import { useGA, useGTM, useHotjar, usePixel } from '../../hooks/util';
var ApplicationHelmet = function () {
    var _a = useApp(), settings = _a.settings, appId = _a.id;
    var linkedJson = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings['seo.name'],
        logo: settings['seo.logo'],
        url: settings['seo.url'],
    };
    useGA();
    usePixel();
    useHotjar();
    useGTM();
    return (React.createElement(Helmet, null,
        React.createElement("link", { rel: "shortcut icon", href: settings['favicon'] }),
        React.createElement("title", null, settings['title'] || appId),
        React.createElement("meta", { name: "description", content: settings['description'] || appId }),
        React.createElement("meta", { property: "og:type", content: "website" }),
        React.createElement("meta", { property: "og:title", content: settings['open_graph.title'] }),
        React.createElement("meta", { property: "og:url", content: settings['open_graph.url'] }),
        React.createElement("meta", { property: "og:image", content: settings['open_graph.image'] }),
        React.createElement("meta", { property: "og:description", content: settings['open_graph.description'] }),
        !!linkedJson && React.createElement("script", { type: "application/ld+json" }, JSON.stringify(linkedJson))));
};
export default ApplicationHelmet;
//# sourceMappingURL=ApplicationHelmet.js.map
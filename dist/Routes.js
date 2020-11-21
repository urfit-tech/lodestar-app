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
import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PodcastPlayerBlock from './components/podcast/PodcastPlayerBlock';
import LoadablePage from './LoadablePage';
import LoadingPage from './pages/LoadingPage';
import NotFoundPage from './pages/NotFoundPage';
export var routesProps = {
    // all users
    home: {
        path: '/',
        pageName: 'HomePage',
        authenticated: false,
    },
    forgot_password: {
        path: '/forgot-password',
        pageName: 'ForgotPasswordPage',
        authenticated: false,
    },
    check_email: {
        path: '/check-email',
        pageName: 'CheckEmailPage',
        authenticated: false,
    },
    reset_password: {
        path: '/reset-password',
        pageName: 'ResetPasswordPage',
        authenticated: false,
    },
    reset_password_success: {
        path: '/reset-password-success',
        pageName: 'ResetPasswordSuccessPage',
        authenticated: false,
    },
    loading: {
        path: '/loading',
        pageName: 'LoadingPage',
        authenticated: false,
    },
    oauth2: {
        path: '/oauth2',
        pageName: 'OAuth2Page',
        authenticated: false,
    },
    terms: {
        path: '/terms',
        pageName: 'TermsPage',
        authenticated: false,
    },
    about: {
        path: '/about',
        pageName: 'AboutPage',
        authenticated: false,
    },
    creator_collection: {
        path: '/creators',
        pageName: 'CreatorCollectionPage',
        authenticated: false,
    },
    creator: {
        path: '/creators/:creatorId',
        pageName: 'CreatorPage',
        authenticated: false,
    },
    member: {
        path: '/members/:memberId',
        pageName: 'MemberPage',
        authenticated: true,
    },
    order_task: {
        path: '/tasks/order/:taskId',
        pageName: 'OrderTaskPage',
        authenticated: true,
    },
    payment_task: {
        path: '/tasks/payment/:taskId',
        pageName: 'PaymentTaskPage',
        authenticated: true,
    },
    payment: {
        path: '/payments/:paymentNo',
        pageName: 'PaymentPage',
        authenticated: true,
    },
    payment_tappay: {
        path: '/payments/:paymentNo/tappay',
        pageName: 'PaymentTapPayPage',
        authenticated: true,
    },
    search: {
        path: '/search',
        pageName: 'SearchPage',
        authenticated: false,
    },
    // CVS store select callback
    cvs_popup_callback: {
        path: '/cvs',
        pageName: 'CvsPopupCallbackPage',
        authenticated: false,
    },
    // system - checkout
    order: {
        path: '/orders/:orderId',
        pageName: 'OrderPage',
        authenticated: false,
    },
    order_product: {
        path: '/orders/:orderId/products/:orderProductId',
        pageName: 'OrderProductPage',
        authenticated: true,
    },
    cart: {
        path: '/cart',
        pageName: 'CartPage',
        authenticated: false,
    },
    // product - program
    program_collection: {
        path: '/programs',
        pageName: 'ProgramCollectionPage',
        authenticated: false,
    },
    program: {
        path: '/programs/:programId',
        pageName: 'ProgramPage',
        authenticated: false,
    },
    notification: {
        path: '/notifications',
        pageName: 'NotificationPage',
        authenticated: false,
    },
    program_content_collection: {
        path: '/programs/:programId/contents',
        pageName: 'ProgramContentCollectionPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    program_content: {
        path: '/programs/:programId/contents/:programContentId',
        pageName: 'ProgramContentPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    program_package: {
        path: '/program-packages/:programPackageId',
        pageName: 'ProgramPackagePage',
        authenticated: false,
    },
    program_package_content: {
        path: '/program-packages/:programPackageId/contents',
        pageName: 'ProgramPackageContentPage',
        authenticated: false,
    },
    // product - activity
    activity_collection: {
        path: '/activities',
        pageName: 'ActivityCollectionPage',
        authenticated: false,
    },
    activity: {
        path: '/activities/:activityId',
        pageName: 'ActivityPage',
        authenticated: false,
    },
    // product - project
    project_collection: {
        path: '/projects',
        pageName: 'ProjectCollectionPage',
        authenticated: false,
    },
    project: {
        path: '/projects/:projectId',
        pageName: 'ProjectPage',
        authenticated: false,
    },
    // product - podcast
    podcast_program_collection: {
        path: '/podcasts',
        pageName: 'PodcastProgramCollectionPage',
        authenticated: false,
    },
    podcast_program_content: {
        path: '/podcasts/:podcastProgramId',
        pageName: 'PodcastProgramContentPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    // product - merchandise
    merchandises_collection: {
        path: '/merchandises',
        pageName: 'MerchandiseCollectionPage',
        authenticated: false,
    },
    merchandises: {
        path: '/merchandises/:merchandiseId',
        pageName: 'MerchandisePage',
        authenticated: false,
    },
    // blog
    blog: {
        path: '/blog',
        pageName: 'BlogPage',
        authenticated: false,
    },
    blog_post_collection: {
        path: '/posts',
        pageName: 'BlogPostCollectionPage',
        authenticated: false,
    },
    blog_post: {
        path: '/posts/:postId',
        pageName: 'BlogPostPage',
        authenticated: false,
    },
    // general member admin
    member_profile_admin: {
        path: '/settings/profile',
        pageName: 'member/ProfileAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_contracts_admin: {
        path: '/settings/contracts',
        pageName: 'member/ContractCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_coins_admin: {
        path: '/settings/coins',
        pageName: 'member/CoinHistoryAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_points_admin: {
        path: '/settings/points',
        pageName: 'member/PointHistoryAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_orders_admin: {
        path: '/settings/orders',
        pageName: 'member/OrderCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_program_issues_admin: {
        path: '/settings/program_issues',
        pageName: 'member/ProgramIssueCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_product_issues_admin: {
        path: '/settings/product_issues',
        pageName: 'member/ProductIssueCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_coupons_admin: {
        path: '/settings/coupons',
        pageName: 'member/CouponCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_voucher_admin: {
        path: '/settings/voucher',
        pageName: 'member/VoucherCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_account_admin: {
        path: '/settings/account',
        pageName: 'member/AccountAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_cards_admin: {
        path: '/settings/cards',
        pageName: 'member/CardCollectionAdminPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
    member_social_cards: {
        path: '/settings/social-cards',
        pageName: 'member/SocialCardCollectionPage',
        authenticated: true,
        allowedUserRole: 'general-member',
    },
};
var Routes = function (_a) {
    var extra = _a.extra;
    var routesMap = __assign(__assign({}, routesProps), extra);
    return (React.createElement(Suspense, { fallback: React.createElement(LoadingPage, null) },
        React.createElement(Switch, null,
            Object.keys(routesMap).map(function (routeKey) {
                var routeProps = routesMap[routeKey];
                return (React.createElement(Route, { exact: true, key: routeKey, path: routeProps.path, render: function (props) {
                        return typeof routeProps.pageName === 'string' ? (React.createElement(LoadablePage, __assign({}, props, { pageName: routeProps.pageName, authenticated: routeProps.authenticated, allowedUserRole: routeProps.allowedUserRole }))) : (routeProps.pageName);
                    } }));
            }),
            React.createElement(Route, { exact: true, path: "/settings", render: function (props) { return (React.createElement(Redirect, { to: {
                        pathname: '/settings/profile',
                        state: { from: props.location },
                    } })); } }),
            React.createElement(Route, { exact: true, path: "/funding/:fundingId", render: function (props) { return (React.createElement(Redirect, { to: {
                        pathname: "/projects/" + props.match.params.fundingId,
                        state: { from: props.location },
                    } })); } }),
            React.createElement(Route, { path: "/error", component: function () { return React.createElement(NotFoundPage, { error: true }); } }),
            React.createElement(Route, { component: NotFoundPage })),
        React.createElement(PodcastPlayerBlock, null)));
};
export default Routes;
//# sourceMappingURL=Routes.js.map
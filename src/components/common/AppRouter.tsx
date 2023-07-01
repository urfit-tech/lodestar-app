import React, { useContext } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import LoadablePage from '../../LoadablePage'
import AppPage from '../../pages/AppPage'
import LoadingPage from '../../pages/LoadingPage'
import NotFoundPage from '../../pages/NotFoundPage'

export type RouteProps = {
  path: string
  pageName: string | React.ReactElement
}
type RoutesMap = { [routeKey: string]: RouteProps }

const defaultRoutesMap: RoutesMap = {
  // custom
  home: {
    path: '/',
    pageName: 'HomePage',
  },
  // meeting
  meetsUs: {
    path: '/meets/us',
    pageName: 'MeetingPage',
  },
  meetsOne: {
    path: '/meets/:username',
    pageName: 'MeetingPage',
  },
  // system
  error: {
    path: '/error',
    pageName: <NotFoundPage variant="error" />,
  },
  repairing: {
    path: '/repairing',
    pageName: <NotFoundPage variant="repairing" />,
  },
  // all users
  auth: {
    path: '/auth',
    pageName: 'AuthPage',
  },
  line_binding: {
    path: '/line-binding',
    pageName: 'LineBindingPage',
  },
  forgot_password: {
    path: '/forgot-password',
    pageName: 'ForgotPasswordPage',
  },
  check_email: {
    path: '/check-email',
    pageName: 'CheckEmailPage',
  },
  reset_password: {
    path: '/reset-password',
    pageName: 'ResetPasswordPage',
  },
  reset_password_success: {
    path: '/reset-password-success',
    pageName: 'ResetPasswordSuccessPage',
  },
  verify_email: {
    path: '/verify-email',
    pageName: 'VerifyEmailPage',
  },
  oauth2: {
    path: '/oauth2',
    pageName: 'OAuth2Page',
  },
  oauth2_provider: {
    path: '/oauth2/:provider',
    pageName: 'OAuth2Page',
  },
  join: {
    path: '/join',
    pageName: 'JoinPage',
  },
  terms: {
    path: '/terms',
    pageName: 'TermsPage',
  },
  creator_collection: {
    path: '/creators',
    pageName: 'CreatorCollectionPage',
  },
  creator: {
    path: '/creators/:creatorId',
    pageName: 'CreatorPage',
  },
  creator_display: {
    path: '/creators-display',
    pageName: 'CreatorDisplayedPage',
  },
  member: {
    path: '/members/:memberId',
    pageName: 'MemberPage',
  },
  member_contract: {
    path: '/members/:memberId/contracts/:memberContractId',
    pageName: 'ContractPage',
  },

  order_task: {
    path: '/tasks/order/:taskId',
    pageName: 'OrderTaskPage',
  },
  payment_task: {
    path: '/tasks/payment/:taskId',
    pageName: 'PaymentTaskPage',
  },

  payment: {
    path: '/payments/:paymentNo',
    pageName: 'PaymentPage',
  },

  payment_tappay: {
    path: '/payments/:paymentNo/tappay',
    pageName: 'PaymentTapPayPage',
  },

  search: {
    path: '/search',
    pageName: 'SearchPage',
  },
  search_advanced: {
    path: '/search/advanced',
    pageName: 'AdvancedSearchPage',
  },
  redeem: {
    path: '/redeem',
    pageName: 'RedeemPage',
  },
  profile: {
    path: '/@:username',
    pageName: 'ProfilePage',
  },
  group_buying_received: {
    path: '/group-buying-received',
    pageName: 'GroupBuyingReceivedPage',
  },

  // system - checkout
  order: {
    path: '/orders/:orderId',
    pageName: 'OrderPage',
  },
  order_product: {
    path: '/orders/:orderId/products/:orderProductId',
    pageName: 'OrderProductPage',
  },
  cart: {
    path: '/cart',
    pageName: 'CartPage',
  },

  // product - program
  program_collection: {
    path: '/programs',
    pageName: 'ProgramCollectionPage',
  },
  program: {
    path: '/programs/:programId',
    pageName: 'ProgramPage',
  },
  notification: {
    path: '/notifications',
    pageName: 'NotificationPage',
  },
  program_content_cutscene: {
    path: '/programs/:programId/contents',
    pageName: 'ProgramContentCutscenePage',
  },
  program_content: {
    path: '/programs/:programId/contents/:programContentId',
    pageName: 'ProgramContentPage',
  },
  program_package: {
    path: '/program-packages/:programPackageId',
    pageName: 'ProgramPackagePage',
  },
  program_package_content: {
    path: '/program-packages/:programPackageId/contents',
    pageName: 'ProgramPackageContentPage',
  },

  // product - activity
  activity_collection: {
    path: '/activities',
    pageName: 'ActivityCollectionPage',
  },
  activity: {
    path: '/activities/:activityId',
    pageName: 'ActivityPage',
  },

  // product - project
  project_collection: {
    path: '/projects',
    pageName: 'ProjectCollectionPage',
  },
  project: {
    path: '/projects/:projectId',
    pageName: 'ProjectPage',
  },

  // product - podcast
  podcast_albums_collection: {
    path: '/podcast-albums',
    pageName: 'PodcastAlbumCollectionPage',
  },
  podcast_albums: {
    path: '/podcast-albums/:podcastAlbumId',
    pageName: 'PodcastAlbumPage',
  },
  podcast_program_collection: {
    path: '/podcasts',
    pageName: 'PodcastProgramCollectionPage',
  },
  podcast_program_content: {
    path: '/podcasts/:podcastProgramId',
    pageName: 'PodcastProgramContentPage',
  },

  // product - merchandise
  merchandises_collection: {
    path: '/merchandises',
    pageName: 'MerchandiseCollectionPage',
  },
  merchandises: {
    path: '/merchandises/:merchandiseId',
    pageName: 'MerchandisePage',
  },
  // CVS store select callback
  cvs_popup_callback: {
    path: '/cvs',
    pageName: 'CvsPopupCallbackPage',
  },

  // blog
  blog: {
    path: '/blog',
    pageName: 'BlogPage',
  },
  blog_post_collection: {
    path: '/posts',
    pageName: 'BlogPostCollectionPage',
  },
  blog_post: {
    path: '/posts/:searchId',
    pageName: 'BlogPostPage',
  },

  // practice
  practice: {
    path: '/practices/:practiceId',
    pageName: 'PracticePage',
  },
  // certificate
  certificate: {
    path: '/member-certificates/:memberCertificateId',
    pageName: 'MemberCertificatePage',
  },
  // general member admin
  member_settings: {
    path: '/settings',
    pageName: <Redirect to={{ pathname: '/settings/profile' }} />,
  },
  member_profile_admin: {
    path: '/settings/profile',
    pageName: 'member/ProfileAdminPage',
  },
  member_contracts_admin: {
    path: '/settings/contracts',
    pageName: 'member/ContractCollectionAdminPage',
  },
  member_coins_admin: {
    path: '/settings/coins',
    pageName: 'member/CoinHistoryAdminPage',
  },
  member_points_admin: {
    path: '/settings/points',
    pageName: 'member/PointHistoryAdminPage',
  },
  member_orders_admin: {
    path: '/settings/orders',
    pageName: 'member/OrderCollectionAdminPage',
  },
  member_program_issues_admin: {
    path: '/settings/program-issues',
    pageName: 'member/ProgramIssueCollectionAdminPage',
  },
  member_product_issues_admin: {
    path: '/settings/product-issues',
    pageName: 'member/ProductIssueCollectionAdminPage',
  },
  member_practices_admin: {
    path: '/settings/practices',
    pageName: 'member/PracticeCollectionAdminPage',
  },
  member_coupons_admin: {
    path: '/settings/coupons',
    pageName: 'member/CouponCollectionAdminPage',
  },
  member_voucher_admin: {
    path: '/settings/voucher',
    pageName: 'member/VoucherCollectionAdminPage',
  },
  member_group_buying_admin: {
    path: '/settings/group-buying',
    pageName: 'GroupBuyingCollectionPage',
  },
  member_account_admin: {
    path: '/settings/account',
    pageName: 'member/AccountAdminPage',
  },
  member_cards_admin: {
    path: '/settings/cards',
    pageName: 'member/CardCollectionAdminPage',
  },
  member_social_cards: {
    path: '/settings/social-cards',
    pageName: 'member/SocialCardCollectionPage',
  },
  member_certificates_admin: {
    path: '/settings/certificates',
    pageName: 'member/CertificateCollectionAdminPage',
  },
  member_device_admin: {
    path: '/settings/devices',
    pageName: 'member/DeviceManagementAdminPage',
  },
  // deprecated
  funding: {
    path: '/funding/:projectId',
    pageName: 'ProjectPage',
  },
}
const AppRouterContext = React.createContext<{ routesMap: RoutesMap }>({ routesMap: {} })
const AppRouter: React.FC<{ extra?: RoutesMap }> = ({ children, extra }) => {
  const routesMap: RoutesMap = {
    ...defaultRoutesMap,
    ...extra,
  }
  return (
    <AppRouterContext.Provider value={{ routesMap }}>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <React.Suspense fallback={<LoadingPage />}>
            <Switch>
              {Object.values(routesMap).map(routeMap => (
                <Route
                  exact
                  key={routeMap.path}
                  path={routeMap.path}
                  render={() => (
                    <AppPage
                      renderFallback={() =>
                        typeof routeMap.pageName === 'string' ? (
                          <LoadablePage key={routeMap.path} pageName={routeMap.pageName} />
                        ) : (
                          routeMap.pageName
                        )
                      }
                    />
                  )}
                />
              ))}
              <Route component={NotFoundPage} />
            </Switch>
          </React.Suspense>
          {children}
        </QueryParamProvider>
      </BrowserRouter>
    </AppRouterContext.Provider>
  )
}

export const useAppRouter = () => useContext(AppRouterContext)
export default AppRouter

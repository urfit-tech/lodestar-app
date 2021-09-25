import React, { useContext } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { QueryParamProvider } from 'use-query-params'
import LoadablePage from '../../LoadablePage'
import AppPage from '../../pages/AppPage'
import LoadingPage from '../../pages/LoadingPage'
import NotFoundPage from '../../pages/NotFoundPage'
import { UserRole } from '../../types/member'
import PodcastPlayerBlock from '../podcast/PodcastPlayerBlock'

export type RouteProps = {
  path: string
  pageName: string | React.ReactElement
  allowedUserRole: UserRole
}
type RoutesMap = { [routeKey: string]: RouteProps }

const defaultRoutesMap: RoutesMap = {
  // system
  error: {
    path: '/error',
    pageName: <NotFoundPage variant="error" />,
    allowedUserRole: 'anonymous',
  },
  repairing: {
    path: '/repairing',
    pageName: <NotFoundPage variant="repairing" />,
    allowedUserRole: 'anonymous',
  },
  // all users
  home: {
    path: '/',
    pageName: 'HomePage',
    allowedUserRole: 'anonymous',
  },
  auth: {
    path: '/auth',
    pageName: 'AuthPage',
    allowedUserRole: 'anonymous',
  },
  line_binding: {
    path: '/line-binding',
    pageName: 'LineBindingPage',
    allowedUserRole: 'general-member',
  },
  forgot_password: {
    path: '/forgot-password',
    pageName: 'ForgotPasswordPage',
    allowedUserRole: 'anonymous',
  },
  check_email: {
    path: '/check-email',
    pageName: 'CheckEmailPage',
    allowedUserRole: 'anonymous',
  },
  reset_password: {
    path: '/reset-password',
    pageName: 'ResetPasswordPage',
    allowedUserRole: 'anonymous',
  },
  reset_password_success: {
    path: '/reset-password-success',
    pageName: 'ResetPasswordSuccessPage',
    allowedUserRole: 'anonymous',
  },
  oauth2: {
    path: '/oauth2',
    pageName: 'OAuth2Page',
    allowedUserRole: 'anonymous',
  },
  oauth2_provider: {
    path: '/oauth2/:provider',
    pageName: 'OAuth2Page',
    allowedUserRole: 'anonymous',
  },
  terms: {
    path: '/terms',
    pageName: 'TermsPage',
    allowedUserRole: 'anonymous',
  },
  about: {
    path: '/about',
    pageName: 'AboutPage',
    allowedUserRole: 'anonymous',
  },
  creator_collection: {
    path: '/creators',
    pageName: 'CreatorCollectionPage',
    allowedUserRole: 'anonymous',
  },
  creator: {
    path: '/creators/:creatorId',
    pageName: 'CreatorPage',
    allowedUserRole: 'anonymous',
  },
  creator_display: {
    path: '/creators-display',
    pageName: 'CreatorDisplayedPage',
    allowedUserRole: 'anonymous',
  },
  member: {
    path: '/members/:memberId',
    pageName: 'MemberPage',
    allowedUserRole: 'general-member',
  },
  member_contract: {
    path: '/members/:memberId/contracts/:memberContractId',
    pageName: 'ContractPage',
    allowedUserRole: 'general-member',
  },

  order_task: {
    path: '/tasks/order/:taskId',
    pageName: 'OrderTaskPage',
    allowedUserRole: 'general-member',
  },
  payment_task: {
    path: '/tasks/payment/:taskId',
    pageName: 'PaymentTaskPage',
    allowedUserRole: 'general-member',
  },

  payment: {
    path: '/payments/:paymentNo',
    pageName: 'PaymentPage',
    allowedUserRole: 'general-member',
  },

  payment_tappay: {
    path: '/payments/:paymentNo/tappay',
    pageName: 'PaymentTapPayPage',
    allowedUserRole: 'general-member',
  },

  search: {
    path: '/search',
    pageName: 'SearchPage',
    allowedUserRole: 'anonymous',
  },

  // system - checkout
  order: {
    path: '/orders/:orderId',
    pageName: 'OrderPage',
    allowedUserRole: 'anonymous',
  },
  order_product: {
    path: '/orders/:orderId/products/:orderProductId',
    pageName: 'OrderProductPage',
    allowedUserRole: 'general-member',
  },
  cart: {
    path: '/cart',
    pageName: 'CartPage',
    allowedUserRole: 'anonymous',
  },

  // product - program
  program_collection: {
    path: '/programs',
    pageName: 'ProgramCollectionPage',
    allowedUserRole: 'anonymous',
  },
  program: {
    path: '/programs/:programId',
    pageName: 'ProgramPage',
    allowedUserRole: 'anonymous',
  },
  notification: {
    path: '/notifications',
    pageName: 'NotificationPage',
    allowedUserRole: 'anonymous',
  },
  program_content_collection: {
    path: '/programs/:programId/contents',
    pageName: 'ProgramContentCollectionPage',
    allowedUserRole: 'general-member',
  },
  program_content: {
    path: '/programs/:programId/contents/:programContentId',
    pageName: 'ProgramContentPage',
    allowedUserRole: 'general-member',
  },
  program_package: {
    path: '/program-packages/:programPackageId',
    pageName: 'ProgramPackagePage',
    allowedUserRole: 'anonymous',
  },
  program_package_content: {
    path: '/program-packages/:programPackageId/contents',
    pageName: 'ProgramPackageContentPage',
    allowedUserRole: 'anonymous',
  },

  // product - activity
  activity_collection: {
    path: '/activities',
    pageName: 'ActivityCollectionPage',
    allowedUserRole: 'anonymous',
  },
  activity: {
    path: '/activities/:activityId',
    pageName: 'ActivityPage',
    allowedUserRole: 'anonymous',
  },

  // product - project
  project_collection: {
    path: '/projects',
    pageName: 'ProjectCollectionPage',
    allowedUserRole: 'anonymous',
  },
  project: {
    path: '/projects/:projectId',
    pageName: 'ProjectPage',
    allowedUserRole: 'anonymous',
  },

  // product - podcast
  podcast_albums_collection: {
    path: '/podcast-albums',
    pageName: 'PodcastAlbumCollectionPage',
    allowedUserRole: 'anonymous',
  },
  podcast_albums: {
    path: '/podcast-albums/:podcastAlbumId',
    pageName: 'PodcastAlbumPage',
    allowedUserRole: 'anonymous',
  },
  podcast_program_collection: {
    path: '/podcasts',
    pageName: 'PodcastProgramCollectionPage',
    allowedUserRole: 'anonymous',
  },
  podcast_program_content: {
    path: '/podcasts/:podcastProgramId',
    pageName: 'PodcastProgramContentPage',
    allowedUserRole: 'general-member',
  },

  // product - merchandise
  merchandises_collection: {
    path: '/merchandises',
    pageName: 'MerchandiseCollectionPage',
    allowedUserRole: 'anonymous',
  },
  merchandises: {
    path: '/merchandises/:merchandiseId',
    pageName: 'MerchandisePage',
    allowedUserRole: 'anonymous',
  },
  // CVS store select callback
  cvs_popup_callback: {
    path: '/cvs',
    pageName: 'CvsPopupCallbackPage',
    allowedUserRole: 'anonymous',
  },

  // blog
  blog: {
    path: '/blog',
    pageName: 'BlogPage',
    allowedUserRole: 'anonymous',
  },
  blog_post_collection: {
    path: '/posts',
    pageName: 'BlogPostCollectionPage',
    allowedUserRole: 'anonymous',
  },
  blog_post: {
    path: '/posts/:postId',
    pageName: 'BlogPostPage',
    allowedUserRole: 'anonymous',
  },

  // practice
  practice: {
    path: '/practices/:practiceId',
    pageName: 'PracticePage',
    allowedUserRole: 'general-member',
  },

  // general member admin
  member_settings: {
    path: '/settings',
    pageName: <Redirect to={{ pathname: '/settings/profile' }} />,
    allowedUserRole: 'general-member',
  },
  member_profile_admin: {
    path: '/settings/profile',
    pageName: 'member/ProfileAdminPage',
    allowedUserRole: 'general-member',
  },
  member_contracts_admin: {
    path: '/settings/contracts',
    pageName: 'member/ContractCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_coins_admin: {
    path: '/settings/coins',
    pageName: 'member/CoinHistoryAdminPage',
    allowedUserRole: 'general-member',
  },
  member_points_admin: {
    path: '/settings/points',
    pageName: 'member/PointHistoryAdminPage',
    allowedUserRole: 'general-member',
  },
  member_orders_admin: {
    path: '/settings/orders',
    pageName: 'member/OrderCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_program_issues_admin: {
    path: '/settings/program-issues',
    pageName: 'member/ProgramIssueCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_product_issues_admin: {
    path: '/settings/product-issues',
    pageName: 'member/ProductIssueCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_practices_admin: {
    path: '/settings/practices',
    pageName: 'member/PracticeCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_coupons_admin: {
    path: '/settings/coupons',
    pageName: 'member/CouponCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_voucher_admin: {
    path: '/settings/voucher',
    pageName: 'member/VoucherCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_group_buying_admin: {
    path: '/settings/group-buying',
    pageName: 'GroupBuyingCollectionPage',
    allowedUserRole: 'general-member',
  },
  member_account_admin: {
    path: '/settings/account',
    pageName: 'member/AccountAdminPage',
    allowedUserRole: 'general-member',
  },
  member_cards_admin: {
    path: '/settings/cards',
    pageName: 'member/CardCollectionAdminPage',
    allowedUserRole: 'general-member',
  },
  member_social_cards: {
    path: '/settings/social-cards',
    pageName: 'member/SocialCardCollectionPage',
    allowedUserRole: 'general-member',
  },
  // deprecated
  funding: {
    path: '/funding/:projectId',
    pageName: 'ProjectPage',
    allowedUserRole: 'anonymous',
  },
}
const AppRouterContext = React.createContext<{ routesMap: RoutesMap }>({ routesMap: {} })
const AppRouter: React.FC<{ extra?: RoutesMap }> = ({ children, extra }) => {
  const routesMap: { [routeKey: string]: RouteProps } = {
    ...defaultRoutesMap,
    ...extra,
  }
  const routes = Object.keys(routesMap).map(routeKey => {
    const { path, pageName } = routesMap[routeKey as keyof typeof routesMap]
    return (
      <Route
        exact
        key={routeKey}
        path={path}
        render={() => (
          <React.Suspense fallback={<LoadingPage />}>
            {typeof pageName === 'string' ? <LoadablePage pageName={pageName} /> : pageName}
          </React.Suspense>
        )}
      />
    )
  })
  return (
    <AppRouterContext.Provider value={{ routesMap }}>
      <BrowserRouter>
        <QueryParamProvider ReactRouterRoute={Route}>
          <Switch>
            {routes}
            <Route component={AppPage} />
          </Switch>
          <PodcastPlayerBlock />
        </QueryParamProvider>
      </BrowserRouter>
    </AppRouterContext.Provider>
  )
}
export const useAppRouter = () => useContext(AppRouterContext)
export default AppRouter

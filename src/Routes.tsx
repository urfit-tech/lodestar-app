import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import PodcastPlayerBlock from './components/podcast/PodcastPlayerBlock'
import LoadablePage from './LoadablePage'
import LoadingPage from './pages/LoadingPage'
import NotFoundPage from './pages/NotFoundPage'
import { UserRole } from './types/member'

export type RouteProps = {
  path: string
  pageName: string | JSX.Element
  authenticated: boolean
  allowedUserRole?: UserRole
}
export const routesProps: { [routeKey: string]: RouteProps } = {
  // all users
  home: {
    path: '/',
    pageName: 'HomePage',
    authenticated: false,
  },
  auth: {
    path: '/auth',
    pageName: 'AuthPage',
    authenticated: false,
  },
  line_binding: {
    path: '/line-binding',
    pageName: 'LineBindingPage',
    authenticated: true,
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
  creator_display: {
    path: '/creators-display',
    pageName: 'CreatorDisplayedPage',
    authenticated: false,
  },

  member: {
    path: '/members/:memberId',
    pageName: 'MemberPage',
    authenticated: true,
  },
  member_contract: {
    path: '/members/:memberId/contracts/:memberContractId',
    pageName: 'ContractPage',
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

  // practice
  practice: {
    path: '/practices/:practiceId',
    pageName: 'PracticePage',
    authenticated: true,
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
  member_practices_admin: {
    path: '/settings/practices',
    pageName: 'member/PracticeCollectionAdminPage',
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
}

const Routes: React.FC<{ extra?: { [routeKey: string]: RouteProps } }> = ({ extra }) => {
  const routesMap = { ...routesProps, ...extra }
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch>
        {Object.keys(routesMap).map(routeKey => {
          const routeProps = routesMap[routeKey as keyof typeof routesProps]
          return (
            <Route
              exact
              key={routeKey}
              path={routeProps.path}
              render={props =>
                typeof routeProps.pageName === 'string' ? (
                  <LoadablePage
                    {...props}
                    pageName={routeProps.pageName}
                    authenticated={routeProps.authenticated}
                    allowedUserRole={routeProps.allowedUserRole}
                  />
                ) : (
                  routeProps.pageName
                )
              }
            />
          )
        })}
        <Route
          exact
          path="/settings"
          render={props => (
            <Redirect
              to={{
                pathname: '/settings/profile',
                state: { from: props.location },
              }}
            />
          )}
        />
        <Route
          exact
          path="/funding/:fundingId"
          render={props => (
            <Redirect
              to={{
                pathname: `/projects/${props.match.params.fundingId}`,
                state: { from: props.location },
              }}
            />
          )}
        />
        <Route path="/error" component={() => <NotFoundPage variant="error" />} />
        <Route path="/repairing" component={() => <NotFoundPage variant="repairing" />} />
        <Route component={NotFoundPage} />
      </Switch>
      <PodcastPlayerBlock />
    </Suspense>
  )
}
export default Routes

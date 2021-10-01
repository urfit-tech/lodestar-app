/// <reference types="react-scripts" />

declare module 'coupon-code'
declare module 'react-snapshot'
declare module 'react-messenger-customer-chat'
declare module '@bobthered/tailwindcss-palette-generator'
declare module 'console' {
  export = typeof import('console')
}

type CustomFC<T = {}, V = {}> = React.FC<T & { render?: (props: V) => React.ReactElement }>
type CustomVFC<T = {}, V = {}> = React.VFC<T & { render?: (props: V) => React.ReactElement }>

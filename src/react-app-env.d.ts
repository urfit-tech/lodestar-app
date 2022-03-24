/// <reference types="react-scripts" />

declare module 'coupon-code'
declare module 'react-snapshot'
declare module 'react-messenger-customer-chat'
declare module 'react-style-editor'
declare module '@bobthered/tailwindcss-palette-generator'
declare module 'console' {
  export = typeof import('console')
}

type CustomFC<T = {}, V = {}> = React.FC<T & { render?: (props: V) => React.ReactElement }>
type CustomVFC<T = {}, V = {}> = React.VFC<T & { render?: (props: V) => React.ReactElement }>

declare module 'react-howler' {
  declare enum HOWLER_STATE {
    UNLOADED = 'unloaded',
    LOADING = 'loading',
    LOADED = 'loaded',
  }

  interface Props {
    src: string | string[]
    format?: string[] | undefined
    playing?: boolean | undefined
    mute?: boolean | undefined
    loop?: boolean | undefined
    preload?: boolean | undefined
    volume?: number | undefined
    rate?: number | undefined
    onEnd?: (() => void) | undefined
    onPause?: (() => void) | undefined
    onPlay?: ((id: number) => void) | undefined
    onVolume?: ((id: number) => void) | undefined
    onStop?: ((id: number) => void) | undefined
    onLoad?: (() => void) | undefined
    onLoadError?: ((id: number) => void) | undefined
    html5?: boolean | undefined
  }

  declare class ReactHowler extends React.Component<Props> {
    stop(id?: number): void

    duration(id?: number): number

    seek(time?: number): number

    howlerState(): HOWLER_STATE

    howler: Howl
  }
  export default ReactHowler
}

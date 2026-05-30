/// <reference types="vite/client" />

declare module 'react-spinner-loader' {
  import type { ComponentType, CSSProperties } from 'react'

  interface SpinnerLoaderProps {
    type?: 'BODY' | 'BOX'
    show?: boolean
    color?: {
      primary: string
      secondary: string
    }
    message?: string
    messageStyle?: CSSProperties
    spinnerSize?: number
    stack?: 'vertical' | 'horizontal'
  }

  const SpinnerLoader: ComponentType<SpinnerLoaderProps>

  export default SpinnerLoader
}

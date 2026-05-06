import React from 'react'

type errorState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<{}, errorState> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error | null): { hasError: boolean } {
    return { hasError: true }
  }
  componentDidCatch(error: Error | null, errorInfo: React.ErrorInfo | null): void {
    // Catch errors in any components below and re-render with error message
    console.error('errorCatch', error, errorInfo)

    if (window.location.pathname !== '/error') {
      window.location.replace('/error')
    }
  }
  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}
export default ErrorBoundary

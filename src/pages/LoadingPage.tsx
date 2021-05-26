import { Spin } from 'antd'
import React from 'react'

const LoadingPage: React.VFC = () => {
  return (
    <div className="loading">
      <Spin size="large" />
    </div>
  )
}

export default LoadingPage

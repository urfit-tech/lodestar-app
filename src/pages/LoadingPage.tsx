import { Spin } from 'antd'
import React from 'react'

const LoadingPage: React.FC = () => {
  return (
    <div className="loading">
      <Spin size="large" />
    </div>
  )
}

export default LoadingPage

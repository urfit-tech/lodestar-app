import { useToast } from '@chakra-ui/react'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { PollingStatus } from '../../helpers'

// 1. 定義動畫關鍵影格 (对应 @keyframes bounce)
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.7;
  }
  40% {
    transform: scale(1.1) translateY(-12px);
    opacity: 1;
  }
`

// 2. 定義外框容器 (对应 .typing-indicator)
const IndicatorWrapper = styled.div`
  width: 5vw;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`

// 3. 定義圓點 (对应 .typing-indicator span 及其 nth-child 變體)
const Dot = styled.span`
  display: inline-block;
  width: 1vmin;
  height: 1vmin;
  border-radius: 100%;
  margin: 0 0.5vmin;
  /* 應用跳動動畫 */
  animation: ${bounce} 1.4s infinite ease-in-out both;

  /* 第一個點：淺灰色 & 延遲 */
  &:nth-child(1) {
    background-color: #d1d1d1;
    animation-delay: -0.32s;
  }

  /* 第二個點：中灰色 & 延遲 */
  &:nth-child(2) {
    background-color: #9e9e9e;
    animation-delay: -0.16s;
  }

  /* 第三個點：深灰色 & 無延遲 */
  &:nth-child(3) {
    background-color: #616161;
  }
`

const TypingIndicator: React.FC<{ pollingStatus: PollingStatus }> = ({ pollingStatus }) => {
  const toast = useToast()

  if (pollingStatus === 'END') {
    toast({
      title: '教練已回覆你的留言！立即查看',
      status: 'success',
      duration: 3000,
      position: 'top',
    })
  }

  return pollingStatus === 'START' ? (
    <IndicatorWrapper aria-label="Loading">
      <Dot />
      <Dot />
      <Dot />
    </IndicatorWrapper>
  ) : (
    <></>
  )
}

export default TypingIndicator

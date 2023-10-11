import { Box, Skeleton } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'

const StyledBar = styled.div`
  border-radius: 5px;
  width: 100%;
  height: 8px;
  background-color: var(--gray-light);
  overflow: hidden;
`
const StyledProgress = styled.div<{ percent: number }>`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${props => props.theme['@primary-color']};
`
const StyledPercent = styled.span`
  color: var(--gray-darker);
  width: 40px;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0.4px;
`
const ProgressBar: React.VFC<{
  percent: number
  noPercent?: boolean
  className?: string
  width?: string
  loading?: boolean
}> = ({ percent, noPercent, className, width, loading }) => {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" className={`${className}`} width={width}>
      {loading ? (
        <Skeleton width="100%" height="10px" />
      ) : (
        <>
          <StyledBar className="progress-bar">
            <StyledProgress percent={percent} />
          </StyledBar>
          {!noPercent && <StyledPercent className="ml-2">{percent}%</StyledPercent>}
        </>
      )}
    </Box>
  )
}

export default ProgressBar

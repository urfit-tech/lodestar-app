import { useState } from 'react'

const MessageItemFooter: React.FC<{
  defaultRepliesVisible?: boolean
  defaultSummaryVisible?: boolean
  children: (values: {
    repliesVisible: boolean
    setRepliesVisible: React.Dispatch<React.SetStateAction<boolean>>
    summaryVisible: boolean
    setSummaryVisible: React.Dispatch<React.SetStateAction<boolean>>
  }) => React.ReactElement
}> = ({ defaultRepliesVisible = false, defaultSummaryVisible = false, children }) => {
  const [repliesVisible, setRepliesVisible] = useState(defaultRepliesVisible)
  const [summaryVisible, setSummaryVisible] = useState(defaultSummaryVisible)

  return children({ repliesVisible, setRepliesVisible, summaryVisible, setSummaryVisible })
}

export default MessageItemFooter

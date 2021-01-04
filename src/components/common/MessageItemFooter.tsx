import { useState } from 'react'

const MessageItemIssueFooter: React.FC<{
  defaultRepliesVisible: boolean
  children: (values: {
    repliesVisible: boolean
    setRepliesVisible: React.Dispatch<React.SetStateAction<boolean>>
  }) => JSX.Element
}> = ({ defaultRepliesVisible, children }) => {
  const [repliesVisible, setRepliesVisible] = useState(defaultRepliesVisible)

  return children({ repliesVisible, setRepliesVisible })
}

export default MessageItemIssueFooter

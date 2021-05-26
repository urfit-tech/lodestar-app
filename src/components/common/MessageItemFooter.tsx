import { useState } from 'react'

const MessageItemFooter: React.FC<{
  defaultRepliesVisible?: boolean
  children: (values: {
    repliesVisible: boolean
    setRepliesVisible: React.Dispatch<React.SetStateAction<boolean>>
  }) => React.ReactElement
}> = ({ defaultRepliesVisible = false, children }) => {
  const [repliesVisible, setRepliesVisible] = useState(defaultRepliesVisible)

  return children({ repliesVisible, setRepliesVisible })
}

export default MessageItemFooter

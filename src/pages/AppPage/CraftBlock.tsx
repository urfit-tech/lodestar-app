import { Frame, useEditor } from '@craftjs/core'
import React, { useEffect, useRef } from 'react'

const CraftBlock: React.VFC<{
  craftData: {
    [key: string]: string
  }
}> = ({ craftData }) => {
  const isFirstRun = useRef(true)
  const { actions } = useEditor()

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    actions.deserialize(JSON.stringify(craftData))
  }, [JSON.stringify(craftData)])

  return <Frame data={JSON.stringify(craftData)} />
}

export default CraftBlock

import { Frame, useEditor } from '@craftjs/core'
import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const CraftBlock: React.VFC<{
  craftData: {
    [key: string]: string
  }
}> = ({ craftData }) => {
  const isFirstRun = useRef(true)
  const { actions } = useEditor()
  const { hash } = useLocation()

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    actions.deserialize(JSON.stringify(craftData))
  }, [JSON.stringify(craftData)])

  useEffect(() => {
    if (hash === '') {
      return
    }

    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 0)
  }, [hash])

  return <Frame data={JSON.stringify(craftData)} />
}

export default CraftBlock

import { Button } from 'antd'
import React from 'react'

export type Callout = {
  label: string
  href: string
}
const ProjectCalloutButton: React.FC<Callout> = ({ href, label }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button type="primary">
        <span>{label}</span>
      </Button>
    </a>
  )
}

export default ProjectCalloutButton

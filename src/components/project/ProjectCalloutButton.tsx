import { Button } from '@chakra-ui/react'
import React from 'react'

export type Callout = {
  label: string
  href: string
}
const ProjectCalloutButton: React.VFC<Callout> = ({ href, label }) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <Button colorScheme="primary">
        <span>{label}</span>
      </Button>
    </a>
  )
}

export default ProjectCalloutButton

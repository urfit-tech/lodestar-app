import { Box, Spinner } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { flatten } from 'ramda'
import React from 'react'
import { Redirect, useParams } from 'react-router-dom'
import ProgramContentNoAuthBlock from '../components/program/ProgramContentNoAuthBlock'
import { hasJsonStructure } from '../helpers'
import { useProgram } from '../hooks/program'

const ProgramContentCutscenePage: React.VFC = () => {
  const { id: appId } = useApp()
  const { programId } = useParams<{ programId: string }>()
  const { loadingProgram, program } = useProgram(programId)
  const { isAuthenticating, isAuthenticated } = useAuth()

  if (loadingProgram || isAuthenticating) {
    return (
      <Box className="d-flex justify-content-center align-items-center" h="100vh">
        <Spinner />
      </Box>
    )
  }
  if (!isAuthenticated) return <ProgramContentNoAuthBlock />

  let lastProgramContent: { [key: string]: string } = {}

  if (hasJsonStructure(localStorage.getItem(`${appId}.program.info`) || '')) {
    lastProgramContent = JSON.parse(localStorage.getItem(`${appId}.program.info`) || '')
  }

  // ProgramContentPage
  if (
    Object.keys(lastProgramContent).includes(programId) &&
    flatten(program?.contentSections.map(v => v.contents.map(w => w.id)) || []).includes(lastProgramContent[programId])
  ) {
    return <Redirect to={`/programs/${programId}/contents/${lastProgramContent[programId]}`} />
  } else {
    return <Redirect to={`/programs/${programId}/contents/${program?.contentSections[0].contents[0].id}`} />
  }
}

export default ProgramContentCutscenePage

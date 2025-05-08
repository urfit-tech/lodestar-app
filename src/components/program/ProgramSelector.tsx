import { Select, Spinner } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { useEquityPrograms, useProgram } from '../../hooks/program'
import programMessages from './translation'

type ProgramSelectorProps = {
  value: string
  memberId: string
  onChange?: (value: string) => void
}

export const EnrolledProgramSelector: React.FC<ProgramSelectorProps> = ({ value, memberId, onChange }) => {
  const { formatMessage } = useIntl()
  const { equityProgramIds, loadingEquityPrograms } = useEquityPrograms()

  if (loadingEquityPrograms) {
    return <Spinner />
  }

  return (
    <Select
      bg="white"
      style={{ width: '100%' }}
      defaultValue="all"
      value={value}
      onChange={e => onChange?.(e.target.value)}
    >
      <option key="all">{formatMessage(programMessages.ProgramSelector.allPrograms)}</option>
      {equityProgramIds.map(programId => (
        <ProgramSelectOption key={programId} programId={programId} />
      ))}
    </Select>
  )
}

const ProgramSelectOption: React.FC<{ programId: string }> = ({ programId }) => {
  const { program } = useProgram(programId)

  return <option value={programId}>{program && program.title}</option>
}

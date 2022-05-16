import { Select, Spinner } from '@chakra-ui/react'
import React from 'react'
import { useIntl } from 'react-intl'
import { productMessages } from '../../helpers/translation'
import { useEnrolledProgramIds, useProgram } from '../../hooks/program'

type ProgramSelectorProps = {
  value: string
  memberId: string
  onChange?: (value: string) => void
}

export const EnrolledProgramSelector: React.VFC<ProgramSelectorProps> = ({ value, memberId, onChange }) => {
  const { formatMessage } = useIntl()
  const { enrolledProgramIds, loading: loadingProgramIds } = useEnrolledProgramIds(memberId)

  if (loadingProgramIds) {
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
      <option key="all">{formatMessage(productMessages.program.select.option.allPrograms)}</option>
      {enrolledProgramIds
        .filter(enrolledProgramId => !!enrolledProgramId)
        .map(programId => (
          <ProgramSelectOption key={programId} programId={programId} />
        ))}
    </Select>
  )
}

const ProgramSelectOption: React.VFC<{ programId: string }> = ({ programId }) => {
  const { program } = useProgram(programId)

  return <option value={programId}>{program && program.title}</option>
}

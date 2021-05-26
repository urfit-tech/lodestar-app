import { Select } from 'antd'
import { SelectProps } from 'antd/lib/select'
import React from 'react'
import { useIntl } from 'react-intl'
import { productMessages } from '../../helpers/translation'
import { useEnrolledProgramIds, useProgram } from '../../hooks/program'

type ProgramSelectorProps = SelectProps<string> & {
  memberId: string
}

export const EnrolledProgramSelector: React.VFC<ProgramSelectorProps> = ({ memberId, ...selectProps }) => {
  const { formatMessage } = useIntl()
  const { enrolledProgramIds, loadingProgramIds } = useEnrolledProgramIds(memberId)

  return (
    <Select loading={loadingProgramIds} style={{ width: '100%' }} defaultValue="all" {...selectProps}>
      <Select.Option key="all">{formatMessage(productMessages.program.select.option.allPrograms)}</Select.Option>
      {enrolledProgramIds
        .filter(enrolledProgramId => !!enrolledProgramId)
        .map(programId => (
          <Select.Option key={programId}>
            <ProgramSelectOptionValue programId={programId} />
          </Select.Option>
        ))}
    </Select>
  )
}

const ProgramSelectOptionValue: React.VFC<{ programId: string }> = ({ programId }) => {
  const { program } = useProgram(programId)

  return <>{program && program.title}</>
}

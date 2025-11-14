import { gql, useMutation } from '@apollo/client'
import { Box } from '@chakra-ui/react'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'
import { MarkdownEditor } from 'lodestar-app-element/src/components/common/StyledMarkdownEditor'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { UpdateIssueSummary, UpdateIssueSummaryVariables } from '../../hasura'

const MessageSummaryBlock: React.FC<{
  issueId: string
  defaultSummary: string
  customizedStyle?: string
  options?: EasyMDE.Options
}> = ({ issueId, defaultSummary, customizedStyle, options }) => {
  const editorRef = useRef<null | EasyMDE>(null)
  const [summary, setSummary] = useState(defaultSummary ?? '')
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (editorRef.current) EasyMDE.togglePreview(editorRef.current)
  }, [])

  const onChange = useCallback((value: string) => {
    setSummary(value)
  }, [])

  const [handleSave] = useMutation<UpdateIssueSummary, UpdateIssueSummaryVariables>(updateIssueSummary, {
    variables: {
      issueId,
      summary,
    },
  })

  return (
    <Box mt="2vmin" mb="2vmin" p="2vmin" bg="#f7f8f8" borderRadius="1vmin">
      <MarkdownEditor
        customizedStyle={`${customizedStyle}`}
        options={{
          status: false,
          toolbar: false,
        }}
        value={summary}
        onChange={onChange}
      />
      {/* <Flex justify="flex-end">
        <Button mt="1vmin" variant="primary" type="submit" onClick={() => handleSave()}>
          {formatMessage(commonMessages.button.save)}
        </Button>
      </Flex> */}
    </Box>
  )
}

const updateIssueSummary = gql`
  mutation UpdateIssueSummary($issueId: uuid!, $summary: String!) {
    update_issue_by_pk(_set: { summary: $summary }, pk_columns: { id: $issueId }) {
      id
      summary
    }
  }
`

export default MessageSummaryBlock

import { gql, useMutation } from '@apollo/client'
import { Box, Button, Flex } from '@chakra-ui/react'
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import SimpleMdeReact from 'react-simplemde-editor'
import styled from 'styled-components'
import { UpdateIssueSummary, UpdateIssueSummaryVariables } from '../../hasura'
import { commonMessages } from '../../helpers/translation'

const StyledSimpleMdeReact = styled(SimpleMdeReact)`
  p {
    margin: 0 0 1em;
    line-height: 1.6;
    font-size: 1em;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0.5em 0;
    line-height: 1.2;
    font-weight: bold;
    color: #333;
  }

  h1 {
    font-size: 2em;
  }
  h2 {
    font-size: 1.5em;
  }
  h3 {
    font-size: 1.25em;
  }
  h4 {
    font-size: 1.1em;
  }
  h5,
  h6 {
    font-size: 1em;
  }

  /* 列表元素 */
  ul,
  ol {
    margin: 1em 0;
    padding-left: 2em;
  }

  li {
    margin: 0.5em 0;
    line-height: 1.5;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  li {
    list-style-position: outside;
  }

  ul ul,
  ul ol,
  ol ul,
  ol ol {
    margin: 0;
    padding-left: 1em;
  }

  /* 連結樣式 */
  a {
    color: #0066cc;
    text-decoration: none;
    border-bottom: 1px solid currentColor;
  }

  a:hover {
    color: #003366;
    text-decoration: underline;
  }

  /* 圖片樣式 */
  img {
    max-width: 100%;
    height: auto;
    border: 0;
    vertical-align: middle;
  }

  /* 表格樣式 */
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  th,
  td {
    padding: 0.5em;
    border: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f5f5f5;
    font-weight: bold;
  }

  /* 其他元素 */
  blockquote {
    margin: 1em 0;
    padding: 0.5em 1em;
    border-left: 4px solid #ddd;
    font-style: italic;
  }
`

const MessageSummaryBlock: React.FC<{ issueId: string; defaultSummary: string }> = ({ issueId, defaultSummary }) => {
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
      <StyledSimpleMdeReact
        options={{
          status: false,
        }}
        getMdeInstance={instance => {
          editorRef.current = instance
        }}
        value={summary}
        onChange={onChange}
      />
      <Flex justify="flex-end">
        <Button mt="1vmin" variant="primary" type="submit" onClick={() => handleSave()}>
          {formatMessage(commonMessages.button.save)}
        </Button>
      </Flex>
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

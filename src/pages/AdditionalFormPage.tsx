import { gql, useMutation } from '@apollo/client'
import { Box, Button, FormControl, FormLabel, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { Form } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { BooleanParam, useQueryParams } from 'use-query-params'
import { v4 as uuid } from 'uuid'
import FileUploader from '../components/common/FileUploader'
import ImageUploader from '../components/common/ImageUploader'
import DefaultLayout from '../components/layout/DefaultLayout'
import hasura from '../hasura'
import { uploadFile } from '../helpers'

const StyledForm = styled.form`
  padding: 48px 24px;
`

const useUpdateMemberMetadata = () => {
  const [updateMemberMetadata] = useMutation<hasura.UpdateMemberMetadata, hasura.UpdateMemberMetadataVariables>(
    gql`
      mutation UpdateMemberMetadata($memberId: String!, $metadata: jsonb) {
        update_member(where: { id: { _eq: $memberId } }, _append: { metadata: $metadata }) {
          affected_rows
        }
      }
    `,
  )

  return updateMemberMetadata
}

const cardImageId = uuid()
const credentialImageId = uuid()
const bankBookImageId = uuid()
const fileIds: string[] = []

const AdditionalFormPage: React.FC<FormComponentProps> = ({ form }) => {
  const { id: appId } = useApp()
  const { authToken, currentMemberId } = useAuth()
  const updateMemberMetadata = useUpdateMemberMetadata()
  const [{ noHeader, noFooter }] = useQueryParams({
    noHeader: BooleanParam,
    noFooter: BooleanParam,
  })

  const [cardImageFile, setCardImageFile] = useState<File | null>(null)
  const [credentialImageFile, setCredentialImageFile] = useState<File | null>(null)
  const [bankBookImageFile, setBankBookImageFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit } = useForm()

  const onSubmit = handleSubmit(async ({ name, email, notes }) => {
    if (
      !name ||
      !email ||
      !cardImageFile ||
      !credentialImageFile ||
      !bankBookImageFile ||
      files.length === 0 ||
      !currentMemberId
    ) {
      return
    }

    setIsSubmitting(true)
    const path = `chailease/additional_form/${appId}`

    await uploadFile(`${path}/${cardImageId}`, cardImageFile, authToken)
    await uploadFile(`${path}/${credentialImageId}`, credentialImageFile, authToken)
    await uploadFile(`${path}/${bankBookImageId}`, bankBookImageFile, authToken)
    for (let index = 0; files[index]; index++) {
      const file = files[index]
      const fileId = uuid()
      fileIds.push(fileId)
      await uploadFile(`${path}/${fileId}`, file, authToken)
    }

    await updateMemberMetadata({
      variables: {
        memberId: currentMemberId,
        metadata: {
          additionalProfile: {
            name,
            email,
            cardImageId,
            credentialImageId,
            bankBookImageId,
            fileIds,
            notes,
          },
        },
      },
    })

    setIsSubmitting(false)
  })

  return (
    <DefaultLayout noFooter={noFooter} noHeader={noHeader}>
      <Box display="flex" justifyContent="center" justifyItems="center">
        <Box width={{ base: '100%', md: '50%' }} backgroundColor="white" marginY={{ base: '0', md: '30px' }}>
          <StyledForm
            onSubmit={e => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <Heading as="h3" size="lg" className="mb-4 text-center">
              金流補件表
            </Heading>

            <FormControl className="mb-3" isRequired>
              <FormLabel>姓名</FormLabel>
              <Input name="name" placeholder="姓名" ref={register} />
            </FormControl>

            <FormControl className="mb-3" isRequired>
              <FormLabel>Email</FormLabel>
              <Input name="email" placeholder="Email" type="email" ref={register} />
            </FormControl>

            <FormControl className="mb-3" isRequired>
              <FormLabel>證件上傳（學生證、工作證、軍公教證）</FormLabel>
              <ImageUploader file={cardImageFile} onChange={file => setCardImageFile(file)} />
            </FormControl>

            <FormControl className="mb-3" isRequired>
              <FormLabel>證明上傳（勞保、在職證明、在學證明、畢業證書）</FormLabel>
              <ImageUploader file={credentialImageFile} onChange={file => setCredentialImageFile(file)} />
            </FormControl>

            <FormControl className="mb-3" isRequired>
              <FormLabel>存摺封面</FormLabel>
              <ImageUploader file={bankBookImageFile} onChange={file => setBankBookImageFile(file)} />
            </FormControl>

            <FormControl className="mb-3" isRequired>
              <FormLabel>
                財力證明電子對帳單、交易明細（此為近6個月的電子對帳單或交易明細，通常是PDF檔，若有鎖密碼請於備註填寫，不可使用App網銀截圖）
              </FormLabel>
              <FileUploader multiple showUploadList fileList={files} onChange={files => setFiles(files)} />
            </FormControl>

            <FormControl className="mb-3">
              <FormLabel>備註</FormLabel>
              <Textarea name="notes" placeholder="備註" ref={register} />
            </FormControl>

            <Text>
              以上資料僅限於申請現金分期相關服務使用，同意送出後視為學員同意貴司依照個人資料保護法規定蒐集、利用
            </Text>

            <Button marginTop="10px" width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
              送出
            </Button>
          </StyledForm>
        </Box>
      </Box>
    </DefaultLayout>
  )
}

export default Form.create()(AdditionalFormPage)

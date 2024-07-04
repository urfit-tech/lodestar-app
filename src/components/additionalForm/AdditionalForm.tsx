import { gql, useMutation } from '@apollo/client'
import { Button, FormControl, FormLabel, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import hasura from '../../hasura'
import { uploadFile } from '../../helpers'
import { AuthModalContext } from '../auth/AuthModal'
import FileUploader from '../common/FileUploader'
import ImageUploader from '../common/ImageUploader'

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
const fileImages: { imageId: string; fileName: string }[] = []

const AdditionalForm = () => {
  const { id: appId } = useApp()
  const { isAuthenticated, currentMemberId, authToken } = useAuth()
  const { setVisible: setAuthModalVisible, visible } = useContext(AuthModalContext)
  const updateMemberMetadata = useUpdateMemberMetadata()
  const { register, handleSubmit } = useForm()
  const history = useHistory()

  const [cardImageFile, setCardImageFile] = useState<File | null>(null)
  const [credentialImageFile, setCredentialImageFile] = useState<File | null>(null)
  const [bankBookImageFile, setBankBookImageFile] = useState<File | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !visible) {
      setAuthModalVisible?.(true)
    }
  }, [isAuthenticated, setAuthModalVisible, visible])

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
      fileImages.push({ imageId: fileId, fileName: file.name })
      await uploadFile(`${path}/${fileId}`, file, authToken)
    }

    await updateMemberMetadata({
      variables: {
        memberId: currentMemberId,
        metadata: {
          additionalProfile: {
            name,
            email,
            card: {
              imageId: cardImageId,
              fileName: cardImageFile.name,
            },
            credential: {
              imageId: credentialImageId,
              fileName: credentialImageFile.name,
            },
            bankBook: {
              imageId: bankBookImageId,
              fileName: bankBookImageFile.name,
            },
            fileImages,
            notes,
          },
        },
      },
    })

    setIsSubmitting(false)
    history.push('/chailease/additional-form/completed')
  })
  return (
    <StyledForm
      onSubmit={e => {
        e.preventDefault()
        if (!!isAuthenticated) {
          onSubmit()
        }
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

      <Text>以上資料僅限於申請現金分期相關服務使用，同意送出後視為學員同意貴司依照個人資料保護法規定蒐集、利用</Text>

      <Button marginTop="10px" width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
        送出
      </Button>
    </StyledForm>
  )
}

export default AdditionalForm

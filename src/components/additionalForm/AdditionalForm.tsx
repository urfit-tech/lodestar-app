import { gql, useMutation } from '@apollo/client'
import { Button, FormControl, FormLabel, Heading, Input, Text, Textarea } from '@chakra-ui/react'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import hasura from '../../hasura'
import { uploadFile } from '../../helpers'
import { AuthModalContext } from '../auth/AuthModal'
import FileUploader from '../common/FileUploader'
import ImageUploader from '../common/ImageUploader'
import additionalForm from './translation'

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
  const { formatMessage } = useIntl()
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
      const requiredFields = [
        { field: cardImageFile, name: formatMessage(additionalForm.AdditionalForm.cardImageFile) },
        { field: credentialImageFile, name: formatMessage(additionalForm.AdditionalForm.credentialImageFile) },
        { field: bankBookImageFile, name: formatMessage(additionalForm.AdditionalForm.bankBookImageFile) },
        { field: files.length > 0, name: formatMessage(additionalForm.AdditionalForm.financialProof) },
      ]
      const missingFields = requiredFields.filter(({ field }) => !field)

      if (missingFields.length > 0) {
        const errorMessages: string = missingFields.map(({ name }) => name).join(', ')
        window.alert(formatMessage(additionalForm.AdditionalForm.missingFieldsAlert, { errorMessages: errorMessages }))
        return
      }
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
        {formatMessage(additionalForm.AdditionalForm.paymentSupplementForm)}
      </Heading>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.name)}</FormLabel>
        <Input name="name" placeholder={formatMessage(additionalForm.AdditionalForm.name)} ref={register} />
      </FormControl>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.email)}</FormLabel>
        <Input
          name="email"
          placeholder={formatMessage(additionalForm.AdditionalForm.email)}
          type="email"
          ref={register}
        />
      </FormControl>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.credentialImage1)}</FormLabel>
        <ImageUploader file={cardImageFile} onChange={file => setCardImageFile(file)} />
      </FormControl>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.credentialImage2)}</FormLabel>
        <ImageUploader file={credentialImageFile} onChange={file => setCredentialImageFile(file)} />
      </FormControl>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.bankBookImageFile)}</FormLabel>
        <ImageUploader file={bankBookImageFile} onChange={file => setBankBookImageFile(file)} />
      </FormControl>

      <FormControl className="mb-3" isRequired>
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.financialProofDescription)}</FormLabel>
        <FileUploader multiple showUploadList fileList={files} onChange={files => setFiles(files)} />
      </FormControl>

      <FormControl className="mb-3">
        <FormLabel>{formatMessage(additionalForm.AdditionalForm.notes)}</FormLabel>
        <Textarea name="notes" placeholder={formatMessage(additionalForm.AdditionalForm.notes)} ref={register} />
      </FormControl>

      <Text>{formatMessage(additionalForm.AdditionalForm.agree)}</Text>

      <Button marginTop="10px" width="100%" colorScheme="primary" type="submit" isLoading={isSubmitting}>
        {formatMessage(additionalForm.AdditionalForm.submit)}
      </Button>
    </StyledForm>
  )
}

export default AdditionalForm

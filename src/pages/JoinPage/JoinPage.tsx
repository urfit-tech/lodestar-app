import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { useEffect } from 'react'
import { useHistory } from 'react-router'
import { StringParam, useQueryParam } from 'use-query-params'
import LoadingPage from '../LoadingPage'

const JoinPage: React.VFC = () => {
  const history = useHistory()
  const [permissionGroupId] = useQueryParam('permission_group_id', StringParam)
  const { isAuthenticating, authToken, currentMember } = useAuth()
  const currentUsername = currentMember?.username

  useEffect(() => {
    if (!(isAuthenticating && !authToken) && !currentUsername) {
      Cookies.set('redirect', window.location.href)
      history.push('/auth')
    }
    if (permissionGroupId && authToken && currentUsername) {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_ROOT}/sys/attach-permission-group`,
          { permissionGroupId },
          { headers: { authorization: `Bearer ${authToken}` } },
        )
        .then(({ data }) => {
          if (data.code === 'SUCCESS') {
            history.push(`/@${currentUsername}`)
          } else {
            history.push(`/error?code=${data.code}&message=${data.message}`)
          }
        })
        .catch(error => {
          history.push(`/error?code=E_UNKNOWN&message=${error}`)
        })
    }
  }, [permissionGroupId, currentUsername, isAuthenticating, history, authToken])

  return <LoadingPage />
}

export default JoinPage

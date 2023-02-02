import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import React, { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
// import ProfileAccountAdminCard from '../../components/profile/ProfileAccountAdminCard'
import ProfileBasicAdminCard from '../../components/profile/ProfileBasicAdminCard'
// import ProfilePasswordAdminCard from '../../components/profile/ProfilePasswordAdminCard'
import { commonMessages } from '../../helpers/translation'
import { ReactComponent as UserIcon } from '../../images/user.svg'
import { useHistory, useLocation } from 'react-router'
import { BooleanParam, useQueryParam } from 'use-query-params'
import { message } from 'antd'
import memberPageMessages from './translation'


const ProfileAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId } = useAuth()

  const history = useHistory()

  const { hash, pathname } = useLocation()
  const [isVerified] = useQueryParam('verified', BooleanParam)
  
  useEffect(()=>{
    if (isVerified){
      message.success(formatMessage(memberPageMessages.ProfileAdminPage.verifiedEmailSuccess))
      history.replace(pathname)
    }
  },[isVerified,history,pathname, formatMessage])

  useEffect(() => {
    
    if (hash === '') {
      return
    }

    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
    }, 0)
  }, [hash])

  return (
    <MemberAdminLayout content={{ icon: UserIcon, title: formatMessage(commonMessages.content.personalSettings) }}>
      <div className="mb-3">{currentMemberId && <ProfileBasicAdminCard memberId={currentMemberId} />}</div>
      {/* <div className="mb-3">{currentMemberId && <ProfileAccountAdminCard memberId={currentMemberId} />}</div> */}
      {/* <div className="mb-3">{currentMemberId && <ProfilePasswordAdminCard memberId={currentMemberId} />}</div> */}
    </MemberAdminLayout>
  )
}

export default ProfileAdminPage

import { message } from 'antd'
import { useApp } from 'lodestar-app-element/src/contexts/AppContext'
import { useAuth } from 'lodestar-app-element/src/contexts/AuthContext'
import { parsePayload } from 'lodestar-app-element/src/hooks/util'
import React, { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useHistory, useLocation } from 'react-router'
import { BooleanParam, useQueryParam } from 'use-query-params'
import MemberAdminLayout from '../../components/layout/MemberAdminLayout'
// import ProfileAccountAdminCard from '../../components/profile/ProfileAccountAdminCard'
import ProfileBasicAdminCard from '../../components/profile/ProfileBasicAdminCard'
// import ProfileBasicBusinessCard from '../../components/profile/ProfileBasicBusinessCard'
// import ProfileIntroBusinessCard from '../../components/profile/ProfileIntroBusinessCard'
// import ProfileOtherAdminCard from '../../components/profile/ProfileOtherAdminCard'
// import ProfilePasswordAdminCard from '../../components/profile/ProfilePasswordAdminCard'
import { commonMessages } from '../../helpers/translation'
import { UserIcon, CompanyIcon } from '../../images'
import memberPageMessages from './translation'

const ProfileAdminPage: React.VFC = () => {
  const { formatMessage } = useIntl()
  const { currentMemberId, authToken } = useAuth()
  const { enabledModules } = useApp()

  const history = useHistory()

  const { hash, pathname } = useLocation()
  const [isVerified] = useQueryParam('verified', BooleanParam)

  useEffect(() => {
    if (isVerified) {
      message.success(formatMessage(memberPageMessages.ProfileAdminPage.verifiedEmailSuccess))
      history.replace(pathname)
    }
  }, [isVerified, history, pathname, formatMessage])

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

  const payload = authToken ? parsePayload(authToken) : null
  const isBusiness = enabledModules.business_member && payload?.isBusiness
  const content = isBusiness
    ? { icon: CompanyIcon, title: formatMessage(commonMessages.content.companySettings) }
    : { icon: UserIcon, title: formatMessage(commonMessages.content.personalSettings) }

  return (
    <MemberAdminLayout content={content}>
      {isBusiness ? (
        <>
          {/* <div className="mb-3">{currentMemberId && <ProfileBasicBusinessCard memberId={currentMemberId} />}</div> */}
          {/* <div className="mb-3">{currentMemberId && <ProfileIntroBusinessCard memberId={currentMemberId} />}</div> */}
        </>
      ) : (
        <>
          <div className="mb-3">{currentMemberId && <ProfileBasicAdminCard memberId={currentMemberId} />}</div>
          {/* <div className="mb-3">{currentMemberId && <ProfileOtherAdminCard memberId={currentMemberId} />}</div> */}
        </>
      )}
      {/* <div className="mb-3" id="account">
        {currentMemberId && <ProfileAccountAdminCard memberId={currentMemberId} />}
      </div>
      <div className="mb-3">{currentMemberId && <ProfilePasswordAdminCard memberId={currentMemberId} />}</div> */}
    </MemberAdminLayout>
  )
}

export default ProfileAdminPage

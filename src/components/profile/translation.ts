import {defineMessages} from 'react-intl'

const profileMessages = {
    ProfileAccountAdminCard: defineMessages({
        sendVerifiedEmailSuccessfully: {
            id: 'profile.ProfileAccountAdminCard.sendVerifiedEmailSuccessfully',
            defaultMessage: '驗證信寄送成功'
        },
        sendEmail: {
            id: 'profile.ProfileAccountAdminCard.sendEmail',
            defaultMessage: '寄驗證信'
        },
        sendEmailAfter:{
            id: 'profile.ProfileAccountAdminCard.sendEmailAfter',
            defaultMessage: '{count} 秒後可再寄送'
        }
    })
}

export default profileMessages